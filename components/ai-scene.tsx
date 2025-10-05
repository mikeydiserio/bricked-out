"use client"

import type React from "react"
import type { Brick } from "./v0-blocks/events"
import { LargePlane } from "./large-plane"
import { Platform } from "./platform"
import { Block } from "./block"
import { LightingSetup } from "./scene/lighting-setup"

interface AiSceneProps {
  bricks: Brick[]
  offset?: [number, number, number]
}

export const AiScene: React.FC<AiSceneProps> = ({ bricks, offset = [15, 0, 0] }) => {
  return (
    <group position={offset}>
      <LargePlane />
      <Platform />

      {/* Render all AI-placed bricks */}
      {bricks.map((brick, index) => (
        <Block
          key={index}
          color={brick.color}
          position={brick.position}
          width={brick.width}
          height={brick.height}
          isPlacing={false}
        />
      ))}

      <LightingSetup />
    </group>
  )
}
