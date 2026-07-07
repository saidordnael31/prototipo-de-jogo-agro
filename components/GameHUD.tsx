'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Navigation,
  Zap,
} from 'lucide-react'
import { MISSION_NAME, MISSION_ZONES, MARKET_EVENTS } from '@/lib/gameData'
import type { Position, ZoneId } from '@/types/game'

type Props = {
  timeRemaining: number
  harvestScore: number
  completedZones: ZoneId[]
  currentMarketEvent: string
  eventPulse: number
  scorePulse: number
  objectiveHint: string
  playerPosition: Position
}

function getEventTone(text: string): 'positive' | 'negative' | 'neutral' {
  const found = MARKET_EVENTS.find((e) => e.text === text)
  return found?.tone ?? 'neutral'
}

export function GameHUD({
  timeRemaining,
  harvestScore,
  completedZones,
  currentMarketEvent,
  eventPulse,
  scorePulse,
  objectiveHint,
  playerPosition,
}: Props) {
  const seconds = Math.ceil(timeRemaining)
  const low = seconds <= 10
  const tone = getEventTone(currentMarketEvent)
  const xpProgress = (completedZones.length / MISSION_ZONES.length) * 100
  const allDone = completedZones.length >= MISSION_ZONES.length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald shadow-[0_0_8px_2px_oklch(0.74_0.16_158_/_0.8)]" />
          <div className="min-w-0 leading-tight">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Missão atual
            </p>
            <p className="truncate text-sm font-bold text-foreground">{MISSION_NAME}</p>
          </div>
        </div>
        <div
          className={[
            'flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono tabular-nums',
            low
              ? 'border-destructive/60 bg-destructive/15 text-destructive'
              : 'border-gold/40 bg-gold/10 text-gold',
          ].join(' ')}
        >
          <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="text-base font-bold">{seconds}s</span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-emerald/30 bg-emerald/5 px-2.5 py-1.5">
        <Navigation className="h-3.5 w-3.5 shrink-0 text-emerald" strokeWidth={2.5} />
        <p className="min-w-0 truncate text-xs font-semibold text-foreground">
          {allDone ? (
            <span className="text-emerald">Todos os objetivos concluídos!</span>
          ) : (
            <>
              <span className="text-muted-foreground">Próximo objetivo: </span>
              {objectiveHint}
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="Score da Safra"
          value={`${harvestScore}/100`}
          pulseKey={scorePulse}
        />
        <StatCard
          icon={<Target className="h-3.5 w-3.5" />}
          label="Objetivos concluídos"
          value={`${completedZones.length}/${MISSION_ZONES.length}`}
        />
      </div>

      <motion.div
        key={eventPulse}
        animate={eventPulse > 0 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-lg border border-border bg-card/60 px-3 py-2 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
              Evento de Mercado
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={eventPulse}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className={[
                  'truncate text-xs font-semibold',
                  tone === 'positive'
                    ? 'text-emerald'
                    : tone === 'negative'
                      ? 'text-gold'
                      : 'text-foreground',
                ].join(' ')}
              >
                {currentMarketEvent}
              </motion.p>
            </AnimatePresence>
          </div>
          {tone === 'positive' ? (
            <TrendingUp className="h-4 w-4 shrink-0 text-emerald" />
          ) : tone === 'negative' ? (
            <TrendingDown className="h-4 w-4 shrink-0 text-gold" />
          ) : null}
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
              <Zap className="h-3 w-3 text-gold" />
              Nível 1 — Farmer Operator
            </span>
            <span className="text-[9px] font-mono text-emerald">{Math.round(xpProgress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald to-gold"
              animate={{ width: `${xpProgress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <MiniMap playerPosition={playerPosition} completedZones={completedZones} />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  pulseKey,
}: {
  icon: React.ReactNode
  label: string
  value: string
  pulseKey?: number
}) {
  return (
    <motion.div
      key={pulseKey}
      animate={pulseKey ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 0.35 }}
      className="rounded-lg border border-border bg-card/60 px-2.5 py-1.5 backdrop-blur-sm"
    >
      <p className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="text-emerald">{icon}</span>
        {label}
      </p>
      <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">{value}</p>
    </motion.div>
  )
}

function MiniMap({
  playerPosition,
  completedZones,
}: {
  playerPosition: Position
  completedZones: ZoneId[]
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
      <span className="text-[7px] font-medium uppercase tracking-widest text-muted-foreground">
        Mapa
      </span>
      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-emerald/30 bg-navy-deep/80">
        <div className="absolute inset-0 bg-[linear-gradient(oklch(0.74_0.16_158_/_0.12)_1px,transparent_1px),linear-gradient(90deg,oklch(0.74_0.16_158_/_0.12)_1px,transparent_1px)] bg-[size:7px_7px]" />
        {MISSION_ZONES.map((z) => {
          const done = completedZones.includes(z.id)
          return (
            <span
              key={z.id}
              className={[
                'absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
                done ? 'bg-emerald shadow-[0_0_6px_1px_oklch(0.74_0.16_158)]' : 'bg-gold/70',
              ].join(' ')}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
            />
          )
        })}
        <span
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background bg-foreground shadow-[0_0_6px_1px_oklch(0.74_0.16_158)]"
          style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
        />
      </div>
    </div>
  )
}
