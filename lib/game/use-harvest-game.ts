'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EVENT_INTERVAL,
  MARKET_EVENTS,
  MISSION_DURATION,
  PLAYER_SPEED,
  POINTS_PER_ZONE,
  TOWER_POS,
  TOWER_RADIUS,
  ZONE_RADIUS,
  ZONES,
  type GamePhase,
  type MarketEvent,
  type ZoneId,
} from './config'

const CLAMP_MIN = 6
const CLAMP_MAX = 94
const START_POS = { x: TOWER_POS.x, y: TOWER_POS.y }
const TRAIL_MAX = 8

const IDLE_EVENT: MarketEvent = {
  text: 'Mercado estável — monitorando riscos',
  tone: 'neutral',
  icon: 'globe',
}

export type NextObjective = ZoneId | 'tower' | null

export type HarvestGame = ReturnType<typeof useHarvestGame>

export function useHarvestGame() {
  const [phase, setPhase] = useState<GamePhase>('start')
  const [playerPos, setPlayerPos] = useState(START_POS)
  const [facing, setFacing] = useState(-90) // graus; -90 = para cima
  const [moving, setMoving] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const [activated, setActivated] = useState<ZoneId[]>([])
  const [timeLeft, setTimeLeft] = useState(MISSION_DURATION)
  const [nearZone, setNearZone] = useState<ZoneId | null>(null)
  const [nearTower, setNearTower] = useState(false)
  const [event, setEvent] = useState<MarketEvent>(IDLE_EVENT)
  const [eventPulse, setEventPulse] = useState(0)
  const [won, setWon] = useState(false)

  // Refs para o loop de jogo
  const keysRef = useRef<Set<string>>(new Set())
  const joyRef = useRef({ x: 0, y: 0 })
  const posRef = useRef(START_POS)
  const facingRef = useRef(-90)
  const trailRef = useRef<{ x: number; y: number }[]>([])
  const trailTickRef = useRef(0)
  const activatedRef = useRef<ZoneId[]>([])
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const eventStepRef = useRef(0)
  const phaseRef = useRef<GamePhase>('start')

  const score = activated.length * POINTS_PER_ZONE
  const allDone = activated.length >= ZONES.length

  // Próximo objetivo (ordem fixa); 'tower' quando todas as zonas concluídas
  const nextObjective: NextObjective = allDone
    ? 'tower'
    : (ZONES.find((z) => !activated.includes(z.id))?.id ?? null)

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
  }, [nearZone])

  const start = useCallback(() => {
    posRef.current = START_POS
    facingRef.current = -90
    trailRef.current = []
    trailTickRef.current = 0
    activatedRef.current = []
    elapsedRef.current = 0
    eventStepRef.current = 0
    lastTsRef.current = null
    keysRef.current.clear()
    joyRef.current = { x: 0, y: 0 }
    phaseRef.current = 'playing'
    setPlayerPos(START_POS)
    setFacing(-90)
    setMoving(false)
    setTrail([])
    setActivated([])
    setTimeLeft(MISSION_DURATION)
    setNearZone(null)
    setNearTower(false)
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
      const isMoving = mag > 0.02
      if (mag > 1) {
        dx /= mag
        dy /= mag
      }

      const p = posRef.current
      const nx = Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, p.x + dx * PLAYER_SPEED * dt))
      const ny = Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, p.y + dy * PLAYER_SPEED * dt))
      posRef.current = { x: nx, y: ny }
      setPlayerPos({ x: nx, y: ny })

      // Direção do avatar + estado de movimento
      if (isMoving) {
        const nextFacing = (Math.atan2(dy, dx) * 180) / Math.PI
        // só atualiza se mudou o suficiente (evita re-render excessivo)
        let diff = Math.abs(nextFacing - facingRef.current)
        if (diff > 180) diff = 360 - diff
        if (diff > 6) {
          facingRef.current = nextFacing
          setFacing(nextFacing)
        }
      }
      setMoving((m) => (m === isMoving ? m : isMoving))

      // Rastro de movimento (amostrado)
      trailTickRef.current += 1
      if (isMoving && trailTickRef.current % 4 === 0) {
        const t = [...trailRef.current, { x: nx, y: ny }]
        if (t.length > TRAIL_MAX) t.shift()
        trailRef.current = t
        setTrail(t)
      }

      // Proximidade de zonas (apenas as não concluídas)
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

      // Proximidade da Torre (relevante quando todas as zonas concluídas)
      const towerDist = Math.hypot(TOWER_POS.x - nx, TOWER_POS.y - ny)
      const isNearTower = towerDist < TOWER_RADIUS
      setNearTower(isNearTower)

      // Finalização: todas as zonas + voltar à Torre de Dados
      if (activatedRef.current.length >= ZONES.length && isNearTower) {
        finish(true)
        return
      }

      // Tempo + eventos
      elapsedRef.current += dt
      const remaining = Math.max(0, MISSION_DURATION - elapsedRef.current)
      setTimeLeft(remaining)

      const step = Math.floor(elapsedRef.current / EVENT_INTERVAL)
      if (step > eventStepRef.current) {
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
    facing,
    moving,
    trail,
    activated,
    timeLeft,
    nearZone,
    nearTower,
    allDone,
    nextObjective,
    event,
    eventPulse,
    score,
    won,
    start,
    activateZone,
    setJoystick,
  }
}
