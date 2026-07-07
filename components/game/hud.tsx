'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Target, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { MISSION_NAME, ZONES, type MarketEvent } from '@/lib/game/config'

type Props = {
  timeLeft: number
  score: number
  objectivesDone: number
  event: MarketEvent
  eventPulse: number
}

export function Hud({ timeLeft, score, objectivesDone, event, eventPulse }: Props) {
  const seconds = Math.ceil(timeLeft)
  const low = seconds <= 10

  return (
    <div className="flex flex-col gap-2">
      {/* Linha superior: missão + tempo */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald shadow-[0_0_8px_2px_oklch(0.74_0.16_158_/_0.8)]" />
          <div className="leading-tight">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Missão atual
            </p>
            <p className="text-sm font-bold text-foreground">{MISSION_NAME}</p>
          </div>
        </div>
        <div
          className={[
            'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono tabular-nums',
            low
              ? 'border-destructive/60 bg-destructive/15 text-destructive'
              : 'border-gold/40 bg-gold/10 text-gold',
          ].join(' ')}
        >
          <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="text-base font-bold">{seconds}s</span>
        </div>
      </div>

      {/* Cartões de status */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="Score da Safra"
          value={`${score}/100`}
        />
        <StatCard
          icon={<Target className="h-3.5 w-3.5" />}
          label="Objetivos concluídos"
          value={`${objectivesDone}/${ZONES.length}`}
        />
      </div>

      {/* Evento de mercado */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-card/60 px-3 py-2 backdrop-blur-sm">
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
                  event.tone === 'positive'
                    ? 'text-emerald'
                    : event.tone === 'negative'
                      ? 'text-gold'
                      : 'text-foreground',
                ].join(' ')}
              >
                {event.text}
              </motion.p>
            </AnimatePresence>
          </div>
          {event.tone === 'positive' ? (
            <TrendingUp className="h-4 w-4 shrink-0 text-emerald" />
          ) : event.tone === 'negative' ? (
            <TrendingDown className="h-4 w-4 shrink-0 text-gold" />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card/60 px-2.5 py-1.5 backdrop-blur-sm">
      <p className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="text-emerald">{icon}</span>
        {label}
      </p>
      <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">{value}</p>
    </div>
  )
}
