'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import { MARKET_EVENTS } from '@/lib/gameData'

type Props = {
  eventText: string
  pulse: number
}

function getEventTone(text: string): 'positive' | 'negative' | 'neutral' {
  const found = MARKET_EVENTS.find((e) => e.text === text)
  return found?.tone ?? 'neutral'
}

export function EventAlert({ eventText, pulse }: Props) {
  const [visible, setVisible] = useState(false)
  const tone = getEventTone(eventText)

  useEffect(() => {
    if (pulse === 0) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2800)
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
          className="pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center px-3"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
            className={[
              'flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2',
              tone === 'positive'
                ? 'border-emerald/60 bg-emerald/15 shadow-[0_0_28px_-4px_oklch(0.74_0.16_158_/_0.7)]'
                : tone === 'negative'
                  ? 'border-gold/60 bg-gold/15 shadow-[0_0_28px_-4px_oklch(0.83_0.14_85_/_0.7)]'
                  : 'border-border bg-card/80',
            ].join(' ')}
          >
            {tone === 'positive' ? (
              <TrendingUp className="h-4 w-4 shrink-0 text-emerald" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
            )}
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-muted-foreground sm:text-[10px]">
              Evento
            </span>
            <span
              className={[
                'truncate text-xs font-bold sm:text-sm',
                tone === 'positive' ? 'text-emerald' : tone === 'negative' ? 'text-gold' : 'text-foreground',
              ].join(' ')}
            >
              {eventText}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
