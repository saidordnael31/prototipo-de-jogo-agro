'use client'

import { motion } from 'framer-motion'
import type { UseGameReturn } from '@/lib/gameLogic'
import { GameHUD } from './GameHUD'
import { GameMap } from './GameMap'
import { EventAlert } from './EventAlert'
import { MobileJoystick } from './MobileJoystick'
import { ActionButton } from './ActionButton'

type Props = {
  game: UseGameReturn
}

export function GameScreen({ game }: Props) {
  const canActivate = game.nearbyZoneId !== null && game.nearbyZoneId === game.currentObjectiveId

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col gap-2.5"
    >
      <GameHUD
        timeRemaining={game.timeRemaining}
        harvestScore={game.harvestScore}
        completedZones={game.completedZones}
        currentMarketEvent={game.currentMarketEvent}
        eventPulse={game.eventPulse}
        scorePulse={game.scorePulse}
        objectiveHint={game.objectiveHint}
        playerPosition={game.playerPosition}
      />

      <div className="relative min-h-0 flex-1">
        <EventAlert eventText={game.currentMarketEvent} pulse={game.eventPulse} />
        <GameMap
          playerPosition={game.playerPosition}
          playerDirection={game.playerDirection}
          completedZones={game.completedZones}
          currentObjectiveId={game.currentObjectiveId}
          nearbyZoneId={game.nearbyZoneId}
          mapPulse={game.mapPulse}
          isMoving={game.isMoving}
        />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pb-1">
        <MobileJoystick onMove={(x, y) => game.setJoystick({ x, y })} />
        <ActionButton onActivate={game.activateZone} disabled={!canActivate} />
      </div>
    </motion.div>
  )
}
