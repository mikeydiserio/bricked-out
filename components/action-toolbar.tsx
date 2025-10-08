"use client";

import { Eraser, Hammer, Move } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import * as S from "./action-toolbar.styles";
import { SimpleTooltip } from "./simple-tooltip";

interface ActionToolbarProps {
  onModeChange: (mode: "build" | "move" | "erase") => void;
  currentMode: "build" | "move" | "erase";
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onModeChange,
  currentMode,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Conditionally render tooltip based on device
  const MaybeTooltip = ({ text, children }) => {
    if (isMobile) {
      return children;
    }
    return (
      <SimpleTooltip text={text} position="right">
        {children}
      </SimpleTooltip>
    );
  };

  return (
    <S.Toolbar>
      <MaybeTooltip text="Build (b)">
        <S.ToolButton
          onClick={() => onModeChange("build")}
          $active={currentMode === "build"}
          aria-label="Build Mode (B)"
          aria-pressed={currentMode === "build"}
        >
          <Hammer size={20} strokeWidth={1.5} />
        </S.ToolButton>
      </MaybeTooltip>

      <MaybeTooltip text="Move (m)">
        <S.ToolButton
          onClick={() => onModeChange("move")}
          $active={currentMode === "move"}
          aria-label="Move Mode (M)"
          aria-pressed={currentMode === "move"}
        >
          <Move size={20} strokeWidth={1.5} />
        </S.ToolButton>
      </MaybeTooltip>

      <MaybeTooltip text="Erase (e)">
        <S.ToolButton
          onClick={() => onModeChange("erase")}
          $active={currentMode === "erase"}
          aria-label="Erase Mode (E)"
          aria-pressed={currentMode === "erase"}
        >
          <Eraser size={20} strokeWidth={1.5} />
        </S.ToolButton>
      </MaybeTooltip>
    </S.Toolbar>
  );
};
