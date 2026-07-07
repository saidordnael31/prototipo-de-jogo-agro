'use client'

import { useRef, useState } from 'react'

type Props = {
  onMove: (x: number, y: number) => void
}

const RADIUS = 40

export function MobileJoystick({ onMove }: Props) {
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
    <div
      ref={baseRef}
      className="touch-none-select relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full border border-emerald/30 bg-card/50 backdrop-blur-sm"
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
      <div className="absolute h-[72px] w-[72px] rounded-full border border-emerald/20" />
      <div
        className="h-10 w-10 rounded-full border-2 border-gold/70 bg-emerald/40 shadow-[0_0_16px_-2px_oklch(0.74_0.16_158)]"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
      <span className="pointer-events-none absolute -bottom-5 text-[8px] font-medium uppercase tracking-widest text-muted-foreground">
        Mover
      </span>
    </div>
  )
}
