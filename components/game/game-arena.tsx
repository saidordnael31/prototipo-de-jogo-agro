'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Radio } from 'lucide-react'
import { ZONES, ZONE_RADIUS, type ZoneId } from '@/lib/game/config'
import { ZoneIcon } from './zone-icon'

type Props = {
  playerPos: { x: number; y: number }
  activated: ZoneId[]
  nearZone: ZoneId | null
}

export function GameArena({ playerPos, activated, nearZone }: Props) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-emerald/20 bg-[radial-gradient(circle_at_50%_40%,oklch(0.24_0.05_255),oklch(0.14_0.035_258))] shadow-[0_0_60px_-15px_oklch(0.74_0.16_158_/_0.4)]">
      {/* Camada de fundo: grade, silhueta do Brasil, rotas de commodities */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="oklch(0.83 0.14 85)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="fieldGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="oklch(0.74 0.16 158)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grade */}
        {Array.from({ length: 9 }).map((_, i) => {
          const p = (i + 1) * 10
          return (
            <g key={i} stroke="oklch(0.74 0.16 158)" strokeOpacity="0.06" strokeWidth="0.25">
              <line x1={p} y1="0" x2={p} y2="100" />
              <line x1="0" y1={p} x2="100" y2={p} />
            </g>
          )
        })}

        <rect x="0" y="0" width="100" height="100" fill="url(#fieldGlow)" />

        {/* Silhueta sutil do Brasil (decorativa) */}
        <path
          d="M52 14 L60 16 L64 22 L70 24 L74 30 L72 38 L78 44 L74 52 L78 60 L70 68 L64 78 L56 84 L48 86 L42 80 L38 72 L30 70 L26 62 L32 56 L28 48 L34 42 L30 34 L38 30 L42 22 L48 18 Z"
          fill="oklch(0.83 0.14 85)"
          fillOpacity="0.04"
          stroke="oklch(0.83 0.14 85)"
          strokeOpacity="0.08"
          strokeWidth="0.4"
        />

        {/* Estrada de terra atravessando o mapa */}
        <path
          d="M8 88 Q 40 70 50 50 Q 60 30 92 12"
          fill="none"
          stroke="oklch(0.5 0.05 70)"
          strokeOpacity="0.35"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Rotas de commodities (do centro até cada zona) */}
        {ZONES.map((z) => (
          <line
            key={z.id}
            x1="50"
            y1="50"
            x2={z.x}
            y2={z.y}
            stroke="url(#routeGrad)"
            strokeWidth="0.6"
            strokeDasharray="2 2.5"
            className="route-flow"
          />
        ))}
        {/* Loop perimetral de liquidez */}
        <polygon
          points={ZONES.map((z) => `${z.x},${z.y}`).join(' ')}
          fill="none"
          stroke="oklch(0.74 0.16 158)"
          strokeOpacity="0.18"
          strokeWidth="0.4"
          strokeDasharray="1.5 2"
          className="route-flow"
        />
      </svg>

      {/* Torre de dados no centro */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '50%' }}
      >
        <div className="relative flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_2px_oklch(0.83_0.14_85_/_0.7)]" />
          <div className="mt-0.5 h-6 w-[3px] rounded-full bg-gradient-to-b from-gold/80 to-emerald/20" />
          <span className="mt-1 rounded-full border border-gold/30 bg-background/60 px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-wider text-gold/90 backdrop-blur-sm">
            Torre de Dados
          </span>
          <motion.div
            className="absolute -top-1 h-8 w-8 rounded-full border border-gold/40"
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Zonas da missão */}
      {ZONES.map((z) => {
        const isDone = activated.includes(z.id)
        const isNear = nearZone === z.id
        return (
          <div
            key={z.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
          >
            {/* Halo de proximidade */}
            {isNear && !isDone && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/60"
                style={{ width: `${ZONE_RADIUS * 2}vmin`, height: `${ZONE_RADIUS * 2}vmin` }}
                animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
            <motion.div
              animate={
                isDone
                  ? { scale: 1 }
                  : { y: [0, -3, 0] }
              }
              transition={
                isDone
                  ? { duration: 0.3 }
                  : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
              }
              className="relative flex flex-col items-center gap-1"
            >
              <div
                className={[
                  'flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-sm transition-colors sm:h-12 sm:w-12',
                  isDone
                    ? 'border-emerald bg-emerald/25 text-emerald shadow-[0_0_22px_2px_oklch(0.74_0.16_158_/_0.6)]'
                    : isNear
                      ? 'border-gold bg-gold/20 text-gold shadow-[0_0_22px_2px_oklch(0.83_0.14_85_/_0.55)]'
                      : 'border-emerald/40 bg-card/70 text-emerald/80',
                ].join(' ')}
              >
                <ZoneIcon icon={z.icon} className="h-5 w-5" strokeWidth={2} />
                {isDone && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-background shadow-md"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </motion.span>
                )}
              </div>
              <div className="pointer-events-none flex flex-col items-center leading-none">
                <span className="rounded bg-background/70 px-1 py-0.5 text-[8px] font-semibold text-foreground backdrop-blur-sm sm:text-[9px]">
                  {z.title}
                </span>
                <span
                  className={[
                    'mt-0.5 text-[7px] font-medium sm:text-[8px]',
                    isDone ? 'text-emerald' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {z.subtitle}
                </span>
              </div>
            </motion.div>
          </div>
        )
      })}

      {/* Prompt "Ativar" flutuante */}
      <AnimatePresence>
        {nearZone && (
          <motion.div
            key={nearZone}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[190%]"
            style={{
              left: `${ZONES.find((z) => z.id === nearZone)!.x}%`,
              top: `${ZONES.find((z) => z.id === nearZone)!.y}%`,
            }}
          >
            <div className="flex items-center gap-1 rounded-full border border-gold/60 bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background shadow-[0_0_18px_2px_oklch(0.83_0.14_85_/_0.6)]">
              <Radio className="h-3 w-3" strokeWidth={2.5} />
              Ativar
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Operador (jogador) */}
      <motion.div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        transition={{ type: 'tween', duration: 0 }}
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute h-8 w-8 rounded-full bg-emerald/25 blur-[2px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
          />
          <div className="relative h-5 w-5 rounded-full border-2 border-gold bg-emerald shadow-[0_0_16px_3px_oklch(0.74_0.16_158_/_0.8)]">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          </div>
        </div>
      </motion.div>

      {/* Vinheta cinematográfica */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_10px_oklch(0.1_0.03_258_/_0.7)]" />
    </div>
  )
}
