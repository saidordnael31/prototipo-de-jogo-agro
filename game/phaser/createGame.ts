import * as Phaser from 'phaser'
import { FarmScene } from './scenes/FarmScene'

export type GameCallbacks = {
  onHudUpdate: (state: import('./missionData').HudState) => void
  onMissionEnd: (payload: import('./missionData').MissionEndPayload) => void
}

export function createHarvestGame(parent: HTMLElement, callbacks: GameCallbacks): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 390,
    height: 480,
    backgroundColor: '#0f1a2e',
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [FarmScene],
    callbacks: {
      preBoot: (game) => {
        game.registry.set('callbacks', callbacks)
      },
    },
  })
}
