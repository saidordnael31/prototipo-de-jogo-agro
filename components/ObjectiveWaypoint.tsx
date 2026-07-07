'use client'

import { motion } from 'framer-motion'
import { Navigation } from 'lucide-react'
import { WORLD_ZOOM } from '@/lib/gameData'
import type { Position } from '@/types/game'

type Props = {
  playerPosition: Position
  objectivePosition: Position
  label: string
}

export function ObjectiveWaypoint({
  playerPosition,
  objectivePosition,
  label,
}: Props) {
  const dx = objectivePosition.x - playerPosition.x
  const dy = objectivePosition.y - playerPosition.y
  const dist = Math.hypot(dx, dy)

  if (dist < 18) return null

  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  const edgeX = 50 + Math.cos((angle * Math.PI) / 180) * 38
  const edgeY = 50 + Math.sin((angle * Math.PI) / 180) * 42

  const clampedX = Math.max(8, Math.min(92, edgeX))
  const clampedY = Math.max(8, Math.min(92, edgeY))

  return (
    <motion.div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
    >
      <div
        className="flex flex-col items-center gap-0.5"
        style={{ transform: `rotate(${angle + 90}deg)` }}
      >
        <Navigation className="h-5 w-5 fill-gold text-gold drop-shadow-[0_0_8px_oklch(0.83_0.14_85)]" />
      </div>
      <span
        className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-gold/90 px-1.5 py-0.5 text-[7px] font-bold uppercase text-background"
        style={{ transform: `rotate(0deg)` }}
      >
        {label} · {Math.round(dist * WORLD_ZOOM)}m
      </span>
    </motion.div>
  )
}
