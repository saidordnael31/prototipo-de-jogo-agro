'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StartScreen } from '@/components/StartScreen'
import { PhaserHarvestOps } from '@/components/PhaserHarvestOps'
import { ResultScreen } from '@/components/ResultScreen'
import type { MissionEndPayload } from '@/game/phaser/missionData'

type Screen = 'start' | 'playing' | 'success' | 'failure'

export default function HarvestOpsPage() {
  const [screen, setScreen] = useState<Screen>('start')
  const [result, setResult] = useState<MissionEndPayload>({
    success: false,
    harvestScore: 0,
    completedCount: 0,
  })
  const [playKey, setPlayKey] = useState(0)

  const startMission = useCallback(() => {
    setPlayKey((k) => k + 1)
    setScreen('playing')
  }, [])

  const handleMissionEnd = useCallback((payload: MissionEndPayload) => {
    setResult(payload)
    setScreen(payload.success ? 'success' : 'failure')
  }, [])

  const restartMission = useCallback(() => {
    setPlayKey((k) => k + 1)
    setScreen('playing')
  }, [])

  const goToStart = useCallback(() => setScreen('start'), [])

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-x-hidden bg-background px-3 py-3 touch-none-select sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gold/5 blur-3xl" />

      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div key="start" exit={{ opacity: 0 }} className="relative z-10 flex flex-1 flex-col">
            <StartScreen onStart={startMission} />
          </motion.div>
        )}

        {screen === 'playing' && (
          <motion.div
            key={`playing-${playKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <PhaserHarvestOps onMissionEnd={handleMissionEnd} />
          </motion.div>
        )}

        {(screen === 'success' || screen === 'failure') && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-1 flex-col"
          >
            <ResultScreen
              success={result.success}
              harvestScore={result.harvestScore}
              completedCount={result.completedCount}
              onRestart={restartMission}
              onGoToStart={goToStart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
