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

const CROP_PATCHES = [
  { x: 18, y: 18, w: 14, h: 12 },
  { x: 68, y: 18, w: 14, h: 12 },
  { x: 18, y: 70, w: 14, h: 12 },
  { x: 68, y: 70, w: 14, h: 12 },
  { x: 42, y: 42, w: 16, h: 16 },
]

const TREES = [
  { x: 8, y: 35 }, { x: 92, y: 35 }, { x: 8, y: 65 }, { x: 92, y: 65 },
  { x: 35, y: 8 }, { x: 65, y: 8 }, { x: 35, y: 92 }, { x: 65, y: 92 },
  { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 50, y: 30 }, { x: 50, y: 70 },
]

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
      animate={mapPulse > 0 ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.35 }}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-emerald/30 shadow-[0_0_80px_-10px_oklch(0.74_0.16_158_/_0.5)]"
    >
      <div
        className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: `translate(${camera.x}%, ${camera.y}%)` }}
      >
        <div
          className="relative"
          style={{
            width: `${WORLD_ZOOM * 100}%`,
            height: `${WORLD_ZOOM * 100}%`,
            marginLeft: `${-(WORLD_ZOOM - 1) * 50}%`,
            marginTop: `${-(WORLD_ZOOM - 1) * 50}%`,
          }}
        >
          {/* Base terreno */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 55%, oklch(0.32 0.08 145), oklch(0.2 0.05 255) 70%),
                repeating-linear-gradient(0deg, transparent, transparent 11px, oklch(0.25 0.06 140 / 0.2) 11px, oklch(0.25 0.06 140 / 0.2) 12px),
                repeating-linear-gradient(90deg, transparent, transparent 11px, oklch(0.25 0.06 140 / 0.2) 11px, oklch(0.25 0.06 140 / 0.2) 12px)
              `,
            }}
          />

          {/* Cerca perimetral */}
          <div className="absolute inset-[3%] rounded-lg border-4 border-dashed border-[oklch(0.5_0.06_60)]/40" />

          {/* Talhões de café */}
          {CROP_PATCHES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-md border border-emerald/20"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}%`,
                height: `${p.h}%`,
                background: `repeating-linear-gradient(90deg, oklch(0.35 0.1 145 / 0.5) 0px, oklch(0.35 0.1 145 / 0.5) 3px, oklch(0.3 0.08 140 / 0.4) 3px, oklch(0.3 0.08 140 / 0.4) 6px)`,
              }}
            />
          ))}

          {/* Lago */}
          <div
            className="absolute rounded-full bg-[oklch(0.45_0.08_230)]/40 blur-[1px]"
            style={{ left: '44%', top: '58%', width: '12%', height: '8%' }}
          >
            <div className="absolute inset-1 rounded-full bg-[oklch(0.5_0.1_230)]/30 animate-pulse" />
          </div>

          {/* Estradas */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50 2 L50 98" fill="none" stroke="oklch(0.48 0.05 65)" strokeWidth="5.5" strokeOpacity="0.55" />
            <path d="M2 50 L98 50" fill="none" stroke="oklch(0.48 0.05 65)" strokeWidth="5.5" strokeOpacity="0.55" />
            <path d="M12 12 Q 50 50 88 88" fill="none" stroke="oklch(0.42 0.04 60)" strokeWidth="3" strokeOpacity="0.4" strokeDasharray="4 3" />
            <path d="M88 12 Q 50 50 12 88" fill="none" stroke="oklch(0.42 0.04 60)" strokeWidth="3" strokeOpacity="0.4" strokeDasharray="4 3" />
            {objective && !completedZones.includes(objective.id) && (
              <>
                <line
                  x1={playerPosition.x}
                  y1={playerPosition.y}
                  x2={objective.x}
                  y2={objective.y}
                  stroke="oklch(0.83 0.14 85)"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  strokeDasharray="2 3"
                  className="route-flow"
                />
                <circle cx={objective.x} cy={objective.y} r="3" fill="none" stroke="oklch(0.83 0.14 85)" strokeWidth="0.5" strokeOpacity="0.6" className="route-flow" />
              </>
            )}
          </svg>

          {/* Árvores */}
          {TREES.map((t, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
              <div className="h-4 w-5 rounded-full bg-emerald/60 shadow-[0_2px_4px_oklch(0.2_0.04_140)]" style={{ borderRadius: '50% 50% 45% 45%' }} />
              <div className="mx-auto h-2.5 w-1.5 rounded-b-sm bg-[oklch(0.38_0.06_55)]" />
            </div>
          ))}

          {/* Torre central */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
            <div className="relative">
              <div className="h-10 w-12 rounded-t-lg border-2 border-gold/50 bg-gradient-to-b from-[oklch(0.38_0.04_255)] to-[oklch(0.22_0.04_255)] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <div className="mx-auto mt-1.5 flex justify-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gold shadow-[0_0_6px_oklch(0.83_0.14_85)]" />
                </div>
                <div className="mx-auto mt-1 h-4 w-8 rounded-sm border border-emerald/30 bg-emerald/10" />
              </div>
              <div className="absolute -inset-2 rounded-lg border border-gold/20 animate-pulse" />
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

          <PlayerMarker position={playerPosition} direction={playerDirection} isMoving={isMoving} />
        </div>
      </div>

      {objective && !completedZones.includes(objective.id) && (
        <ObjectiveWaypoint
          playerPosition={playerPosition}
          objectivePosition={{ x: objective.x, y: objective.y }}
          label={objective.label}
        />
      )}

      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_16px_oklch(0.08_0.03_258_/_0.75)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.1_0.03_258_/_0.5)_100%)]" />

      <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full border border-emerald/40 bg-background/70 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-emerald backdrop-blur-md">
        <Navigation className="h-2.5 w-2.5" />
        AO VIVO
      </div>

      <div className="pointer-events-none absolute bottom-2 left-2 rounded border border-white/10 bg-black/40 px-1.5 py-0.5 text-[7px] font-mono text-white/60 backdrop-blur-sm">
        ZOOM {WORLD_ZOOM}x
      </div>
    </motion.div>
  )
}
