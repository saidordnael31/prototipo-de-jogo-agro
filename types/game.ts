export type GameScreen = 'start' | 'playing' | 'success' | 'failure'

export type PlayerDirection = 'up' | 'down' | 'left' | 'right'

export type ZoneId = 'lavoura' | 'armazem' | 'caminhao' | 'silo'

export type ZoneIcon = 'sprout' | 'warehouse' | 'truck' | 'silo'

export type Position = { x: number; y: number }

export type MissionZone = {
  id: ZoneId
  label: string
  action: string
  x: number
  y: number
  icon: ZoneIcon
  completed: boolean
  description: string
}

export type MarketEventTone = 'positive' | 'negative' | 'neutral'

export type MarketEvent = {
  text: string
  tone: MarketEventTone
}

export type GameState = {
  screen: GameScreen
  playerPosition: Position
  playerDirection: PlayerDirection
  timeRemaining: number
  completedZones: ZoneId[]
  currentMarketEvent: string
  harvestScore: number
  nearbyZoneId: ZoneId | null
  currentObjectiveId: ZoneId
  missionStarted: boolean
}

export type JoystickInput = { x: number; y: number }
