import { ROOT, ENEMY, NAMES } from "./constants.js"
import { getEnemyDamage } from "./events.js"
import {linear, interpolate, animate, ptInCircle} from "./utils.js"

const BOOM_DELAY = 500
const SIZE = 25

class Bullet {
  constructor({
    toX,
    toY,
    startX,
    startY,
    damage,
    onDied,
    speed = 300,
  }) {
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
    const { width, top, left, height } = this._bullet.getBoundingClientRect()

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

    this._bullet.style.left = x + "px"
    this._bullet.style.top = y + "px"

    if (progress === 1) {
      this._bullet.classList.add(NAMES.boom)

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

            enemy.dispatchEvent(getEnemyDamage(id))
          })
        }
      })

      setTimeout(() => {
        this._died()
      }, BOOM_DELAY)
    }
  }

  _died () {
    this._bullet.remove()

    if (this.onDied) this.onDied()
  }

  _draw () {
    const root = document.querySelector(ROOT)
    const bullet = document.createElement("span")

    bullet.classList.add("bullet")

    bullet.style.top = `${this._startY}px`
    bullet.style.left = `${this._startX}px`

    bullet.style.setProperty("--bullet-start-x", `${this._startX}px`)
    bullet.style.setProperty("--bullet-start-y", `${this._startY}px`)
    bullet.style.setProperty("--bullet-size", `${SIZE}px`)

    this._bullet = bullet

    root.appendChild(bullet)
  }

}

export default Bullet
