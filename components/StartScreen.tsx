'use client'

import { motion } from 'framer-motion'
import { Play, Coffee, Clock, Gamepad2 } from 'lucide-react'
import { MISSION_DURATION, MISSION_NAME, MISSION_ZONES } from '@/lib/gameData'
import { ZoneIcon } from './ZoneIcon'

type Props = {
  onStart: () => void
}

export function StartScreen({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col justify-between gap-4 p-1"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-gold/10">
            <Coffee className="h-5 w-5 text-gold" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-medium uppercase tracking-widest text-emerald">
              Proof of Harvest
            </p>
            <h1 className="text-lg font-black text-foreground">Harvest Ops</h1>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-3 backdrop-blur-sm">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {MISSION_NAME}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
            Engine Phaser 3 com mapa real, física e sprites. Percorra a fazenda, ative as 4 zonas
            em sequência e proteja a safra contra riscos de mercado.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gold" />
              {MISSION_DURATION}s
            </span>
            <span className="flex items-center gap-1">
              <Gamepad2 className="h-3.5 w-3.5 text-emerald" />
              WASD / Joystick + E
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Objetivos da Missão (em ordem)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MISSION_ZONES.map((z, i) => (
              <div
                key={z.id}
                className="flex items-center gap-2 rounded-lg border border-emerald/20 bg-card/50 px-2 py-1.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-[9px] font-bold text-emerald">
                  {i + 1}
                </span>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald/40 bg-emerald/10 text-emerald">
                  <ZoneIcon icon={z.icon} className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-xs font-bold text-foreground">{z.label}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{z.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onStart}
        whileTap={{ scale: 0.97 }}
        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-emerald bg-emerald py-3.5 text-base font-black uppercase tracking-wide text-background shadow-[0_0_30px_-6px_oklch(0.74_0.16_158)]"
      >
        <Play className="h-5 w-5 fill-background" />
        Iniciar Missão
      </motion.button>
    </motion.div>
  )
}
