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

export function MissionZone({ zone, completed, isCurrent, isNearby }: Props) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
    >
      {isNearby && !completed && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/70"
          style={{ width: `${ZONE_RADIUS * 2}vmin`, height: `${ZONE_RADIUS * 2}vmin` }}
          animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {isCurrent && !completed && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald/50"
          style={{ width: `${ZONE_RADIUS * 2.6}vmin`, height: `${ZONE_RADIUS * 2.6}vmin` }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      <motion.div
        animate={completed ? { scale: 1 } : { y: [0, -3, 0] }}
        transition={
          completed
            ? { duration: 0.3 }
            : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
        }
        className="relative flex flex-col items-center gap-1"
      >
        <div
          className={[
            'flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-sm transition-colors sm:h-12 sm:w-12',
            completed
              ? 'border-gold bg-emerald/30 text-emerald shadow-[0_0_24px_3px_oklch(0.74_0.16_158_/_0.65)]'
              : isNearby
                ? 'border-gold bg-gold/25 text-gold shadow-[0_0_24px_3px_oklch(0.83_0.14_85_/_0.6)]'
                : isCurrent
                  ? 'border-emerald/70 bg-card/80 text-emerald shadow-[0_0_16px_2px_oklch(0.74_0.16_158_/_0.4)]'
                  : 'border-emerald/25 bg-card/50 text-emerald/50 opacity-60',
          ].join(' ')}
        >
          <ZoneIcon icon={zone.icon} className="h-5 w-5" strokeWidth={2} />
          {completed && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-background shadow-md"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </motion.span>
          )}
        </div>
        <div className="pointer-events-none flex flex-col items-center leading-none">
          <span className="rounded bg-background/75 px-1 py-0.5 text-[8px] font-semibold text-foreground backdrop-blur-sm sm:text-[9px]">
            {zone.label}
          </span>
          <span
            className={[
              'mt-0.5 text-[7px] font-medium sm:text-[8px]',
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
