'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Radio } from 'lucide-react'

type Props = {
  onMove: (x: number, y: number) => void
  onActivate: () => void
  canActivate: boolean
}

const RADIUS = 44 // px

export function Controls({ onMove, onActivate, canActivate }: Props) {
  const baseRef = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const activeId = useRef<number | null>(null)

  const handleMove = (clientX: number, clientY: number) => {
    const base = baseRef.current
    if (!base) return
    const rect = base.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = clientX - cx
    let dy = clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS
      dy = (dy / dist) * RADIUS
    }
    setKnob({ x: dx, y: dy })
    onMove(dx / RADIUS, dy / RADIUS)
  }

  const reset = () => {
    activeId.current = null
    setKnob({ x: 0, y: 0 })
    onMove(0, 0)
  }

  return (
    <div className="flex items-end justify-between gap-4">
      {/* Joystick */}
      <div
        ref={baseRef}
        className="touch-none-select relative flex h-28 w-28 items-center justify-center rounded-full border border-emerald/30 bg-card/50 backdrop-blur-sm"
        onPointerDown={(e) => {
          activeId.current = e.pointerId
          e.currentTarget.setPointerCapture(e.pointerId)
          handleMove(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (activeId.current === e.pointerId) handleMove(e.clientX, e.clientY)
        }}
        onPointerUp={reset}
        onPointerCancel={reset}
      >
        <div className="absolute h-20 w-20 rounded-full border border-emerald/20" />
        <div
          className="h-11 w-11 rounded-full border-2 border-gold/70 bg-emerald/40 shadow-[0_0_16px_-2px_oklch(0.74_0.16_158)]"
          style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        />
        <span className="pointer-events-none absolute -bottom-5 text-[8px] font-medium uppercase tracking-widest text-muted-foreground">
          Mover
        </span>
      </div>

      {/* Botão ativar */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-4 items-center">
          <AnimatePresence mode="wait">
            {canActivate ? (
              <motion.span
                key="near"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1 rounded-full border border-gold/60 bg-gold/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                Zona detectada
              </motion.span>
            ) : (
              <motion.span
                key="far"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground"
              >
                Aproxime-se de uma zona
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          type="button"
          onClick={onActivate}
          disabled={!canActivate}
          whileTap={canActivate ? { scale: 0.92 } : undefined}
          animate={
            canActivate
              ? { boxShadow: ['0 0 0 0 oklch(0.83 0.14 85 / 0.5)', '0 0 0 12px oklch(0.83 0.14 85 / 0)'] }
              : {}
          }
          transition={canActivate ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY } : {}}
          className={[
            'touch-none-select flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border-2 font-bold transition-colors',
            canActivate
              ? 'border-gold bg-gold text-background'
              : 'border-border bg-card/50 text-muted-foreground',
          ].join(' ')}
        >
          <Radio className="h-6 w-6" strokeWidth={2.5} />
          <span className="text-sm uppercase tracking-wide">Ativar</span>
        </motion.button>
        <span className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground">
          Tecla E
        </span>
      </div>
    </div>
  )
}
