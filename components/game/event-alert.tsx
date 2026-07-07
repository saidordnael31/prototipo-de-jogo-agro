'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import type { MarketEvent } from '@/lib/game/config'

type Props = {
  event: MarketEvent
  pulse: number
}

export function EventAlert({ event, pulse }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pulse === 0) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(t)
  }, [pulse])

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
              event.tone === 'positive'
                ? 'border-emerald/60 bg-emerald/15 shadow-[0_0_28px_-4px_oklch(0.74_0.16_158_/_0.7)]'
                : 'border-gold/60 bg-gold/15 shadow-[0_0_28px_-4px_oklch(0.83_0.14_85_/_0.7)]',
            ].join(' ')}
          >
            {event.tone === 'positive' ? (
              <TrendingUp className="h-4 w-4 text-emerald" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="h-4 w-4 text-gold" strokeWidth={2.5} />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Evento de Mercado
            </span>
            <span
              className={[
                'text-sm font-bold',
                event.tone === 'positive' ? 'text-emerald' : 'text-gold',
              ].join(' ')}
            >
              {event.text}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
