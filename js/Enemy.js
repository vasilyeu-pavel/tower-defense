import { VW, getMaxVW, ROOT, STEP, VERTICAL_LINE, VH } from "./constants.js"
import { enemyPosition } from "./events.js"

const LEFT = "left"
const BOTTOM = "bottom"
const RIGHT = "right"

const ENEMY = "enemy"

const damageMap = {
  "l1": 51,
}

const prizeMap = {
  "l1": 50,
}

class Enemy {
  constructor({
    y = 0,
    x = 0,
    size = 5,
    name = ENEMY,
    level = "l1",
    speed = 100,
    onDied,
    onWin,
    count,
  }) {
    this._y = y
    this._x = x
    this._size = size
    this._name = name
    this._speed = speed
    this._direction = RIGHT
    this._health = 100
    this._level = level
    this._count = count

    this.onDied = onDied
    this.onWin = onWin

    this._draw()
  }

  _draw () {
    const root = document.querySelector(ROOT)
    const enemy = document.createElement("span")
    const id = `${this._name}_${this._level}_${this._count}`

    this._enemy = enemy

    enemy.classList.add(this._name)
    enemy.classList.add(this._level)
    enemy.setAttribute("id", id)

    // sizes
    enemy.style.width = `${this._size}px`
    enemy.style.height = `${this._size}px`

    root.appendChild(enemy)

    this._step()

    document.addEventListener(`damage-${id}`, this._damage.bind(this))
  }

  _damage () {
    const damage = damageMap[this._level]
    if (!damage) return
    this._health = this._health - (100 * Number(`0.${damage}`))

    if (this._health < 0) {
      this.died()
    }
  }

  _step () {
    requestAnimationFrame(() => {
      this._enemy.style.top = `${this._y}px`
      this._enemy.style.left = `${this._x}px`

      this._enemy.classList.remove(LEFT)
      this._enemy.classList.remove(BOTTOM)
      this._enemy.classList.remove(RIGHT)

      this._enemy.classList.add(this._direction)

      this._enemy.style.setProperty("--health", `${this._health}%`)

      if (this._health < 50) {
        this._enemy.classList.add("hurt")
      }

      this._enemy.dispatchEvent(enemyPosition)
    })
  }

  died () {
    this._enemy.remove()

    if (this.onDied) this.onDied(prizeMap[this._level])
  }

  win () {
    this._enemy.remove()

    if (this.onWin) {
      this.onWin()
    }
  }

  move() {
    const canStop = (timer) => {
      if (this._y + this._size > VH) {
        clearInterval(timer)

        this.win()

        return true
      }

      return false
    }

    const toLeft = () => {
      const timer = setInterval(() => {
        this._x = this._x - STEP

        if (canStop(timer)) return

        if (this._x < VW - getMaxVW()) {
          clearInterval(timer)
          toBottom(toRight)
        }

        this._direction = LEFT

        this._step()
      }, this._speed)
    }

    const toBottom = (cb) => {
      const start = this._y
      const timer = setInterval(() => {
        this._y = this._y + STEP

        if (canStop(timer)) return

        if (this._y > start + VERTICAL_LINE) {
          clearInterval(timer)

          cb && cb()
        }

        this._direction = BOTTOM

        this._step()
      }, this._speed)
    }

    const toRight = () => {
      const timer = setInterval(() => {
        this._x = this._x + STEP

        if (canStop(timer)) return

        if (this._x > getMaxVW()) {
          clearInterval(timer)
          toBottom(toLeft)
        }

        this._direction = RIGHT

        this._step()
      }, this._speed)
    }

    toRight()
  }

  hurt (damage) {
    this._health = this._health - damage
  }
}

export default Enemy
