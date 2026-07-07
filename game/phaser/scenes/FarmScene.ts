import * as Phaser from 'phaser'
import {
  ACTIVATE_RADIUS,
  EVENT_INTERVAL,
  MARKET_EVENTS,
  MISSION_DURATION,
  OBJECTIVE_ORDER,
  POINTS_PER_ZONE,
  PLAYER_SPEED,
  WORLD_SIZE,
  ZONES,
  type HudState,
  type ZoneId,
} from '../missionData'
import { gameAsset } from '../assetPath'

const CENTER = WORLD_SIZE / 2

export class FarmScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>
  private buildings = new Map<ZoneId, Phaser.GameObjects.Sprite>()
  private zoneGlows = new Map<ZoneId, Phaser.GameObjects.Arc>()
  private completed: ZoneId[] = []
  private elapsed = 0
  private eventIndex = 0
  private joystick = { x: 0, y: 0 }
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  private objectiveArrow!: Phaser.GameObjects.Triangle
  private pathGfx!: Phaser.GameObjects.Graphics
  private trees!: Phaser.Physics.Arcade.StaticGroup

  constructor() {
    super({ key: 'FarmScene' })
  }

  preload() {
    const files = [
      'grass0.png', 'grass1.png', 'grass2.png', 'grass3.png',
      'road.png', 'tree.png', 'farmer.png',
      'lavoura.png', 'armazem.png', 'caminhao.png', 'silo.png', 'particle.png',
    ]
    for (const f of files) {
      const key = f.replace('.png', '')
      if (key === 'farmer') {
        this.load.spritesheet(key, gameAsset(f), { frameWidth: 32, frameHeight: 32 })
      } else {
        this.load.image(key, gameAsset(f))
      }
    }
    this.load.on('loaderror', (file: { key: string; url: string }) => {
      console.error('[HarvestOps] Falha ao carregar asset:', file.key, file.url)
    })
  }

  create() {
    this.buildWorld()
    this.createPlayer()
    this.createZones()
    this.createInput()
    this.createEffects()

    this.cameras.main.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE)
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)
    this.cameras.main.setZoom(1.15)

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('farmer', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    })

    this.events.on('joystick', (v: { x: number; y: number }) => {
      this.joystick = v
    })
    this.events.on('activate', () => this.tryActivate())

    this.time.addEvent({ delay: 100, loop: true, callback: () => this.tickHud() })
    this.emitHud()
  }

  private buildWorld() {
    // Um tileSprite em vez de ~3900 imagens (travava o browser)
    this.add
      .tileSprite(CENTER, CENTER, WORLD_SIZE, WORLD_SIZE, 'grass0')
      .setDepth(0)

    const tile = 32
    for (let i = 0; i < WORLD_SIZE; i += tile) {
      this.add.image(CENTER, i + 16, 'road').setDepth(1).setAlpha(0.85)
      this.add.image(i + 16, CENTER, 'road').setDepth(1).setAlpha(0.85).setAngle(90)
    }

    this.trees = this.physics.add.staticGroup()
    const treePositions = [
      [200, 600], [500, 200], [900, 700], [1100, 400], [1500, 900],
      [700, 1500], [1300, 1200], [1700, 600], [600, 1100], [1000, 1000],
      [250, 1200], [1800, 1400], [1400, 200], [300, 900],
    ]
    for (const [x, y] of treePositions) {
      if (Math.hypot(x - CENTER, y - CENTER) < 120) continue
      const t = this.trees.create(x, y, 'tree') as Phaser.Physics.Arcade.Sprite
      t.setDepth(5).setScale(1.2)
      const body = t.body as Phaser.Physics.Arcade.StaticBody
      body.setSize(20, 16).setOffset(6, 24)
    }

    const tower = this.add.rectangle(CENTER, CENTER, 48, 48, 0xd4a017, 0.9).setDepth(3)
    this.add.rectangle(CENTER, CENTER - 30, 60, 8, 0xd4a017, 0.5).setDepth(3)
    this.add.text(CENTER, CENTER + 36, 'TORRE', {
      fontSize: '10px',
      color: '#f5d76e',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(4)
    tower.setStrokeStyle(2, 0xf5d76e, 0.6)
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(CENTER, CENTER, 'farmer', 0)
    this.player.setDepth(10).setCollideWorldBounds(true)
    this.player.setSize(18, 14).setOffset(7, 14)
    this.physics.world.setBounds(40, 40, WORLD_SIZE - 80, WORLD_SIZE - 80)
    this.physics.add.collider(this.player, this.trees)
  }

  private createZones() {
    this.pathGfx = this.add.graphics().setDepth(2)
    this.objectiveArrow = this.add.triangle(0, 0, 0, 10, 8, 0, 16, 10, 0xf5d76e).setDepth(12).setAlpha(0)

    for (const zone of ZONES) {
      const b = this.add.sprite(zone.x, zone.y, zone.id).setDepth(6)
      b.setScale(1.1)
      const glow = this.add.circle(zone.x, zone.y, ACTIVATE_RADIUS, 0xf5d76e, 0).setDepth(4)
      glow.setStrokeStyle(2, 0xf5d76e, 0)
      this.buildings.set(zone.id, b)
      this.zoneGlows.set(zone.id, glow)

      this.add.text(zone.x, zone.y + 44, zone.label, {
        fontSize: '11px',
        color: '#e8f5e9',
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(7)
    }
  }

  private createInput() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()
      this.wasd = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        e: Phaser.Input.Keyboard.KeyCodes.E,
      }) as Record<string, Phaser.Input.Keyboard.Key>
      this.input.keyboard.on('keydown-E', () => this.tryActivate())
    }
  }

  private createEffects() {
    this.dustEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.15, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 300,
      frequency: -1,
      tint: 0xc4a574,
    }).setDepth(9)
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000
    this.elapsed += dt

    let vx = 0
    let vy = 0
    if (this.cursors?.left.isDown || this.wasd?.a.isDown) vx -= 1
    if (this.cursors?.right.isDown || this.wasd?.d.isDown) vx += 1
    if (this.cursors?.up.isDown || this.wasd?.w.isDown) vy -= 1
    if (this.cursors?.down.isDown || this.wasd?.s.isDown) vy += 1
    vx += this.joystick.x
    vy += this.joystick.y

    const mag = Math.hypot(vx, vy)
    if (mag > 0.1) {
      vx = (vx / mag) * PLAYER_SPEED
      vy = (vy / mag) * PLAYER_SPEED
      this.player.setVelocity(vx, vy)
      this.player.anims.play('walk', true)
      if (Math.abs(vx) > Math.abs(vy)) {
        this.player.setFlipX(vx < 0)
      }
      this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 14, 1)
    } else {
      this.player.setVelocity(0, 0)
      this.player.anims.pause()
    }

    this.updateObjectiveVisuals()
    this.updateZoneGlows()

    const remaining = MISSION_DURATION - this.elapsed
    if (remaining <= 0) {
      this.endMission(this.completed.length >= ZONES.length)
    }

    const eventStep = Math.floor(this.elapsed / EVENT_INTERVAL)
    if (eventStep > this.eventIndex && eventStep <= MARKET_EVENTS.length) {
      this.eventIndex = eventStep
      this.cameras.main.flash(200, 245, 215, 110, false)
      this.cameras.main.shake(120, 0.002)
    }
  }

  private getCurrentObjective(): ZoneId {
    return OBJECTIVE_ORDER.find((id) => !this.completed.includes(id)) ?? 'silo'
  }

  private getNearbyZone(): ZoneId | null {
    const obj = this.getCurrentObjective()
    if (this.completed.includes(obj)) return null
    const zone = ZONES.find((z) => z.id === obj)!
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y)
    return dist < ACTIVATE_RADIUS ? obj : null
  }

  private tryActivate() {
    const nearby = this.getNearbyZone()
    if (!nearby || this.completed.includes(nearby)) return

    this.completed.push(nearby)
    const building = this.buildings.get(nearby)!
    this.tweens.add({ targets: building, scale: 1.3, yoyo: true, duration: 200 })
    this.cameras.main.flash(150, 46, 204, 113, false)

    const burst = this.add.particles(building.x, building.y, 'particle', {
      speed: { min: 60, max: 140 },
      scale: { start: 0.3, end: 0 },
      lifespan: 500,
      quantity: 16,
      tint: [0xf5d76e, 0x2ecc71],
    })
    this.time.delayedCall(600, () => burst.destroy())

    building.setTint(0x88ff88)

    if (this.completed.length >= ZONES.length) {
      this.time.delayedCall(400, () => this.endMission(true))
    }
    this.emitHud()
  }

  private updateZoneGlows() {
    const current = this.getCurrentObjective()
    const nearby = this.getNearbyZone()

    for (const zone of ZONES) {
      const glow = this.zoneGlows.get(zone.id)!
      const done = this.completed.includes(zone.id)
      if (done) {
        glow.setFillStyle(0x2ecc71, 0.15)
        glow.setStrokeStyle(2, 0x2ecc71, 0.6)
      } else if (zone.id === current) {
        glow.setFillStyle(0xf5d76e, nearby === zone.id ? 0.2 : 0.08)
        glow.setStrokeStyle(2, 0xf5d76e, nearby === zone.id ? 0.9 : 0.4)
      } else {
        glow.setFillStyle(0x000000, 0)
        glow.setStrokeStyle(1, 0x555555, 0.2)
      }
    }
  }

  private updateObjectiveVisuals() {
    const obj = this.getCurrentObjective()
    if (this.completed.length >= ZONES.length) {
      this.pathGfx.clear()
      this.objectiveArrow.setAlpha(0)
      return
    }
    const zone = ZONES.find((z) => z.id === obj)!
    this.pathGfx.clear()
    this.pathGfx.lineStyle(2, 0xf5d76e, 0.35)
    this.pathGfx.beginPath()
    this.pathGfx.moveTo(this.player.x, this.player.y)
    this.pathGfx.lineTo(zone.x, zone.y)
    this.pathGfx.strokePath()

    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y)
    if (dist > ACTIVATE_RADIUS * 1.5) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, zone.x, zone.y)
      const edge = 60
      const cx = this.player.x + Math.cos(angle) * edge
      const cy = this.player.y + Math.sin(angle) * edge
      this.objectiveArrow.setPosition(cx, cy).setRotation(angle + Math.PI / 2).setAlpha(0.9)
    } else {
      this.objectiveArrow.setAlpha(0)
    }
  }

  private tickHud() {
    this.emitHud()
  }

  private emitHud() {
    const obj = this.getCurrentObjective()
    const zone = ZONES.find((z) => z.id === obj)
    const callbacks = this.game.registry.get('callbacks')
    const state: HudState = {
      timeRemaining: Math.max(0, MISSION_DURATION - this.elapsed),
      harvestScore: this.completed.length * POINTS_PER_ZONE,
      completedCount: this.completed.length,
      objectiveText: this.completed.length >= ZONES.length
        ? 'Missão completa!'
        : `Próximo: vá até ${zone?.label ?? '...'}`,
      marketEvent: this.eventIndex > 0
        ? MARKET_EVENTS[(this.eventIndex - 1) % MARKET_EVENTS.length]
        : 'Mercado estável — monitorando',
      canActivate: this.getNearbyZone() !== null,
    }
    callbacks?.onHudUpdate(state)
  }

  private endMission(success: boolean) {
    this.scene.pause()
    const callbacks = this.game.registry.get('callbacks')
    callbacks?.onMissionEnd({
      success,
      harvestScore: this.completed.length * POINTS_PER_ZONE,
      completedCount: this.completed.length,
    })
  }
}
