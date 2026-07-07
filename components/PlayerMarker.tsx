'use client'

import { motion } from 'framer-motion'
import type { PlayerDirection } from '@/types/game'

type Props = {
  position: { x: number; y: number }
  direction: PlayerDirection
  isMoving: boolean
}

const DIR_ROTATION: Record<PlayerDirection, number> = {
  up: 0,
  down: 180,
  left: -90,
  right: 90,
}

export function PlayerMarker({ position, direction, isMoving }: Props) {
  const rot = DIR_ROTATION[direction]

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      {/* Sombra */}
      <div className="absolute left-1/2 top-[70%] h-2.5 w-5 -translate-x-1/2 rounded-full bg-black/40 blur-[2px]" />

      {/* Glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/25 blur-md"
        animate={{ scale: isMoving ? [1, 1.2, 1] : [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: isMoving ? 0.5 : 1.4, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Sprite top-down */}
      <motion.div
        animate={isMoving ? { y: [0, -1.5, 0] } : {}}
        transition={{ duration: 0.28, repeat: Number.POSITIVE_INFINITY }}
        className="relative"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        {/* Corpo */}
        <div className="relative mx-auto h-5 w-4 rounded-sm bg-emerald shadow-[0_2px_0_oklch(0.55_0.12_158)]">
          {/* Cabeça */}
          <div className="absolute -top-2.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[oklch(0.72_0.06_70)] border border-[oklch(0.6_0.05_60)]" />
          {/* Chapéu */}
          <div className="absolute -top-3.5 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-t-sm bg-gold shadow-[0_0_6px_oklch(0.83_0.14_85)]" />
          {/* Braços */}
          <div className="absolute -left-1 top-1 h-1.5 w-2 rounded-full bg-emerald/80" />
          <div className="absolute -right-1 top-1 h-1.5 w-2 rounded-full bg-emerald/80" />
        </div>
        {/* Pernas */}
        <div className="mx-auto mt-0.5 flex w-3 justify-between">
          <div className="h-2 w-1 rounded-b-sm bg-[oklch(0.35_0.04_255)]" />
          <div className="h-2 w-1 rounded-b-sm bg-[oklch(0.35_0.04_255)]" />
        </div>
      </motion.div>

      {/* Trail de movimento */}
      {isMoving && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold/60"
          style={{ transform: `rotate(${rot + 180}deg) translateY(14px)` }}
          animate={{ opacity: [0.6, 0], scale: [1, 0.4] }}
          transition={{ duration: 0.35, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </div>
  )
}
