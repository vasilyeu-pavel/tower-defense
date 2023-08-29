import Road from "./Road.js"
import Enemy from "./Enemy.js"
import {
  VERTICAL_LINE,
  ROAD_HEIGHT,
  LEVELS,
  TOWERS,
  ENEMIES,
  DELAY_BEETWEEN_ROUNDS,
} from "./constants.js"
import DragAndDrop from "./DragAndDrop.js"

class MainController extends DragAndDrop {
  constructor() {
    super()

    new Road({})

    this._enemiesInRound = 0
    this._killedEnemiesInRound = 0

    this._start()
  }

  _start () {
    const round = this._getRound()
    this._enemiesInRound = ENEMIES[round].count

    let i = 0
    const timer = setInterval(() => {
      i = i + 1

      if (i === ENEMIES[round].count + 1) return clearInterval(timer)

      new Enemy({
        y: VERTICAL_LINE + ROAD_HEIGHT - 20,
        size: 33,
        speed: ENEMIES[round].speed,
        onWin: this._onWin.bind(this),
        onDied: this._onDied.bind(this),
        level: round,
        count: i,
      }).move()
    }, ENEMIES[round].delay)
  }

  _onWin () {
    if (this._lifes === 0) {
      throw new Error("You are lost")
    }

    this._spendLife()
  }

  _onBougth (coast) {
    this._spendMoney(coast)

    const lastTower = Object.keys(TOWERS).slice(-1)[0]

    if (this._money < TOWERS[lastTower].coast) {
      this.disableElement()
    }
  }

  _startNewRound () {
    const currentRound = this._round
    const nextRound = currentRound + 1

    if (
        this._enemiesInRound === this._killedEnemiesInRound
        && !!this._getLifeCount()
        && !!LEVELS[this._getRoundFormatter(nextRound)]
    ) {
      this._setUpRound()

      this._killedEnemiesInRound = 0
      this._enemiesInRound = 0

      setTimeout(this._start.bind(this), DELAY_BEETWEEN_ROUNDS)
    }
  }

  _onDied (money) {
    this._riseMoney(money)

    this._killedEnemiesInRound = this._killedEnemiesInRound + 1

    const lastTower = Object.keys(TOWERS).slice(-1)[0]

    if (this._money >= TOWERS[lastTower].coast) {
      this.enableElement()
    }

    this._startNewRound()
  }
}

new MainController()
