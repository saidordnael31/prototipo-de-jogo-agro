import { Sprout, Warehouse, Truck, Container, type LucideProps } from 'lucide-react'
import type { ZoneIcon as ZoneIconType } from '@/types/game'

const ICON_MAP = {
  sprout: Sprout,
  warehouse: Warehouse,
  truck: Truck,
  silo: Container,
} as const

export function ZoneIcon({
  icon,
  ...props
}: { icon: ZoneIconType } & LucideProps) {
  const Icon = ICON_MAP[icon]
  return <Icon {...props} />
}
