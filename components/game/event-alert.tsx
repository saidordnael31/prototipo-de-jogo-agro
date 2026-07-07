'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign,
  Ship,
  Sun,
  Globe,
  Anchor,
  Droplet,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { EventIcon, MarketEvent } from '@/lib/game/config'

type Props = {
  event: MarketEvent
  pulse: number
}

const ICONS: Record<EventIcon, LucideIcon> = {
  dollar: DollarSign,
  ship: Ship,
  sun: Sun,
  globe: Globe,
  anchor: Anchor,
  droplet: Droplet,
}

export function EventAlert({ event, pulse }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pulse === 0) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(t)
  }, [pulse])

  const positive = event.tone === 'positive'
  const Icon = ICONS[event.icon] ?? Globe

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={pulse}
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-4"
        >
          <div
            className={[
              'flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md',
              positive
                ? 'border-emerald/60 bg-emerald/15 shadow-[0_0_28px_-4px_oklch(0.74_0.16_158_/_0.7)]'
                : 'border-gold/60 bg-gold/15 shadow-[0_0_28px_-4px_oklch(0.83_0.14_85_/_0.7)]',
            ].join(' ')}
          >
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className={[
                'flex h-6 w-6 items-center justify-center rounded-full',
                positive ? 'bg-emerald/25 text-emerald' : 'bg-gold/25 text-gold',
              ].join(' ')}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </motion.span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Evento de Mercado
              </span>
              <span
                className={[
                  'text-sm font-bold',
                  positive ? 'text-emerald' : 'text-gold',
                ].join(' ')}
              >
                {event.text}
              </span>
            </div>
            {positive && <TrendingUp className="h-4 w-4 text-emerald" strokeWidth={2.5} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
