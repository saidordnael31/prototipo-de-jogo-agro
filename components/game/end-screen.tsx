'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Briefcase,
  Award,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react'

type Props = {
  won: boolean
  score: number
  objectivesDone: number
  onRestart: () => void
}

export function EndScreen({ won, score, objectivesDone, onRestart }: Props) {
  const [portfolioNote, setPortfolioNote] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col justify-between gap-4 p-1"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex flex-col items-center gap-2 pt-2"
        >
          <div
            className={[
              'flex h-16 w-16 items-center justify-center rounded-2xl border-2',
              won
                ? 'border-emerald bg-emerald/15 text-emerald shadow-[0_0_34px_-6px_oklch(0.74_0.16_158)]'
                : 'border-gold bg-gold/15 text-gold shadow-[0_0_34px_-6px_oklch(0.83_0.14_85)]',
            ].join(' ')}
          >
            {won ? (
              <Trophy className="h-8 w-8" strokeWidth={2} />
            ) : (
              <AlertTriangle className="h-8 w-8" strokeWidth={2} />
            )}
          </div>
          <h2 className="text-2xl font-black text-foreground">
            {won ? 'Missão Concluída' : 'Missão Incompleta'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {won ? `${objectivesDone}/4 zonas protegidas` : 'Safra parcialmente protegida'}
          </p>
        </motion.div>

        {won ? (
          <div className="space-y-2">
            <StatRow
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Eficiência de Gestão"
              value="84/100"
              highlight
            />
            <StatRow
              icon={<TrendingUp className="h-4 w-4" />}
              label="Drawdown Evitado"
              value="12,4%"
            />
            <StatRow icon={<Award className="h-4 w-4" />} label="XP ganho" value="+420" />
            <div className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2">
              <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gold">
                <Award className="h-3.5 w-3.5" />
                Badge desbloqueado
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">Operador Regional</p>
            </div>
            <StatRow
              icon={<TrendingUp className="h-4 w-4" />}
              label="Ranking"
              value="#2.481 → #2.376"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <StatRow
              icon={<TrendingUp className="h-4 w-4" />}
              label="Score da Safra"
              value={`${score}/100`}
              highlight
            />
            <div className="flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2.5">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-gold">Dica</p>
                <p className="text-sm font-medium text-foreground text-pretty">
                  Antecipe a logística antes do evento cambial.
                </p>
              </div>
            </div>
          </div>
        )}

        {portfolioNote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-emerald/30 bg-emerald/5 px-3 py-2 text-center text-xs text-emerald"
          >
            Portfólio de Capital Simulado disponível em breve.
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <motion.button
          type="button"
          onClick={onRestart}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald bg-emerald py-3 text-base font-black uppercase tracking-wide text-background shadow-[0_0_26px_-8px_oklch(0.74_0.16_158)]"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
          Jogar Novamente
        </motion.button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/50 bg-gold/10 py-2.5 text-sm font-bold text-gold"
          >
            Próxima Missão
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setPortfolioNote(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 py-2.5 text-sm font-bold text-foreground"
          >
            <Briefcase className="h-4 w-4" strokeWidth={2.5} />
            Ver Portfólio
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function StatRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-emerald">{icon}</span>
        {label}
      </span>
      <span
        className={[
          'font-mono text-sm font-bold tabular-nums',
          highlight ? 'text-emerald' : 'text-foreground',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}
