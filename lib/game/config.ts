export const MISSION_NAME = 'Missão Café Brasil'
export const MISSION_DURATION = 45 // segundos
export const EVENT_INTERVAL = 10 // segundos
export const POINTS_PER_ZONE = 25
export const PLAYER_SPEED = 34 // unidades (%) por segundo
export const ZONE_RADIUS = 11 // proximidade de ativação (%)
export const PLAYER_SIZE = 5 // % do mapa

export type ZoneId = 'lavoura' | 'armazem' | 'caminhao' | 'silo'

export type ZoneConfig = {
  id: ZoneId
  title: string
  subtitle: string
  action: string
  icon: 'sprout' | 'warehouse' | 'truck' | 'silo'
  x: number // 0-100
  y: number // 0-100
}

export const ZONES: ZoneConfig[] = [
  {
    id: 'lavoura',
    title: 'Lavoura',
    subtitle: 'Proteção Climática',
    action: 'Ativar Proteção Climática',
    icon: 'sprout',
    x: 24,
    y: 26,
  },
  {
    id: 'armazem',
    title: 'Armazém',
    subtitle: 'Hedge Cambial',
    action: 'Ativar Hedge Cambial',
    icon: 'warehouse',
    x: 76,
    y: 26,
  },
  {
    id: 'caminhao',
    title: 'Caminhão',
    subtitle: 'Logística Antecipada',
    action: 'Ativar Logística Antecipada',
    icon: 'truck',
    x: 24,
    y: 74,
  },
  {
    id: 'silo',
    title: 'Silo',
    subtitle: 'Câmara de Liquidez',
    action: 'Ativar Câmara de Liquidez',
    icon: 'silo',
    x: 76,
    y: 74,
  },
]

export type MarketEvent = {
  text: string
  tone: 'positive' | 'negative' | 'neutral'
}

export const MARKET_EVENTS: MarketEvent[] = [
  { text: 'USD/BRL caiu 2,1%', tone: 'negative' },
  { text: 'Frete para Santos subiu 8%', tone: 'negative' },
  { text: 'Clima em Minas segue favorável', tone: 'positive' },
  { text: 'Demanda externa aumentou 6,3%', tone: 'positive' },
]

export type GamePhase = 'start' | 'playing' | 'end'
