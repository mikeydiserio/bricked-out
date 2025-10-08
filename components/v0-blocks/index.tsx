"use client";

import type { SavedCreation } from "@/lib/types";
import { isKvConfigured } from "@/lib/utils/check-kv-integration";
import { clearLocalStorage } from "@/lib/utils/local-storage";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Pause } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActionToolbar } from "../action-toolbar";
import { AiChatPanel } from "../ai-chat-panel";
import { AiScene } from "../ai-scene";
import { AudioPlayer } from "../audio-player";
import { ColorSelector } from "../color-selector";
import { GlobalStylesProvider } from "../global-styles";
import { IntegrationCheckDialog } from "../integration-check-dialog";
import { LoadModal } from "../load-modal";
import { SaveModal } from "../save-modal";
import { Scene } from "../scene";
import { ClearConfirmationModal } from "./clear-confirmation-modal";
import {
  type Brick,
  handleAddBrick,
  handleClearSet,
  handleDeleteBrick,
  handlePlayToggle,
  handleRedo,
  handleUndo,
  handleUpdateBrick,
} from "./events";
import * as S from "./index.styles";
import { useCameraControls } from "./use-camera-controls";
import { useColorTheme } from "./use-color-theme";
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts";
import { useLocalStorage } from "./use-local-storage";
import { useTouchHandling } from "./use-touch-handling";

export default function V0Blocks() {
  // Theme and colors
  const {
    currentTheme,
    currentColors,
    selectedColor,
    setSelectedColor,
    handleSelectColor,
    handleThemeChange,
  } = useColorTheme();

  // State for user board
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [history, setHistory] = useState<Brick[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [aiBricks, setAiBricks] = useState<Brick[]>([]);

  const [width, setWidth] = useState(2);
  const [depth, setDepth] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactionMode, setInteractionMode] = useState<
    "build" | "move" | "erase"
  >("build");
  const orbitControlsRef = useRef<any>();

  // Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [currentCreationId, setCurrentCreationId] = useState<
    string | undefined
  >();
  const [currentCreationName, setCurrentCreationName] = useState<
    string | undefined
  >();

  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [integrationDialogType, setIntegrationDialogType] = useState<
    "save" | "load"
  >("save");
  const [isKvAvailable, setIsKvAvailable] = useState(true);

  useEffect(() => {
    const checkKvAvailability = async () => {
      try {
        const available = await isKvConfigured();
        setIsKvAvailable(available);
      } catch (error) {
        console.error("Error checking KV availability:", error);
        setIsKvAvailable(false);
      }
    };

    checkKvAvailability();
  }, []);

  useTouchHandling();

  useLocalStorage({
    bricks,
    width,
    depth,
    selectedColor,
    currentTheme,
    currentCreationId,
    currentCreationName,
    setBricks,
    setWidth,
    setDepth,
    setSelectedColor,
    handleThemeChange,
    setCurrentCreationId,
    setCurrentCreationName,
    setHistory,
    setHistoryIndex,
  });

  const handleAiBuildActions = useCallback(
    (actions: any[]) => {
      const newBricks = [...aiBricks];

      actions.forEach((action) => {
        if (action.action === "add") {
          newBricks.push({
            color: action.color,
            position: action.position,
            width: action.width || 1,
            height: action.height || 1,
          });
        } else if (action.action === "remove" && action.index !== undefined) {
          newBricks.splice(action.index, 1);
        }
      });

      setAiBricks(newBricks);
    },
    [aiBricks]
  );

  const onAddBrick = useCallback(
    (brick: Brick) => {
      handleAddBrick(
        brick,
        bricks,
        setBricks,
        history,
        historyIndex,
        setHistory,
        setHistoryIndex
      );
    },
    [bricks, history, historyIndex]
  );

  const onDeleteBrick = useCallback(
    (index: number) => {
      handleDeleteBrick(
        index,
        bricks,
        setBricks,
        history,
        historyIndex,
        setHistory,
        setHistoryIndex
      );
    },
    [bricks, history, historyIndex]
  );

  const onUpdateBrick = useCallback(
    (index: number, newPosition: [number, number, number]) => {
      handleUpdateBrick(
        index,
        newPosition,
        bricks,
        setBricks,
        history,
        historyIndex,
        setHistory,
        setHistoryIndex
      );
    },
    [bricks, history, historyIndex]
  );

  const onUndo = useCallback(() => {
    console.log("Undo triggered");
    handleUndo(historyIndex, setHistoryIndex, history, setBricks);
  }, [history, historyIndex]);

  const onRedo = useCallback(() => {
    console.log("Redo triggered");
    handleRedo(historyIndex, setHistoryIndex, history, setBricks);
  }, [history, historyIndex]);

  const onClearSet = useCallback(() => {
    console.log("Clear set triggered");
    handleClearSet(setBricks, setHistory, setHistoryIndex);
    setCurrentCreationId(undefined);
    setCurrentCreationName(undefined);
    clearLocalStorage();
    setShowClearModal(false);
  }, []);

  const handleClearWithConfirmation = useCallback(() => {
    if (bricks.length > 0) {
      setShowClearModal(true);
    }
  }, [bricks.length]);

  const onPlayToggle = useCallback(() => {
    console.log("Play toggle triggered");
    handlePlayToggle(isPlaying, setIsPlaying);
  }, [isPlaying]);

  const handleModeChange = useCallback((mode: "build" | "move" | "erase") => {
    setInteractionMode(mode);
  }, []);

  const handleSave = useCallback(() => {
    if (!isKvAvailable) {
      setIntegrationDialogType("save");
      setShowIntegrationDialog(true);
    } else {
      setShowSaveModal(true);
    }
  }, [isKvAvailable]);

  const handleLoad = useCallback(() => {
    if (!isKvAvailable) {
      setIntegrationDialogType("load");
      setShowIntegrationDialog(true);
    } else {
      setShowLoadModal(true);
    }
  }, [isKvAvailable]);

  const handleLoadCreation = useCallback((creation: SavedCreation) => {
    setBricks(creation.bricks);
    const newHistory = [[...creation.bricks]];
    setHistory(newHistory);
    setHistoryIndex(0);
    setCurrentCreationId(creation.id);
    setCurrentCreationName(creation.name);
    setShowLoadModal(false);
  }, []);

  useKeyboardShortcuts({
    isPlaying,
    width,
    depth,
    currentColors,
    setWidth,
    setDepth,
    setSelectedColor,
    setInteractionMode,
    onUndo,
    onRedo,
    onPlayToggle,
    handleClearWithConfirmation,
    handleSave,
    handleLoad,
    currentTheme,
    handleThemeChange,
  });

  const { mouseButtons, enableRotate, enablePan, enableZoom } =
    useCameraControls({
      isPlaying,
      interactionMode,
    });

  return (
    <>
      <GlobalStylesProvider />
      <S.Container
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
      >
        <Canvas shadows camera={{ position: [8, 15, 20], fov: 60 }}>
          <SoftShadows size={25} samples={16} focus={0.5} />

          {/* User-controlled board */}
          <Scene
            bricks={bricks}
            selectedColor={selectedColor}
            width={width}
            depth={depth}
            onAddBrick={onAddBrick}
            onDeleteBrick={onDeleteBrick}
            onUndo={onUndo}
            onRedo={onRedo}
            isPlaying={isPlaying}
            interactionMode={interactionMode}
          />

          <AiScene bricks={aiBricks} offset={[15, 0, 0]} />

          <OrbitControls
            ref={orbitControlsRef}
            target={[7.5, 0, 0]}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            minDistance={15}
            maxDistance={50}
            autoRotate={isPlaying}
            autoRotateSpeed={1}
            enableZoom={enableZoom}
            enablePan={enablePan}
            enableRotate={enableRotate}
            mouseButtons={mouseButtons as any}
          />
        </Canvas>

        {!isPlaying && (
          <AiChatPanel
            onBuildActions={handleAiBuildActions}
            currentBricks={aiBricks}
          />
        )}

        {!isPlaying && (
          <>
            <ActionToolbar
              onModeChange={handleModeChange}
              currentMode={interactionMode}
            />
            <ColorSelector
              colors={currentColors}
              selectedColor={selectedColor}
              onSelectColor={handleSelectColor}
              onUndo={onUndo}
              onRedo={onRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              width={width}
              depth={depth}
              onWidthChange={setWidth}
              onDepthChange={setDepth}
              onClearSet={handleClearWithConfirmation}
              onPlayToggle={onPlayToggle}
              isPlaying={isPlaying}
              onSave={handleSave}
              onLoad={handleLoad}
              currentCreationId={currentCreationId}
              currentCreationName={currentCreationName}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              bricksCount={bricks.length}
            />
            <AudioPlayer />
          </>
        )}
        {isPlaying && (
          <S.PlayButton onClick={onPlayToggle} aria-label="Stop">
            <Pause size={32} strokeWidth={1.5} />
          </S.PlayButton>
        )}

        <SaveModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          bricks={bricks}
          currentId={currentCreationId}
          currentName={currentCreationName}
        />

        <LoadModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          onLoad={handleLoadCreation}
        />

        <ClearConfirmationModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onClear={onClearSet}
        />
        <IntegrationCheckDialog
          isOpen={showIntegrationDialog}
          onClose={() => setShowIntegrationDialog(false)}
          actionType={integrationDialogType}
        />
      </S.Container>
    </>
  );
}
