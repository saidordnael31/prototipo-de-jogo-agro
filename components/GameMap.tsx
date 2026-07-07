'use client'

import { motion } from 'framer-motion'
import { Navigation } from 'lucide-react'
import { MISSION_ZONES, getCameraOffset, WORLD_ZOOM } from '@/lib/gameData'
import type { Position, ZoneId } from '@/types/game'
import { MissionZone } from './MissionZone'
import { PlayerMarker } from './PlayerMarker'
import { ObjectiveWaypoint } from './ObjectiveWaypoint'

type Props = {
  playerPosition: Position
  playerDirection: 'up' | 'down' | 'left' | 'right'
  completedZones: ZoneId[]
  currentObjectiveId: ZoneId
  nearbyZoneId: ZoneId | null
  mapPulse: number
  isMoving: boolean
}

export function GameMap({
  playerPosition,
  playerDirection,
  completedZones,
  currentObjectiveId,
  nearbyZoneId,
  mapPulse,
  isMoving,
}: Props) {
  const camera = getCameraOffset(playerPosition.x, playerPosition.y, WORLD_ZOOM)
  const objective = MISSION_ZONES.find((z) => z.id === currentObjectiveId)

  return (
    <motion.div
      key={mapPulse}
      animate={mapPulse > 0 ? { scale: [1, 1.015, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-emerald/25 shadow-[0_0_60px_-15px_oklch(0.74_0.16_158_/_0.45)]"
    >
      {/* Viewport com câmera */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate(${camera.x}%, ${camera.y}%)`,
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            width: `${WORLD_ZOOM * 100}%`,
            height: `${WORLD_ZOOM * 100}%`,
            marginLeft: `${-(WORLD_ZOOM - 1) * 50}%`,
            marginTop: `${-(WORLD_ZOOM - 1) * 50}%`,
          }}
        >
          {/* Terreno com tiles de fazenda */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  oklch(0.28 0.06 145 / 0.15) 0px,
                  oklch(0.28 0.06 145 / 0.15) 1px,
                  transparent 1px,
                  transparent 16px
                ),
                repeating-linear-gradient(
                  90deg,
                  oklch(0.28 0.06 145 / 0.15) 0px,
                  oklch(0.28 0.06 145 / 0.15) 1px,
                  transparent 1px,
                  transparent 16px
                ),
                repeating-linear-gradient(
                  45deg,
                  oklch(0.22 0.05 140 / 0.3) 0px,
                  oklch(0.22 0.05 140 / 0.3) 8px,
                  oklch(0.26 0.06 150 / 0.25) 8px,
                  oklch(0.26 0.06 150 / 0.25) 16px
                ),
                radial-gradient(circle at 50% 50%, oklch(0.3 0.07 145), oklch(0.18 0.04 255))
              `,
            }}
          />

          {/* Estradas de terra */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M50 5 L50 95 M5 50 L95 50"
              fill="none"
              stroke="oklch(0.45 0.05 70)"
              strokeWidth="4"
              strokeOpacity="0.4"
              strokeLinecap="round"
            />
            <path
              d="M15 15 Q 50 50 85 85"
              fill="none"
              stroke="oklch(0.42 0.04 65)"
              strokeWidth="2.5"
              strokeOpacity="0.35"
              strokeDasharray="3 2"
            />
            <path
              d="M85 15 Q 50 50 15 85"
              fill="none"
              stroke="oklch(0.42 0.04 65)"
              strokeWidth="2.5"
              strokeOpacity="0.35"
              strokeDasharray="3 2"
            />

            {objective && !completedZones.includes(objective.id) && (
              <line
                x1={playerPosition.x}
                y1={playerPosition.y}
                x2={objective.x}
                y2={objective.y}
                stroke="oklch(0.83 0.14 85)"
                strokeWidth="0.8"
                strokeOpacity="0.7"
                strokeDasharray="2 2"
                className="route-flow"
              />
            )}
          </svg>

          {/* Centro — Torre de Dados */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="relative flex flex-col items-center">
              <div className="h-8 w-10 rounded-t-lg border border-gold/40 bg-gradient-to-b from-[oklch(0.35_0.04_255)] to-[oklch(0.25_0.04_255)] shadow-lg">
                <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <div className="mx-auto mt-0.5 h-3 w-5 rounded-sm bg-emerald/20" />
              </div>
              <span className="mt-0.5 rounded border border-gold/30 bg-background/70 px-1 py-0.5 text-[6px] font-bold uppercase tracking-wider text-gold backdrop-blur-sm">
                Torre
              </span>
            </div>
          </div>

          {/* Árvores decorativas */}
          {[
            { x: 10, y: 50 }, { x: 90, y: 50 }, { x: 50, y: 10 }, { x: 50, y: 90 },
            { x: 35, y: 45 }, { x: 65, y: 55 },
          ].map((t, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
            >
              <div className="h-3 w-3 rounded-full bg-emerald/50 shadow-[0_0_8px_oklch(0.74_0.16_158)]" />
              <div className="mx-auto h-2 w-1 rounded-b-sm bg-[oklch(0.4_0.05_60)]" />
            </div>
          ))}

          {MISSION_ZONES.map((zone) => (
            <MissionZone
              key={zone.id}
              zone={zone}
              completed={completedZones.includes(zone.id)}
              isCurrent={zone.id === currentObjectiveId}
              isNearby={nearbyZoneId === zone.id}
            />
          ))}

          <PlayerMarker
            position={playerPosition}
            direction={playerDirection}
            isMoving={isMoving}
          />
        </div>
      </div>

      {/* Waypoint na borda (estilo GTA) */}
      {objective && !completedZones.includes(objective.id) && (
        <ObjectiveWaypoint
          playerPosition={playerPosition}
          objectivePosition={{ x: objective.x, y: objective.y }}
          label={objective.label}
        />
      )}

      {/* Vinheta + borda do viewport */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_12px_oklch(0.1_0.03_258_/_0.6)]" />
      <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full border border-emerald/30 bg-background/60 px-2 py-0.5 text-[7px] font-medium uppercase tracking-wider text-emerald backdrop-blur-sm">
        <Navigation className="h-2.5 w-2.5" />
        Ao vivo
      </div>
    </motion.div>
  )
}
