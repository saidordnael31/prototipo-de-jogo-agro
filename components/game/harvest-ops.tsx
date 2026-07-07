'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useHarvestGame } from '@/lib/game/use-harvest-game'
import { GameArena } from './game-arena'
import { Hud } from './hud'
import { Controls } from './controls'
import { MiniMap } from './mini-map'
import { EventAlert } from './event-alert'
import { StartScreen } from './start-screen'
import { EndScreen } from './end-screen'

export function HarvestOps() {
  const game = useHarvestGame()

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background px-4 py-4 touch-none-select">
      {/* Brilho ambiente de fundo */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gold/5 blur-3xl" />

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
            />

            <div className="relative">
              <EventAlert event={game.event} pulse={game.eventPulse} />
              <GameArena
                playerPos={game.playerPos}
                activated={game.activated}
                nearZone={game.nearZone}
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
              onRestart={game.start}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
