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
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="absolute left-1/2 top-[72%] h-3 w-7 -translate-x-1/2 rounded-full bg-black/50 blur-[3px]" />

      {isMoving &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[oklch(0.55_0.05_70)]"
            style={{ transform: `rotate(${rot + 180}deg) translateY(${10 + i * 5}px)` }}
            animate={{ opacity: [0.5, 0], scale: [1, 0.3] }}
            transition={{ duration: 0.4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.12 }}
          />
        ))}

      <motion.div
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/20 blur-lg"
        animate={{ scale: isMoving ? [1, 1.25, 1] : [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: isMoving ? 0.45 : 1.2, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        animate={isMoving ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 0.22, repeat: Number.POSITIVE_INFINITY }}
        className="relative scale-[1.6]"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        <div className="relative mx-auto">
          <div className="absolute -top-4 left-1/2 h-2 w-6 -translate-x-1/2 rounded-t-md bg-gold shadow-[0_0_8px_oklch(0.83_0.14_85)]" />
          <div className="absolute -top-2.5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[oklch(0.55_0.05_60)] bg-[oklch(0.75_0.06_70)]" />
          <div className="relative mx-auto h-6 w-5 rounded-md bg-emerald shadow-[inset_0_-2px_0_oklch(0.5_0.12_158)]">
            <div className="absolute -left-1.5 top-1.5 h-2 w-2.5 rounded-full bg-emerald" />
            <div className="absolute -right-1.5 top-1.5 h-2 w-2.5 rounded-full bg-emerald" />
            <div className="absolute left-1/2 top-1 h-1 w-2 -translate-x-1/2 rounded-sm bg-gold/60" />
          </div>
          <div className="mx-auto mt-0.5 flex w-4 justify-between px-0.5">
            <div className="h-2.5 w-1.5 rounded-b-sm bg-[oklch(0.3_0.04_255)]" />
            <div className="h-2.5 w-1.5 rounded-b-sm bg-[oklch(0.3_0.04_255)]" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
