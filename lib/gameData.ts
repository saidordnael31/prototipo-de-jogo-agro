import type { MarketEvent, MissionZone, ZoneId } from '@/types/game'

export const MISSION_NAME = 'Missão Café Brasil'
export const MISSION_DURATION = 45
export const EVENT_INTERVAL = 10
export const POINTS_PER_ZONE = 25
export const PLAYER_SPEED = 34
export const ZONE_RADIUS = 11
export const MAP_CLAMP_MIN = 6
export const MAP_CLAMP_MAX = 94
export const START_POSITION = { x: 50, y: 50 }

export const OBJECTIVE_ORDER: ZoneId[] = ['lavoura', 'armazem', 'caminhao', 'silo']

export const MISSION_ZONES: MissionZone[] = [
  {
    id: 'lavoura',
    label: 'Lavoura',
    action: 'Proteção Climática',
    x: 24,
    y: 26,
    icon: 'sprout',
    completed: false,
    description: 'Proteja a safra contra variações climáticas.',
  },
  {
    id: 'armazem',
    label: 'Armazém',
    action: 'Hedge Cambial',
    x: 76,
    y: 26,
    icon: 'warehouse',
    completed: false,
    description: 'Trave o risco cambial do estoque.',
  },
  {
    id: 'caminhao',
    label: 'Caminhão',
    action: 'Logística Antecipada',
    x: 24,
    y: 74,
    icon: 'truck',
    completed: false,
    description: 'Antecipe a logística antes do pico de frete.',
  },
  {
    id: 'silo',
    label: 'Silo',
    action: 'Câmara de Liquidez',
    x: 76,
    y: 74,
    icon: 'silo',
    completed: false,
    description: 'Garanta liquidez regional para a colheita.',
  },
]

export const MARKET_EVENTS: MarketEvent[] = [
  { text: 'USD/BRL caiu 2,1%', tone: 'negative' },
  { text: 'Frete para Santos subiu 8%', tone: 'negative' },
  { text: 'Clima em Minas segue favorável', tone: 'positive' },
  { text: 'Demanda externa aumentou 6,3%', tone: 'positive' },
  { text: 'Fila no porto aumentou', tone: 'negative' },
  { text: 'Liquidez regional caiu', tone: 'negative' },
]

export const IDLE_EVENT = 'Mercado estável — monitorando riscos'

export function getObjectiveHint(zoneId: ZoneId): string {
  const zone = MISSION_ZONES.find((z) => z.id === zoneId)
  return zone ? `vá até a ${zone.label}` : 'complete a missão'
}
