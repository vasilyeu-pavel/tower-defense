import Spaces from "./Spaces.js"
import Enemy from "./Enemy.js"
import Tower from "./Tower.js"
import { VERTICAL_LINE, ROAD_HEIGHT, MAX_ENEMIES, ENEMY_DELAY } from "./constants.js"

class MainController {
  constructor() {
    this._lifes = 5
    this._money = 0
    this._round = 1

    this.start()

    this._moneyElement = document.querySelector(".header__gold-value")
    this._lifeElement = document.querySelector(".header__health-value")

    this._moneyElement.innerHTML = this._money
    this._lifeElement.innerHTML = this._lifes
  }

  start() {
    new Spaces({})
    new Tower({})

    this._createEnemies()
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

  _setUpRound () {
    this._round = this._round + 1
  }

  _onWin () {
    if (this._lifes === 0) {
      console.log("you lost")

      return
    }
    this._lifes = this._lifes - 1
    this._lifeElement.innerHTML = this._lifes
  }

  _onDied (money) {
    this._money = this._money + money
    this._moneyElement.innerHTML = this._money
  }
}

new MainController()
