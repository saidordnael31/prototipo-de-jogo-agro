'use client'

import { motion } from 'framer-motion'
import { Radio } from 'lucide-react'

type Props = {
  onActivate: () => void
  disabled: boolean
}

export function ActionButton({ onActivate, disabled }: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        type="button"
        onClick={onActivate}
        disabled={disabled}
        whileTap={!disabled ? { scale: 0.92 } : undefined}
        animate={
          !disabled
            ? {
                boxShadow: [
                  '0 0 0 0 oklch(0.83 0.14 85 / 0.5)',
                  '0 0 0 12px oklch(0.83 0.14 85 / 0)',
                ],
              }
            : {}
        }
        transition={!disabled ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY } : {}}
        className={[
          'touch-none-select flex h-[88px] w-[88px] min-h-[48px] flex-col items-center justify-center gap-1 rounded-full border-2 font-bold transition-colors',
          !disabled
            ? 'border-gold bg-gold text-background'
            : 'border-border bg-card/50 text-muted-foreground',
        ].join(' ')}
      >
        <Radio className="h-6 w-6" strokeWidth={2.5} />
        <span className="text-sm uppercase tracking-wide">Ativar</span>
      </motion.button>
      <span className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground">
        Tecla E
      </span>
    </div>
  )
}
