'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/lib/gameLogic'
import { StartScreen } from '@/components/StartScreen'
import { GameScreen } from '@/components/GameScreen'
import { ResultScreen } from '@/components/ResultScreen'

export default function HarvestOpsPage() {
  const game = useGame()

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-x-hidden overflow-y-auto bg-background px-3 py-3 touch-none-select sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gold/5 blur-3xl" />

      <AnimatePresence mode="wait">
        {game.screen === 'start' && (
          <motion.div
            key="start"
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <StartScreen onStart={game.startMission} />
          </motion.div>
        )}

        {game.screen === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <GameScreen game={game} />
          </motion.div>
        )}

        {(game.screen === 'success' || game.screen === 'failure') && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <ResultScreen
              success={game.screen === 'success'}
              harvestScore={game.harvestScore}
              completedCount={game.completedZones.length}
              onRestart={game.restartMission}
              onGoToStart={game.goToStart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
