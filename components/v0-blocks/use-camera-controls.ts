"use client"

import { useEffect, useState } from "react"
import * as THREE from "three"

interface UseCameraControlsProps {
  isPlaying: boolean
  interactionMode: "build" | "move" | "erase"
}

export function useCameraControls({ isPlaying, interactionMode }: UseCameraControlsProps) {
  const [isSpacePressed, setIsSpacePressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !event.repeat) {
        setIsSpacePressed(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsSpacePressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Determine mouse button configuration based on space key state
  const mouseButtons = {
    LEFT: isSpacePressed ? THREE.MOUSE.PAN : null,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  }

  // Enable controls in move mode or when space is pressed (for panning)
  const enableRotate = !isPlaying && (interactionMode === "move" || isSpacePressed)
  const enablePan = !isPlaying && (interactionMode === "move" || isSpacePressed)
  const enableZoom = !isPlaying && interactionMode === "move"

  return {
    mouseButtons,
    enableRotate,
    enablePan,
    enableZoom,
    isSpacePressed,
  }
}
