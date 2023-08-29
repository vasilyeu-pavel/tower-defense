import { LEVELS, ENEMY, NAMES } from "./constants.js"
import { UPDATE_ENEMY_POSITION } from "./events.js"
import { ptInCircle, throttle } from "./utils.js"
import Bullet from "./Bullet.js"
import BaseElement from "./BaseElement.js"

class Tower extends BaseElement {
  constructor({
    name = NAMES.tower,
    level = LEVELS.t1,
    size = 40,
    left = 390,
    top = 80,
    covering = 100,
    damage = 2,
    speed = 1000,
  }) {
    super({})

    this._createElement()

    this._name = name
    this._level = level
    this._size = size
    this._left = left - covering
    this._top = top - covering
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
    this._element.classList.add(this._name)
    this._element.classList.add(this._level)

    this._element.setAttribute("id", `tower-${Date.now()}`)

    // sizes
    this._element.style.width = `${this._size}px`
    this._element.style.height = `${this._size}px`

    // covering
    this._element.style.padding = `${this._covering}px`

    // position
    this._element.style.left = `${this._left}px`
    this._element.style.top = `${this._top}px`
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
    const { width, top, left, height } = this._element.getBoundingClientRect()

    const centerX = width / 2 + left
    const centerY = height / 2 + top

    return { centerX, centerY }
  }

  _detectEnemies () {
    requestAnimationFrame(() => {
      const { centerX, centerY } = this._getCenter()

      const enemies = [...document.querySelectorAll(ENEMY)]

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
