'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useHarvestGame } from '@/lib/game/use-harvest-game'
import {
  TOWER_GUIDANCE,
  ZONES,
  ZONE_GUIDANCE,
  type ZoneId,
} from '@/lib/game/config'
import { GameArena } from './game-arena'
import { Hud } from './hud'
import { Controls } from './controls'
import { MiniMap } from './mini-map'
import { EventAlert } from './event-alert'
import { StartScreen } from './start-screen'
import { EndScreen } from './end-screen'

export function HarvestOps() {
  const game = useHarvestGame()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const guidance =
    game.nextObjective === 'tower'
      ? TOWER_GUIDANCE
      : game.nextObjective
        ? ZONE_GUIDANCE[game.nextObjective]
        : ''

  const missingZones: ZoneId[] = ZONES.filter((z) => !game.activated.includes(z.id)).map(
    (z) => z.id,
  )

  const eventPositive = game.event.tone === 'positive'

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background px-4 py-4 touch-none-select">
      {/* Brilho ambiente de fundo */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gold/5 blur-3xl" />

      {!mounted && (
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Carregando missão…
          </span>
        </div>
      )}

      {/* Pulso de tela nos eventos de mercado */}
      {mounted && (
      <>
      <AnimatePresence>
        {game.phase === 'playing' && game.eventPulse > 0 && (
          <motion.div
            key={`pulse-${game.eventPulse}`}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className={[
              'pointer-events-none absolute inset-0 z-40',
              eventPositive
                ? 'shadow-[inset_0_0_90px_10px_oklch(0.74_0.16_158_/_0.5)]'
                : 'shadow-[inset_0_0_90px_10px_oklch(0.83_0.14_85_/_0.5)]',
            ].join(' ')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {game.phase === 'start' && (
          <motion.div
            key="start"
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <StartScreen onStart={game.start} />
          </motion.div>
        )}

        {game.phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-1 flex-col gap-3"
          >
            <Hud
              timeLeft={game.timeLeft}
              score={game.score}
              objectivesDone={game.activated.length}
              event={game.event}
              eventPulse={game.eventPulse}
              guidance={guidance}
              allDone={game.allDone}
            />

            <div className="relative">
              <EventAlert event={game.event} pulse={game.eventPulse} />
              <GameArena
                playerPos={game.playerPos}
                facing={game.facing}
                moving={game.moving}
                trail={game.trail}
                activated={game.activated}
                nearZone={game.nearZone}
                nearTower={game.nearTower}
                allDone={game.allDone}
                nextObjective={game.nextObjective}
                shake={game.eventPulse}
              />
              <div className="absolute right-2 top-2 z-20">
                <MiniMap playerPos={game.playerPos} activated={game.activated} />
              </div>
            </div>

            <div className="mt-auto">
              <Controls
                onMove={game.setJoystick}
                onActivate={game.activateZone}
                canActivate={game.nearZone !== null}
              />
            </div>
          </motion.div>
        )}

        {game.phase === 'end' && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <EndScreen
              won={game.won}
              score={game.score}
              objectivesDone={game.activated.length}
              missingZones={missingZones}
              onRestart={game.start}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </main>
  )
}
