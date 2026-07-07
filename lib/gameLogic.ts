'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EVENT_INTERVAL,
  IDLE_EVENT,
  MAP_CLAMP_MAX,
  MAP_CLAMP_MIN,
  MARKET_EVENTS,
  MISSION_DURATION,
  MISSION_ZONES,
  OBJECTIVE_ORDER,
  POINTS_PER_ZONE,
  PLAYER_SPEED,
  START_POSITION,
  ZONE_RADIUS,
  getObjectiveHint,
} from '@/lib/gameData'
import type {
  GameScreen,
  GameState,
  JoystickInput,
  PlayerDirection,
  Position,
  ZoneId,
} from '@/types/game'

export function getCurrentObjective(completedZones: ZoneId[]): ZoneId {
  return OBJECTIVE_ORDER.find((id) => !completedZones.includes(id)) ?? 'silo'
}

export function getNearbyZone(
  position: Position,
  completedZones: ZoneId[],
  currentObjectiveId: ZoneId,
  radius = ZONE_RADIUS,
): ZoneId | null {
  if (completedZones.includes(currentObjectiveId)) return null
  const zone = MISSION_ZONES.find((z) => z.id === currentObjectiveId)
  if (!zone) return null
  const dist = Math.hypot(zone.x - position.x, zone.y - position.y)
  return dist < radius ? currentObjectiveId : null
}

export function clampPosition(pos: Position): Position {
  return {
    x: Math.max(MAP_CLAMP_MIN, Math.min(MAP_CLAMP_MAX, pos.x)),
    y: Math.max(MAP_CLAMP_MIN, Math.min(MAP_CLAMP_MAX, pos.y)),
  }
}

export function resolveDirection(dx: number, dy: number, fallback: PlayerDirection): PlayerDirection {
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return fallback
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left'
  return dy > 0 ? 'down' : 'up'
}

export function createInitialState(): GameState {
  return {
    screen: 'start',
    playerPosition: { ...START_POSITION },
    playerDirection: 'down',
    timeRemaining: MISSION_DURATION,
    completedZones: [],
    currentMarketEvent: IDLE_EVENT,
    harvestScore: 0,
    nearbyZoneId: null,
    currentObjectiveId: 'lavoura',
    missionStarted: false,
    isMoving: false,
  }
}

export type GameActions = {
  startMission: () => void
  restartMission: () => void
  goToStart: () => void
  activateZone: () => void
  setJoystick: (input: JoystickInput) => void
  eventPulse: number
  scorePulse: number
  mapPulse: number
  objectiveHint: string
}

export type UseGameReturn = GameState & GameActions

export function useGame(): UseGameReturn {
  const [state, setState] = useState<GameState>(createInitialState)
  const [eventPulse, setEventPulse] = useState(0)
  const [scorePulse, setScorePulse] = useState(0)
  const [mapPulse, setMapPulse] = useState(0)

  const keysRef = useRef<Set<string>>(new Set())
  const joyRef = useRef<JoystickInput>({ x: 0, y: 0 })
  const posRef = useRef<Position>({ ...START_POSITION })
  const dirRef = useRef<PlayerDirection>('down')
  const completedRef = useRef<ZoneId[]>([])
  const screenRef = useRef<GameScreen>('start')
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const eventStepRef = useRef(0)

  const finish = useCallback((success: boolean) => {
    const screen: GameScreen = success ? 'success' : 'failure'
    screenRef.current = screen
    setState((s) => ({ ...s, screen }))
  }, [])

  const startMission = useCallback(() => {
    posRef.current = { ...START_POSITION }
    dirRef.current = 'down'
    completedRef.current = []
    elapsedRef.current = 0
    eventStepRef.current = 0
    lastTsRef.current = null
    keysRef.current.clear()
    joyRef.current = { x: 0, y: 0 }
    screenRef.current = 'playing'
    setEventPulse(0)
    setScorePulse(0)
    setMapPulse(0)
    setState({
      screen: 'playing',
      playerPosition: { ...START_POSITION },
      playerDirection: 'down',
      timeRemaining: MISSION_DURATION,
      completedZones: [],
      currentMarketEvent: IDLE_EVENT,
      harvestScore: 0,
      nearbyZoneId: null,
      currentObjectiveId: 'lavoura',
      missionStarted: true,
      isMoving: false,
    })
  }, [])

  const restartMission = useCallback(() => {
    startMission()
  }, [startMission])

  const goToStart = useCallback(() => {
    screenRef.current = 'start'
    setState(createInitialState())
  }, [])

  const activateZone = useCallback(() => {
    setState((s) => {
      if (s.screen !== 'playing' || !s.nearbyZoneId) return s
      const id = s.nearbyZoneId
      if (s.completedZones.includes(id) || id !== s.currentObjectiveId) return s

      const completedZones = [...s.completedZones, id]
      completedRef.current = completedZones
      const harvestScore = completedZones.length * POINTS_PER_ZONE
      const currentObjectiveId = getCurrentObjective(completedZones)
      const nearbyZoneId = getNearbyZone(posRef.current, completedZones, currentObjectiveId)

      setScorePulse((v) => v + 1)

      if (completedZones.length >= MISSION_ZONES.length) {
        screenRef.current = 'success'
        return {
          ...s,
          screen: 'success',
          completedZones,
          harvestScore,
          currentObjectiveId,
          nearbyZoneId: null,
        }
      }

      return {
        ...s,
        completedZones,
        harvestScore,
        currentObjectiveId,
        nearbyZoneId,
      }
    })
  }, [])

  const setJoystick = useCallback((input: JoystickInput) => {
    joyRef.current = input
  }, [])

  useEffect(() => {
    const moveKeys = new Set([
      'w', 'a', 's', 'd',
      'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
    ])

    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (moveKeys.has(k)) {
        keysRef.current.add(k)
        e.preventDefault()
      }
      if ((k === 'e' || k === 'enter') && screenRef.current === 'playing') {
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

  useEffect(() => {
    if (state.screen !== 'playing') return

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current = ts

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
      const next = clampPosition({
        x: p.x + dx * PLAYER_SPEED * dt,
        y: p.y + dy * PLAYER_SPEED * dt,
      })
      posRef.current = next
      const playerDirection = resolveDirection(dx, dy, dirRef.current)
      dirRef.current = playerDirection

      const completedZones = completedRef.current
      const currentObjectiveId = getCurrentObjective(completedZones)
      const nearbyZoneId = getNearbyZone(next, completedZones, currentObjectiveId)

      elapsedRef.current += dt
      const timeRemaining = Math.max(0, MISSION_DURATION - elapsedRef.current)

      const step = Math.floor(elapsedRef.current / EVENT_INTERVAL)
      let currentMarketEvent = IDLE_EVENT
      if (step > eventStepRef.current && step <= MARKET_EVENTS.length) {
        eventStepRef.current = step
        currentMarketEvent = MARKET_EVENTS[(step - 1) % MARKET_EVENTS.length].text
        setEventPulse((v) => v + 1)
        setMapPulse((v) => v + 1)
      } else if (step > 0) {
        currentMarketEvent = MARKET_EVENTS[(step - 1) % MARKET_EVENTS.length].text
      }

      setState((s) => ({
        ...s,
        playerPosition: next,
        playerDirection,
        timeRemaining,
        nearbyZoneId,
        currentObjectiveId,
        isMoving: mag > 0.05,
        currentMarketEvent: step > 0 ? currentMarketEvent : s.currentMarketEvent,
      }))

      if (timeRemaining <= 0) {
        finish(completedRef.current.length >= MISSION_ZONES.length)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [state.screen, finish])

  const objectiveHint = getObjectiveHint(state.currentObjectiveId)

  return {
    ...state,
    startMission,
    restartMission,
    goToStart,
    activateZone,
    setJoystick,
    eventPulse,
    scorePulse,
    mapPulse,
    objectiveHint,
  }
}
