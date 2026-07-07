'use client'

import { motion } from 'framer-motion'
import type { PlayerDirection } from '@/types/game'

type Props = {
  position: { x: number; y: number }
  direction: PlayerDirection
}

const DIR_ROTATION: Record<PlayerDirection, number> = {
  up: -90,
  down: 90,
  left: 180,
  right: 0,
}

export function PlayerMarker({ position, direction }: Props) {
  return (
    <motion.div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="relative flex items-center justify-center">
        {/* Glow externo */}
        <motion.div
          className="absolute h-10 w-10 rounded-full bg-emerald/30 blur-[3px]"
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0.35, 0.7] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
        />
        {/* Trail */}
        <motion.div
          className="absolute h-3 w-3 rounded-full bg-gold/50 blur-[1px]"
          style={{
            transform: `rotate(${DIR_ROTATION[direction]}deg) translateX(-10px)`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />
        {/* Corpo do jogador */}
        <div className="relative h-5 w-5 rounded-full border-2 border-gold bg-emerald shadow-[0_0_18px_4px_oklch(0.74_0.16_158_/_0.85)]">
          <div
            className="absolute left-1/2 top-0.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-background"
            style={{ transform: `translateX(-50%) rotate(${DIR_ROTATION[direction]}deg) translateY(-1px)` }}
          />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80" />
        </div>
      </div>
    </motion.div>
  )
}
