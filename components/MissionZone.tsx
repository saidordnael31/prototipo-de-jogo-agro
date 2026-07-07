'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ZONE_RADIUS } from '@/lib/gameData'
import type { MissionZone as MissionZoneType } from '@/types/game'
import { ZoneIcon } from './ZoneIcon'

type Props = {
  zone: MissionZoneType
  completed: boolean
  isCurrent: boolean
  isNearby: boolean
}

const BUILDING_STYLES: Record<string, string> = {
  lavoura: 'from-emerald/40 to-emerald/10 border-emerald/50',
  armazem: 'from-[oklch(0.45_0.05_70)]/50 to-[oklch(0.35_0.04_60)]/30 border-[oklch(0.55_0.06_70)]/60',
  caminhao: 'from-gold/30 to-gold/10 border-gold/50',
  silo: 'from-[oklch(0.55_0.04_250)]/50 to-[oklch(0.4_0.04_255)]/30 border-[oklch(0.6_0.05_250)]/50',
}

export function MissionZone({ zone, completed, isCurrent, isNearby }: Props) {
  const buildingClass = BUILDING_STYLES[zone.id] ?? 'from-card to-card border-emerald/40'

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
    >
      {isNearby && !completed && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
          style={{ width: `${ZONE_RADIUS * 2.2}vmin`, height: `${ZONE_RADIUS * 2.2}vmin` }}
          animate={{ scale: [0.92, 1.1, 0.92], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {isCurrent && !completed && (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald/60"
            style={{ width: `${ZONE_RADIUS * 3}vmin`, height: `${ZONE_RADIUS * 3}vmin` }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/60 bg-gold px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-background shadow-[0_0_12px_oklch(0.83_0.14_85)]"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          >
            ▼ Objetivo
          </motion.div>
        </>
      )}

      <motion.div
        animate={completed ? { scale: 1 } : isCurrent ? { y: [0, -2, 0] } : {}}
        transition={
          completed
            ? { duration: 0.3 }
            : { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
        }
        className="relative flex flex-col items-center"
      >
        {/* Estrutura do prédio */}
        <div
          className={[
            'relative flex h-14 w-14 items-end justify-center rounded-lg border-2 bg-gradient-to-b pb-1.5 shadow-lg sm:h-16 sm:w-16',
            buildingClass,
            completed
              ? 'shadow-[0_0_20px_3px_oklch(0.74_0.16_158_/_0.5)]'
              : isNearby
                ? 'shadow-[0_0_20px_3px_oklch(0.83_0.14_85_/_0.5)]'
                : isCurrent
                  ? 'shadow-[0_0_14px_2px_oklch(0.74_0.16_158_/_0.35)]'
                  : 'opacity-70',
          ].join(' ')}
        >
          {/* Telhado / topo */}
          {zone.id === 'silo' && (
            <div className="absolute -top-3 left-1/2 h-8 w-5 -translate-x-1/2 rounded-t-full bg-[oklch(0.6_0.04_250)] border border-[oklch(0.65_0.05_250)]" />
          )}
          {zone.id === 'armazem' && (
            <div className="absolute -top-2 left-0 right-0 h-3 rounded-t-sm bg-[oklch(0.5_0.05_60)]" />
          )}
          {zone.id === 'lavoura' && (
            <div className="absolute inset-x-1 bottom-1 flex gap-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 flex-1 rounded-t-full bg-emerald/60" />
              ))}
            </div>
          )}
          {zone.id === 'caminhao' && (
            <div className="absolute bottom-2 flex items-end gap-0.5">
              <div className="h-4 w-5 rounded-sm bg-gold/50" />
              <div className="h-3 w-3 rounded-sm bg-gold/40" />
            </div>
          )}

          <div
            className={[
              'flex h-8 w-8 items-center justify-center rounded-md border backdrop-blur-sm',
              completed
                ? 'border-emerald bg-emerald/30 text-emerald'
                : 'border-white/20 bg-black/20 text-foreground',
            ].join(' ')}
          >
            <ZoneIcon icon={zone.icon} className="h-4 w-4" strokeWidth={2} />
          </div>

          {completed && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-background shadow-lg"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
          )}
        </div>

        <div className="pointer-events-none mt-1 flex flex-col items-center leading-none">
          <span className="rounded border border-background/30 bg-background/80 px-1.5 py-0.5 text-[8px] font-bold text-foreground backdrop-blur-sm">
            {zone.label}
          </span>
          <span
            className={[
              'mt-0.5 text-[7px] font-medium',
              completed ? 'text-gold' : isCurrent ? 'text-emerald' : 'text-muted-foreground',
            ].join(' ')}
          >
            {zone.action}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
