import {
  VW,
  getMaxVW,
  STEP,
  VERTICAL_LINE,
  VH,
  NAMES,
  LEFT,
  BOTTOM,
  RIGHT,
  LEVELS,
  PRIZE_MAP,
} from "./constants.js"
import { enemyPosition } from "./events.js"
import BaseElement from "./BaseElement.js"

class Enemy extends BaseElement {
  constructor({
    y = 0,
    x = 0,
    size = 5,
    name = NAMES.enemy,
    level = LEVELS.l1,
    speed = 100,
    onDied,
    onWin,
    count,
  }) {
    super({ tagName: "span" })

    this._createElement()

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
    const id = `${this._name}_${this._level}_${this._count}`

    this._element.classList.add(this._name)
    this._element.classList.add(this._level)
    this._element.setAttribute("id", id)

    // sizes
    this._element.style.width = `${this._size}px`
    this._element.style.height = `${this._size}px`

    this._step()

    document.addEventListener(`damage-${id}`, this._damage.bind(this))
  }

  _damage ({ detail: { damage, id: enemyId } }) {
    if (!damage) return

    this._health = this._health - (100 * Number(damage))

    if (this._health < 0) {
      this.died()
    }
  }

  _step () {
    requestAnimationFrame(() => {
      this._element.style.top = `${this._y}px`
      this._element.style.left = `${this._x}px`

      this._element.classList.remove(LEFT)
      this._element.classList.remove(BOTTOM)
      this._element.classList.remove(RIGHT)

      this._element.classList.add(this._direction)

      this._element.style.setProperty("--health", `${this._health}%`)

      if (this._health < 50) {
        this._element.classList.add(NAMES.hurt)
      }

      this._element.dispatchEvent(enemyPosition)
    })
  }

  died () {
    this._element.remove()

    if (this.onDied) this.onDied(PRIZE_MAP[this._level])
  }

  win () {
    this._element.remove()

    if (this.onWin) this.onWin()
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
}

export default Enemy
