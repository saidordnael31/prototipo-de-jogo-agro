'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Radio } from 'lucide-react'
import {
  TOWER_POS,
  ZONES,
  ZONE_RADIUS,
  type ZoneId,
} from '@/lib/game/config'
import type { NextObjective } from '@/lib/game/use-harvest-game'
import { ZoneIcon } from './zone-icon'

type Props = {
  playerPos: { x: number; y: number }
  facing: number
  moving: boolean
  trail: { x: number; y: number }[]
  activated: ZoneId[]
  nearZone: ZoneId | null
  nearTower: boolean
  allDone: boolean
  nextObjective: NextObjective
  shake: number
}

export function GameArena({
  playerPos,
  facing,
  moving,
  trail,
  activated,
  nearZone,
  nearTower,
  allDone,
  nextObjective,
  shake,
}: Props) {
  // Alvo do próximo objetivo (zona ou torre)
  const target =
    nextObjective === 'tower'
      ? TOWER_POS
      : nextObjective
        ? ZONES.find((z) => z.id === nextObjective) ?? null
        : null

  return (
    <motion.div
      animate={shake ? { x: [0, -4, 4, -3, 3, 0], y: [0, 3, -3, 2, -2, 0] } : { x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
      key={`arena-${shake}`}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-emerald/20 bg-[radial-gradient(circle_at_50%_40%,oklch(0.24_0.05_255),oklch(0.14_0.035_258))] shadow-[0_0_60px_-15px_oklch(0.74_0.16_158_/_0.4)]"
    >
      {/* Camada de fundo: grade, silhueta do Brasil, campo de café, rotas */}
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
          <pattern id="coffeeField" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="1.6" cy="1.6" r="0.7" fill="oklch(0.74 0.16 158)" fillOpacity="0.16" />
            <circle cx="5.1" cy="5.1" r="0.7" fill="oklch(0.74 0.16 158)" fillOpacity="0.1" />
          </pattern>
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

        {/* Talhões de café (textura) */}
        <rect x="8" y="8" width="34" height="30" rx="2" fill="url(#coffeeField)" opacity="0.9" />
        <rect x="8" y="60" width="30" height="30" rx="2" fill="url(#coffeeField)" opacity="0.7" />
        <rect x="60" y="60" width="32" height="30" rx="2" fill="url(#coffeeField)" opacity="0.7" />

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
        <path
          d="M4 50 H 96"
          fill="none"
          stroke="oklch(0.5 0.05 70)"
          strokeOpacity="0.18"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="1 3"
        />

        {/* Bloco do armazém (perto do Armazém) */}
        <g opacity="0.6">
          <rect x="70" y="18" width="12" height="8" rx="0.8" fill="oklch(0.3 0.03 250)" stroke="oklch(0.74 0.16 158)" strokeOpacity="0.3" strokeWidth="0.3" />
          <path d="M70 18 L76 14 L82 18 Z" fill="oklch(0.36 0.03 250)" stroke="oklch(0.74 0.16 158)" strokeOpacity="0.3" strokeWidth="0.3" />
        </g>
        {/* Área do silo (perto do Silo) */}
        <g opacity="0.6">
          <rect x="72" y="70" width="3.4" height="10" rx="1.7" fill="oklch(0.32 0.03 250)" stroke="oklch(0.83 0.14 85)" strokeOpacity="0.25" strokeWidth="0.3" />
          <rect x="77" y="72" width="3.4" height="8" rx="1.7" fill="oklch(0.3 0.03 250)" stroke="oklch(0.83 0.14 85)" strokeOpacity="0.25" strokeWidth="0.3" />
        </g>

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

        {/* Caminho brilhante até o próximo objetivo */}
        {target && (
          <line
            x1={playerPos.x}
            y1={playerPos.y}
            x2={target.x}
            y2={target.y}
            stroke="oklch(0.83 0.14 85)"
            strokeOpacity="0.75"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeDasharray="1.4 1.8"
            className="route-flow"
          />
        )}
      </svg>

      {/* Rastro de movimento do operador */}
      {trail.map((t, i) => {
        const op = ((i + 1) / trail.length) * 0.4
        const size = 3 + (i / trail.length) * 4
        return (
          <span
            key={`${t.x.toFixed(1)}-${t.y.toFixed(1)}-${i}`}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: size,
              height: size,
              opacity: op,
              filter: 'blur(1px)',
            }}
          />
        )
      })}

      {/* Torre de dados no centro */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${TOWER_POS.x}%`, top: `${TOWER_POS.y}%` }}
      >
        <div className="relative flex flex-col items-center">
          <div
            className={[
              'h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_2px_oklch(0.83_0.14_85_/_0.7)]',
              allDone ? 'animate-pulse' : '',
            ].join(' ')}
          />
          <div className="mt-0.5 h-6 w-[3px] rounded-full bg-gradient-to-b from-gold/80 to-emerald/20" />
          <span className="mt-1 rounded-full border border-gold/30 bg-background/60 px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-wider text-gold/90 backdrop-blur-sm">
            Torre de Dados
          </span>
          <motion.div
            className={[
              'absolute -top-1 h-8 w-8 rounded-full border',
              allDone ? 'border-emerald/60' : 'border-gold/40',
            ].join(' ')}
            animate={{ scale: [1, allDone ? 2.6 : 2.2], opacity: [0.5, 0] }}
            transition={{ duration: allDone ? 1.6 : 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Halo de finalização na torre quando tudo concluído */}
      {allDone && (
        <motion.div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald/60"
          style={{ left: `${TOWER_POS.x}%`, top: `${TOWER_POS.y}%`, width: '20vmin', height: '20vmin' }}
          animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 1.3, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Zonas da missão */}
      {ZONES.map((z) => {
        const isDone = activated.includes(z.id)
        const isNear = nearZone === z.id
        const isNext = nextObjective === z.id
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
            {/* Seta indicando o próximo objetivo */}
            {isNext && !isNear && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full"
                style={{ marginTop: '-3.6rem' }}
                animate={{ y: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="text-lg leading-none text-gold drop-shadow-[0_0_6px_oklch(0.83_0.14_85)]">
                  {'▾'}
                </span>
              </motion.div>
            )}
            <motion.div
              animate={isDone ? { scale: 1 } : { y: [0, -3, 0] }}
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
                      : isNext
                        ? 'border-gold/70 bg-card/70 text-gold shadow-[0_0_16px_1px_oklch(0.83_0.14_85_/_0.35)]'
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

      {/* Prompt "ATIVAR" flutuante sobre a zona detectada */}
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
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY }}
              className="flex items-center gap-1 rounded-full border border-gold/60 bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background shadow-[0_0_18px_2px_oklch(0.83_0.14_85_/_0.6)]"
            >
              <Radio className="h-3 w-3" strokeWidth={2.5} />
              Ativar
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Operador (jogador) — token de fazendeiro top-down */}
      <motion.div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        transition={{ type: 'tween', duration: 0 }}
      >
        <div className="relative flex items-center justify-center">
          {/* Brilho — verde normal, dourado perto de objetivo */}
          <motion.div
            className={[
              'absolute h-10 w-10 rounded-full blur-[3px]',
              nearZone || (allDone && nearTower) ? 'bg-gold/40' : 'bg-emerald/25',
            ].join(' ')}
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.35, 0.6] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Wrapper de direção */}
          <div
            className="relative flex h-7 w-7 items-center justify-center"
            style={{ transform: `rotate(${facing + 90}deg)` }}
          >
            {/* Indicador de direção (ponta) */}
            <div className="absolute -top-1.5 h-0 w-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-gold drop-shadow-[0_0_4px_oklch(0.83_0.14_85)]" />
            {/* Corpo / cabeça vista de cima */}
            <div
              className={[
                'relative h-6 w-6 overflow-hidden rounded-full border-2 bg-emerald shadow-[0_0_16px_3px_oklch(0.74_0.16_158_/_0.85)]',
                nearZone || (allDone && nearTower) ? 'border-gold' : 'border-gold/80',
              ].join(' ')}
            >
              {/* Silhueta do boné/capacete (metade superior) */}
              <div className="absolute inset-x-0 top-0 h-3 rounded-t-full bg-gold/90" />
              {/* Aba do boné */}
              <div className="absolute left-1/2 top-3 h-[3px] w-4 -translate-x-1/2 rounded-full bg-gold" />
              {/* Núcleo */}
              <div className="absolute left-1/2 top-[62%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80" />
            </div>
          </div>

          {/* Passo (pulsa ao mover) */}
          {moving && (
            <motion.div
              className="absolute h-8 w-8 rounded-full border border-emerald/50"
              animate={{ scale: [0.7, 1.4], opacity: [0.5, 0] }}
              transition={{ duration: 0.7, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
        </div>
      </motion.div>

      {/* Névoa / atmosfera agro-futurista */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.1_0.03_258_/_0.55),transparent_55%)]" />

      {/* Vinheta cinematográfica */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_10px_oklch(0.1_0.03_258_/_0.7)]" />
    </motion.div>
  )
}
