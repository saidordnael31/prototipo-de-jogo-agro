export type ZoneId = 'lavoura' | 'armazem' | 'caminhao' | 'silo'

export type MissionZone = {
  id: ZoneId
  label: string
  action: string
  x: number
  y: number
}

export const MISSION_DURATION = 45
export const EVENT_INTERVAL = 10
export const POINTS_PER_ZONE = 25
export const PLAYER_SPEED = 175
export const ACTIVATE_RADIUS = 72
export const WORLD_SIZE = 2000

export const OBJECTIVE_ORDER: ZoneId[] = ['lavoura', 'armazem', 'caminhao', 'silo']

export const ZONES: MissionZone[] = [
  { id: 'lavoura', label: 'Lavoura', action: 'Proteção Climática', x: 380, y: 380 },
  { id: 'armazem', label: 'Armazém', action: 'Hedge Cambial', x: 1620, y: 380 },
  { id: 'caminhao', label: 'Caminhão', action: 'Logística Antecipada', x: 380, y: 1620 },
  { id: 'silo', label: 'Silo', action: 'Câmara de Liquidez', x: 1620, y: 1620 },
]

export const MARKET_EVENTS = [
  'USD/BRL caiu 2,1%',
  'Frete para Santos subiu 8%',
  'Clima em Minas segue favorável',
  'Demanda externa aumentou 6,3%',
  'Fila no porto aumentou',
  'Liquidez regional caiu',
]

export type HudState = {
  timeRemaining: number
  harvestScore: number
  completedCount: number
  objectiveText: string
  marketEvent: string
  canActivate: boolean
}

export type MissionEndPayload = {
  success: boolean
  harvestScore: number
  completedCount: number
}
