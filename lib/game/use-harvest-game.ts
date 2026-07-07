'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EVENT_INTERVAL,
  MARKET_EVENTS,
  MISSION_DURATION,
  PLAYER_SPEED,
  POINTS_PER_ZONE,
  ZONE_RADIUS,
  ZONES,
  type GamePhase,
  type MarketEvent,
  type ZoneId,
} from './config'

const CLAMP_MIN = 6
const CLAMP_MAX = 94
const START_POS = { x: 50, y: 50 }

const IDLE_EVENT: MarketEvent = {
  text: 'Mercado estável — monitorando riscos',
  tone: 'neutral',
}

export type HarvestGame = ReturnType<typeof useHarvestGame>

export function useHarvestGame() {
  const [phase, setPhase] = useState<GamePhase>('start')
  const [playerPos, setPlayerPos] = useState(START_POS)
  const [activated, setActivated] = useState<ZoneId[]>([])
  const [timeLeft, setTimeLeft] = useState(MISSION_DURATION)
  const [nearZone, setNearZone] = useState<ZoneId | null>(null)
  const [event, setEvent] = useState<MarketEvent>(IDLE_EVENT)
  const [eventPulse, setEventPulse] = useState(0)
  const [won, setWon] = useState(false)

  // Refs para o loop de jogo
  const keysRef = useRef<Set<string>>(new Set())
  const joyRef = useRef({ x: 0, y: 0 })
  const posRef = useRef(START_POS)
  const activatedRef = useRef<ZoneId[]>([])
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const eventStepRef = useRef(0)
  const phaseRef = useRef<GamePhase>('start')

  const score = activated.length * POINTS_PER_ZONE

  const finish = useCallback((didWin: boolean) => {
    phaseRef.current = 'end'
    setWon(didWin)
    setPhase('end')
  }, [])

  const activateZone = useCallback(() => {
    const id = nearZone
    if (!id) return
    if (activatedRef.current.includes(id)) return
    const next = [...activatedRef.current, id]
    activatedRef.current = next
    setActivated(next)
    if (next.length >= ZONES.length) {
      finish(true)
    }
  }, [nearZone, finish])

  const start = useCallback(() => {
    posRef.current = START_POS
    activatedRef.current = []
    elapsedRef.current = 0
    eventStepRef.current = 0
    lastTsRef.current = null
    keysRef.current.clear()
    joyRef.current = { x: 0, y: 0 }
    phaseRef.current = 'playing'
    setPlayerPos(START_POS)
    setActivated([])
    setTimeLeft(MISSION_DURATION)
    setNearZone(null)
    setEvent(IDLE_EVENT)
    setWon(false)
    setPhase('playing')
  }, [])

  const setJoystick = useCallback((x: number, y: number) => {
    joyRef.current = { x, y }
  }, [])

  // Teclado
  useEffect(() => {
    const move = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'])
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (move.has(k)) {
        keysRef.current.add(k)
        e.preventDefault()
      }
      if ((k === 'e' || k === ' ' || k === 'enter') && phaseRef.current === 'playing') {
        activateZone()
      }
    }
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [activateZone])

  // Loop de jogo
  useEffect(() => {
    if (phase !== 'playing') return

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current = ts

      // Direção
      const keys = keysRef.current
      let dx = 0
      let dy = 0
      if (keys.has('w') || keys.has('arrowup')) dy -= 1
      if (keys.has('s') || keys.has('arrowdown')) dy += 1
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1
      if (keys.has('d') || keys.has('arrowright')) dx += 1
      dx += joyRef.current.x
      dy += joyRef.current.y
      const mag = Math.hypot(dx, dy)
      if (mag > 1) {
        dx /= mag
        dy /= mag
      }

      const p = posRef.current
      const nx = Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, p.x + dx * PLAYER_SPEED * dt))
      const ny = Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, p.y + dy * PLAYER_SPEED * dt))
      posRef.current = { x: nx, y: ny }
      setPlayerPos({ x: nx, y: ny })

      // Proximidade
      let closest: ZoneId | null = null
      let closestDist = ZONE_RADIUS
      for (const z of ZONES) {
        if (activatedRef.current.includes(z.id)) continue
        const d = Math.hypot(z.x - nx, z.y - ny)
        if (d < closestDist) {
          closestDist = d
          closest = z.id
        }
      }
      setNearZone(closest)

      // Tempo + eventos
      elapsedRef.current += dt
      const remaining = Math.max(0, MISSION_DURATION - elapsedRef.current)
      setTimeLeft(remaining)

      const step = Math.floor(elapsedRef.current / EVENT_INTERVAL)
      if (step > eventStepRef.current && step <= MARKET_EVENTS.length) {
        eventStepRef.current = step
        setEvent(MARKET_EVENTS[(step - 1) % MARKET_EVENTS.length])
        setEventPulse((v) => v + 1)
      }

      if (remaining <= 0) {
        finish(activatedRef.current.length >= ZONES.length)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [phase, finish])

  return {
    phase,
    playerPos,
    activated,
    timeLeft,
    nearZone,
    event,
    eventPulse,
    score,
    won,
    start,
    activateZone,
    setJoystick,
  }
}
