'use client'

import { ZONES, type ZoneId } from '@/lib/game/config'

type Props = {
  playerPos: { x: number; y: number }
  activated: ZoneId[]
}

export function MiniMap({ playerPos, activated }: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground">
        Mini-mapa
      </span>
      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-emerald/30 bg-navy-deep/80">
        <div className="absolute inset-0 bg-[linear-gradient(oklch(0.74_0.16_158_/_0.12)_1px,transparent_1px),linear-gradient(90deg,oklch(0.74_0.16_158_/_0.12)_1px,transparent_1px)] bg-[size:8px_8px]" />
        {ZONES.map((z) => {
          const done = activated.includes(z.id)
          return (
            <span
              key={z.id}
              className={[
                'absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
                done ? 'bg-emerald shadow-[0_0_6px_1px_oklch(0.74_0.16_158)]' : 'bg-gold/70',
              ].join(' ')}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
            />
          )
        })}
        <span
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background bg-foreground"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        />
      </div>
    </div>
  )
}
