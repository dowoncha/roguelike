import { Display, Map, RNG, Scheduler, DIRS, Engine } from 'rot-js'

interface Actor {

}

interface Command {
  execute(actor: Actor): void;
}

class MoveCommand implements Command {
  execute(actor: Actor) {

  }
}

class InputHandler {
  private buttonLeft: Command
  private buttonRight: Command
  private buttonTop: Command
  private buttonBottom: Command

  handleInput(input) {
    // Check if button is pressed
    if (input === 'D') {
      return this.buttonRight
    }

    return null
  }
}

class Player implements Actor {
  x: number
  y: number

  private readonly game: Game

  constructor(game: Game, x: number, y: number) {
    this.game = game
    this.x = x
    this.y = y
  }

  render() {
    this.game.display.draw(this.x, this.y, "@", "#fff", "#000")
  }

  act() {
    this.game.engine.lock()
    const eventHandler = (event: KeyboardEvent) => {
      this.handleEvent(event, this.game.map)
      this.render()

      this.game.renderMap()

      this.game.engine.unlock()
    }

    window.addEventListener('keydown', eventHandler, { once: true })
  }

  handleEvent(event: KeyboardEvent, map: Map) {
    const keyMap = {}
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    const code = event.keyCode

    if (!(code in keyMap)) {
      return
    }

    const diff = DIRS[8][keyMap[code]]
    const newX = this.x + diff[0]
    const newY = this.y + diff[1]

    const newKey = newX + ',' + newY

    // Cannot move in this direction
    if (!(newKey in map)) { return }

    this.x = newX
    this.y = newY
  }
}

interface GameOptions {
  width: number,
  height: number
}

interface GameContext {
  readonly display: Display
  readonly scheduler: any,
  readonly map: Map
}

type Map = { [key: string]: string}

const TILE_DELIMITER = '/'

export class Game {
  options: GameOptions = { width: 40, height: 12 }
  display: Display
  scheduler: any
  map: Map = {}
  player: Player
  engine: Engine

  constructor(options?: Partial<GameOptions>) {
    this.options = { ...this.options, ...options}
  }

  init() {
    this.scheduler = new Scheduler.Simple()

    this.engine = new Engine(this.scheduler)

    this.display = new Display({ width: this.options.width, height: this.options.height })

    document.body.appendChild(this.display.getContainer())

    this.generateMap()

    this.generateBoxes()

    this.createPlayer()

    this.display.getContainer().addEventListener('mousemove', (e) => this.onMouseMove(e))

    this.engine.start()
  }

  onMouseMove(event: MouseEvent) {
    // Get hovered tile
    const position = this.display.eventToPosition(event)

    this.highlightTile(position)
  }

  highlightTile(position: number[]) {
    const key = `${position[0]},${position[1]}`

    const tile = this.map[key]

    if (tile) {
      const parts = tile.split(TILE_DELIMITER)
      const icon = parts[0]
      const fg = parts[1]

      console.log('highlighting', key, tile)

      this.map[key] = this.createTile(icon, fg, '#0f0')
    }
  }

  createTile(icon: string, fg: string, bg: string) {
    return `${icon}${TILE_DELIMITER}${fg}${TILE_DELIMITER}${bg}`
  }

  async run() {
    this.engine.start()
  }

  createPlayer() {
    const freeCells = this.getFreeCells()

    const index = Math.floor(RNG.getUniform() * freeCells.length) 
    const key = freeCells.splice(index, 1)[0]
    const parts = key.split(',')
    const x = parseInt(parts[0])
    const y = parseInt(parts[1])

    this.player = new Player(this, x, y)

    this.scheduler.add(this.player, true)
  }

  renderMap() {
    for (let key in this.map) {
      const parts = key.split(',')
      const x = parseInt(parts[0])
      const y = parseInt(parts[1])

      const tile = this.map[key]
      const tileParts = tile.split(TILE_DELIMITER)
      const icon = tileParts[0]
      const fg = tileParts[1] || '#fff'
      const bg = tileParts[2] || '#000'

      this.display.draw(x, y, icon, fg, bg)
    }
  }

  private generateMap() {
    const digger = new Map.Digger(this.options.width, this.options.height)

    digger.create((x, y, value) => {
      // Do not store walls
      if (value) {
        return
      }

      const key = x + "," + y
      const icon = '.'
      const fg = '#fff'
      const bg = '#000'
      this.map[key] = `${icon}${TILE_DELIMITER}${fg}${TILE_DELIMITER}${bg}`
    })

    this.renderMap()
  }

  private getFreeCells() {
    return Object.entries(this.map).filter(([k,v]) => v[0] === '.').map(([k]) => k)
  }

  private generateBoxes() {
    const freeCells = this.getFreeCells()

    for (let i = 0; i < 10; ++i) {
      const index = Math.floor(RNG.getUniform() * freeCells.length)
      const key = freeCells.splice(index, 1)[0]

      this.map[key] = '*'
    }
  }
}

export function main() {
  const game = new Game({ width: 80, height: 20 })

  game.init()

  // game.run()
}

window.addEventListener('load', main)
