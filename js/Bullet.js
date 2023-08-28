import { ENEMY, NAMES } from "./constants.js"
import { getEnemyDamage } from "./events.js"
import { linear, interpolate, animate, ptInCircle } from "./utils.js"
import BaseElement from "./BaseElement.js"

const BOOM_DELAY = 500
const SIZE = 25

class Bullet extends BaseElement {
  constructor({
    toX,
    toY,
    startX,
    startY,
    damage,
    onDied,
    speed = 300,
  }) {
    super({ tagName: "span" })

    this._createElement()

    this._toX = toX
    this._toY = toY
    this._startX = startX
    this._startY = startY
    this._speed = speed
    this._damage = damage

    this.onDied = onDied

    this._draw()

    document.addEventListener("animationend", this._died.bind(this))

    animate({
      timing: linear,
      duration: this._speed,
      draw: this._shot.bind(this)
    })
  }

  _getCenter () {
    const { width, top, left, height } = this._element.getBoundingClientRect()

    const centerX = width / 2 + left
    const centerY = height / 2 + top

    return { centerX, centerY }
  }

  _shot (progress) {
    const { x, y } = interpolate(
      { x: this._startX, y: this._startY },
      { x: this._toX, y: this._toY },
      progress,
    )

    this._element.style.left = x + "px"
    this._element.style.top = y + "px"

    if (progress === 1) {
      this._element.classList.add(NAMES.boom)

      requestAnimationFrame(() => {
        const { centerX, centerY } = this._getCenter()

        const enemies = [...document.querySelectorAll(ENEMY)]

        const filteredEnemies = enemies.filter(enemy => {
          const { x, y } = enemy.getBoundingClientRect()
          return ptInCircle([x, y], [centerX, centerY], SIZE) < 0
        })

        if (filteredEnemies.length) {
          filteredEnemies.forEach(enemy => {
            const id = enemy.getAttribute("id")

            document.dispatchEvent(getEnemyDamage(id, this._damage))
          })
        }
      })

      setTimeout(() => {
        this._died()
      }, BOOM_DELAY)
    }
  }

  _died () {
    this._element.remove()

    if (this.onDied) this.onDied()
  }

  _draw () {
    this._element.classList.add("bullet")

    this._element.style.top = `${this._startY}px`
    this._element.style.left = `${this._startX}px`

    this._element.style.setProperty("--bullet-start-x", `${this._startX}px`)
    this._element.style.setProperty("--bullet-start-y", `${this._startY}px`)
    this._element.style.setProperty("--bullet-size", `${SIZE}px`)
  }

}

export default Bullet
