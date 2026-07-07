import { Sprout, Warehouse, Truck, Container, type LucideProps } from 'lucide-react'
import type { ZoneConfig } from '@/lib/game/config'

const MAP = {
  sprout: Sprout,
  warehouse: Warehouse,
  truck: Truck,
  silo: Container,
} as const

export function ZoneIcon({
  icon,
  ...props
}: { icon: ZoneConfig['icon'] } & LucideProps) {
  const Cmp = MAP[icon]
  return <Cmp {...props} />
}
