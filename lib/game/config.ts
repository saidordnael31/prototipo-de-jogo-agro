export const MISSION_NAME = 'Missão Café Brasil'
export const MISSION_DURATION = 45 // segundos
export const EVENT_INTERVAL = 10 // segundos
export const POINTS_PER_ZONE = 25
export const PLAYER_SPEED = 34 // unidades (%) por segundo
export const ZONE_RADIUS = 12 // proximidade de ativação (%)
export const PLAYER_SIZE = 5 // % do mapa

// Torre de Dados (centro) — ponto de partida e de finalização
export const TOWER_POS = { x: 50, y: 50 }
export const TOWER_RADIUS = 12

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

export type EventIcon = 'dollar' | 'ship' | 'sun' | 'globe' | 'anchor' | 'droplet'

export type MarketEvent = {
  text: string
  tone: 'positive' | 'negative' | 'neutral'
  icon: EventIcon
}

export const MARKET_EVENTS: MarketEvent[] = [
  { text: 'USD/BRL caiu 2,1%', tone: 'negative', icon: 'dollar' },
  { text: 'Frete para Santos subiu 8%', tone: 'negative', icon: 'ship' },
  { text: 'Clima em Minas segue favorável', tone: 'positive', icon: 'sun' },
  { text: 'Demanda externa aumentou 6,3%', tone: 'positive', icon: 'globe' },
  { text: 'Fila no porto aumentou', tone: 'negative', icon: 'anchor' },
  { text: 'Liquidez regional caiu', tone: 'negative', icon: 'droplet' },
]

// Guia de objetivo — texto exibido abaixo do card de evento
export const ZONE_GUIDANCE: Record<ZoneId, string> = {
  lavoura: 'Vá até a Lavoura e ative a Proteção Climática',
  armazem: 'Vá até o Armazém e ative o Hedge Cambial',
  caminhao: 'Vá até o Caminhão e ative a Logística Antecipada',
  silo: 'Vá até o Silo e ative a Câmara de Liquidez',
}
export const TOWER_GUIDANCE = 'Volte para a Torre de Dados para finalizar a missão'

// Rótulo curto para "riscos não mitigados" na tela de resultado
export const ZONE_RISK_LABEL: Record<ZoneId, string> = {
  lavoura: 'Proteção Climática',
  armazem: 'Hedge Cambial',
  caminhao: 'Logística Antecipada',
  silo: 'Câmara de Liquidez',
}

export type GamePhase = 'start' | 'playing' | 'end'
