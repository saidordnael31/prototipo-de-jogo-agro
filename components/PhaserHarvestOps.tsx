'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { HudState, MissionEndPayload } from '@/game/phaser/missionData'
import { MobileJoystick } from './MobileJoystick'
import { ActionButton } from './ActionButton'

type Props = {
  onMissionEnd: (payload: MissionEndPayload) => void
}

export function PhaserHarvestOps({ onMissionEnd }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<import('phaser').Game | null>(null)
  const [hud, setHud] = useState<HudState>({
    timeRemaining: 45,
    harvestScore: 0,
    completedCount: 0,
    objectiveText: 'Próximo: vá até Lavoura',
    marketEvent: 'Mercado estável — monitorando',
    canActivate: false,
  })
  const [engineReady, setEngineReady] = useState(false)

  const onHudUpdate = useCallback((state: HudState) => setHud(state), [])
  const handleEnd = useCallback(
    (payload: MissionEndPayload) => onMissionEnd(payload),
    [onMissionEnd],
  )

  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false

    import('@/game/phaser/createGame').then(({ createHarvestGame }) => {
      if (destroyed || !containerRef.current) return
      const game = createHarvestGame(containerRef.current, {
        onHudUpdate,
        onMissionEnd: handleEnd,
      })
      gameRef.current = game
      game.events.once('ready', () => setEngineReady(true))
      // fallback se evento ready já passou
      setTimeout(() => setEngineReady(true), 800)
    })

    return () => {
      destroyed = true
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [onHudUpdate, handleEnd])

  const sendJoystick = (x: number, y: number) => {
    const scene = gameRef.current?.scene.getScene('FarmScene')
    scene?.events.emit('joystick', { x, y })
  }

  const activate = () => {
    const scene = gameRef.current?.scene.getScene('FarmScene')
    scene?.events.emit('activate')
  }

  const seconds = Math.ceil(hud.timeRemaining)
  const low = seconds <= 10

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-1.5 rounded-xl border border-emerald/20 bg-card/80 p-2 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald">Missão Café Brasil</p>
          <span
            className={[
              'rounded-md px-2 py-0.5 font-mono text-sm font-bold tabular-nums',
              low ? 'bg-red-500/20 text-red-400' : 'bg-gold/15 text-gold',
            ].join(' ')}
          >
            {seconds}s
          </span>
        </div>
        <p className="text-xs font-semibold text-foreground">{hud.objectiveText}</p>
        <div className="flex gap-2 text-[10px]">
          <span className="rounded bg-emerald/15 px-1.5 py-0.5 font-mono font-bold text-emerald">
            {hud.harvestScore}/100
          </span>
          <span className="rounded bg-gold/15 px-1.5 py-0.5 font-mono font-bold text-gold">
            {hud.completedCount}/4
          </span>
        </div>
        <p className="truncate text-[10px] text-muted-foreground">📡 {hud.marketEvent}</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald/30 shadow-[0_0_40px_-8px_oklch(0.74_0.16_158)]"
        style={{ aspectRatio: '390/480', minHeight: 280 }}
      >
        {!engineReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f1a2e] text-xs text-emerald">
            Carregando engine e sprites…
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 pb-1">
        <MobileJoystick onMove={sendJoystick} />
        <ActionButton onActivate={activate} disabled={!hud.canActivate} />
      </div>
    </div>
  )
}
