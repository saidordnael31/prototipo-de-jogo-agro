'use client'

import { motion } from 'framer-motion'
import { MISSION_ZONES } from '@/lib/gameData'
import type { Position, ZoneId } from '@/types/game'
import { MissionZone } from './MissionZone'
import { PlayerMarker } from './PlayerMarker'

type Props = {
  playerPosition: Position
  playerDirection: 'up' | 'down' | 'left' | 'right'
  completedZones: ZoneId[]
  currentObjectiveId: ZoneId
  nearbyZoneId: ZoneId | null
  mapPulse: number
}

export function GameMap({
  playerPosition,
  playerDirection,
  completedZones,
  currentObjectiveId,
  nearbyZoneId,
  mapPulse,
}: Props) {
  const objective = MISSION_ZONES.find((z) => z.id === currentObjectiveId)

  return (
    <motion.div
      key={mapPulse}
      animate={mapPulse > 0 ? { scale: [1, 1.012, 1] } : {}}
      transition={{ duration: 0.45 }}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-emerald/20 bg-[radial-gradient(circle_at_50%_40%,oklch(0.24_0.05_255),oklch(0.14_0.035_258))] shadow-[0_0_60px_-15px_oklch(0.74_0.16_158_/_0.4)]"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="oklch(0.83 0.14 85)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="objectivePath" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="oklch(0.83 0.14 85)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="fieldGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0" />
          </radialGradient>
          <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="oklch(0.83 0.14 85)" fillOpacity="0.85" />
          </marker>
        </defs>

        {Array.from({ length: 9 }).map((_, i) => {
          const p = (i + 1) * 10
          return (
            <g key={i} stroke="oklch(0.74 0.16 158)" strokeOpacity="0.06" strokeWidth="0.25">
              <line x1={p} y1="0" x2={p} y2="100" />
              <line x1="0" y1={p} x2="100" y2={p} />
            </g>
          )
        })}

        <rect x="0" y="0" width="100" height="100" fill="url(#fieldGlow)" />

        <path
          d="M52 14 L60 16 L64 22 L70 24 L74 30 L72 38 L78 44 L74 52 L78 60 L70 68 L64 78 L56 84 L48 86 L42 80 L38 72 L30 70 L26 62 L32 56 L28 48 L34 42 L30 34 L38 30 L42 22 L48 18 Z"
          fill="oklch(0.83 0.14 85)"
          fillOpacity="0.04"
          stroke="oklch(0.83 0.14 85)"
          strokeOpacity="0.08"
          strokeWidth="0.4"
        />

        <path
          d="M8 88 Q 40 70 50 50 Q 60 30 92 12"
          fill="none"
          stroke="oklch(0.5 0.05 70)"
          strokeOpacity="0.35"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {MISSION_ZONES.map((z) => (
          <line
            key={`bg-${z.id}`}
            x1="50"
            y1="50"
            x2={z.x}
            y2={z.y}
            stroke="url(#routeGrad)"
            strokeWidth="0.5"
            strokeDasharray="2 2.5"
            className="route-flow"
            opacity="0.5"
          />
        ))}

        <polygon
          points={MISSION_ZONES.map((z) => `${z.x},${z.y}`).join(' ')}
          fill="none"
          stroke="oklch(0.74 0.16 158)"
          strokeOpacity="0.18"
          strokeWidth="0.4"
          strokeDasharray="1.5 2"
          className="route-flow"
        />

        {objective && !completedZones.includes(objective.id) && (
          <line
            x1={playerPosition.x}
            y1={playerPosition.y}
            x2={objective.x}
            y2={objective.y}
            stroke="url(#objectivePath)"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            markerEnd="url(#arrowhead)"
            className="route-flow"
          />
        )}
      </svg>

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '50%' }}
      >
        <div className="relative flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_2px_oklch(0.83_0.14_85_/_0.7)]" />
          <div className="mt-0.5 h-6 w-[3px] rounded-full bg-gradient-to-b from-gold/80 to-emerald/20" />
          <span className="mt-1 rounded-full border border-gold/30 bg-background/60 px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-wider text-gold/90 backdrop-blur-sm">
            Torre de Dados
          </span>
        </div>
      </div>

      {MISSION_ZONES.map((zone) => (
        <MissionZone
          key={zone.id}
          zone={zone}
          completed={completedZones.includes(zone.id)}
          isCurrent={zone.id === currentObjectiveId}
          isNearby={nearbyZoneId === zone.id}
        />
      ))}

      <PlayerMarker position={playerPosition} direction={playerDirection} />

      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_10px_oklch(0.1_0.03_258_/_0.7)]" />
    </motion.div>
  )
}
