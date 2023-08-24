import { ROAD_HEIGHT, VW, VH, getMaxVW, ROOT, VERTICAL_LINE } from "./constants.js"

class Spaces {
  constructor({ name = "road" }) {
    this._name = name
    this._root = document.querySelector(ROOT)

    if (!this._root) throw new Error("root isn't found")

    this._root.style.setProperty("--vertical-offsets", `${VERTICAL_LINE}px`)
    this._root.style.setProperty("--horizontal-offsets", `${VW - getMaxVW()}px`)

    this._drawRoad()
  }

  _verticalRoad (top, i) {
    let left = getMaxVW() - ROAD_HEIGHT

    if (i % 2 === 0) {
      left = VW - getMaxVW() - ROAD_HEIGHT
    }

    const road = document.createElement("div")

    road.classList.add(this._name)

    road.style.height = `${VERTICAL_LINE + (ROAD_HEIGHT / 2)}px`
    road.style.width = `${ROAD_HEIGHT + ROAD_HEIGHT / 2}px`

    road.style.top = `${top + ROAD_HEIGHT}px`
    road.style.left = `${left + (ROAD_HEIGHT / 2)}px`

    this._root.appendChild(road)
  }

  _horizontalRoad (
    top,
    left = (VW - getMaxVW() - (ROAD_HEIGHT / 2)),
    width = (getMaxVW() - (VW - getMaxVW()) + ROAD_HEIGHT),
  ) {
    const road = document.createElement("div")

    road.classList.add(this._name)

    road.style.height = `${ROAD_HEIGHT}px`
    road.style.width = `${width + ROAD_HEIGHT / 2}px`

    road.style.top = `${top}px`
    road.style.left = `${left}px`

    this._root.appendChild(road)
  }

  _drawRoad () {
    new Array(Math.ceil((VH - VERTICAL_LINE) / 150) + 1).fill(0).forEach((_, i) => {
      const top = VERTICAL_LINE * (i + 1)

      this._horizontalRoad(
        top + ROAD_HEIGHT / 2,
        i === 0 ? 0 : undefined,
        i === 0 ? getMaxVW() + (ROAD_HEIGHT / 2) : undefined
      )

      this._verticalRoad(top, i + 1)
    })
  }
}

export default Spaces
