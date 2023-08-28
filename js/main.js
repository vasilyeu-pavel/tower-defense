import Road from "./Road.js"
import Enemy from "./Enemy.js"
import {
  VERTICAL_LINE,
  ROAD_HEIGHT,
  MAX_ENEMIES,
  ENEMY_DELAY,
  LEVELS,
  TOWERS,
} from "./constants.js"
import DragAndDrop from "./DragAndDrop.js"

class MainController extends DragAndDrop {
  constructor() {
    super()

    new Road({})

    this._createEnemies()
  }

  _onBougth (coast) {
    this._spendMoney(coast)

    if (this._money < TOWERS[LEVELS.l1].coast) {
      this.disableElement()
    }
  }

  _createEnemies () {
    let i = 0
    const timer = setInterval(() => {
      i = i + 1

      if (i === MAX_ENEMIES + 1) return clearInterval(timer)

      new Enemy({
        y: VERTICAL_LINE + ROAD_HEIGHT - 20,
        size: 33,
        speed: 40,
        onWin: this._onWin.bind(this),
        onDied: this._onDied.bind(this),
        count: i,
      }).move()
    }, ENEMY_DELAY)
  }

  _onWin () {
    if (this._lifes === 0) {
      console.log("you lost")

      return
    }

    this._spendLife()
  }

  _onDied (money) {
    this._riseMoney(money)

    if (this._money >= TOWERS[LEVELS.l1].coast) {
      this.enabletElement()
    }
  }
}

new MainController()
