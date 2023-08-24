import { ROOT } from "./constants.js"
import { UPDATE_ENEMY_POSITION } from "./events.js"
import { ptInCircle, throttle } from "./utils.js"
import Bullet from "./Bullet.js"

class Tower {
  constructor({
    name = "tower",
    level = "l1",
    size = 40,
    left = 390,
    top = 80,
    covering = 100,
    damage = 2,
    speed = 1000,
  }) {
    this._name = name
    this._level = level
    this._size = size
    this._left = left
    this._top = top
    this._covering = covering
    this._damage = damage
    this._speed = speed


    this._draw()

    document.addEventListener(
      UPDATE_ENEMY_POSITION,
      throttle(this._detectEnemies.bind(this), this._speed),
    )
  }

  _draw () {
    const root = document.querySelector(ROOT)
    const tower = document.createElement("div")

    this._tower = tower

    tower.classList.add(this._name)
    tower.classList.add(this._level)

    // sizes
    tower.style.width = `${this._size}px`
    tower.style.height = `${this._size}px`

    // covering
    tower.style.padding = `${this._covering}px`

    // position
    tower.style.left = `${this._left}px`
    tower.style.top = `${this._top}px`

    root.appendChild(tower)
  }

  _shot ({ x, y }) {
    const { centerX, centerY } = this._getCenter()

    new Bullet({
      toX: x,
      toY: y,
      startX: centerX,
      startY: centerY,
      damage: this._damage,
      speed: 100,
    })
  }

  _getCenter () {
    const { width, top, left, height } = this._tower.getBoundingClientRect()

    const centerX = width / 2 + left
    const centerY = height / 2 + top

    return { centerX, centerY }
  }

  _detectEnemies () {
    requestAnimationFrame(() => {
      const { centerX, centerY } = this._getCenter()

      const enemies = [...document.querySelectorAll(".enemy")]

      const filteredEnemies = enemies.filter(enemy => {
        const { x, y } = enemy.getBoundingClientRect()
        return ptInCircle([x, y], [centerX, centerY], this._covering) < 0
      })

      if (filteredEnemies.length) {
        const enemy = filteredEnemies[0]
        const { x, y } = enemy.getBoundingClientRect()

        this._shot({ x, y })
      }
    })
  }
}

export default Tower
