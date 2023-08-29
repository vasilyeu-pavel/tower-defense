import {
  TOKENS,
  TOWER,
  ROAD,
  HEADER,
  NAMES,
  TOWERS,
  TOWER_SIZE,
  ROOT,
} from "./constants.js"
import Tower from "./Tower.js"
import BaseGameController from "./BaseGameController.js"

class DragAndDrop extends BaseGameController {
    constructor() {
        super()
        const root = document.querySelector(ROOT)

        if (!root) throw new Error("root isn't found")

        this._root = root

        this._towerSize = TOWER_SIZE

        Object.keys(TOWERS).forEach(towerId => {
            this[`_${towerId}`] = document.getElementById(`preview-tower-${towerId}`)

            this[`_${towerId}`].parentElement.querySelector("span").innerHTML = `${TOWERS[towerId].coast}$`

            let currentDroppable = null
            let isAllowDrop = true

            function enterUnDroppable() {
                isAllowDrop = false
                const roads = document.querySelectorAll(ROAD)

                roads.forEach((elem) => {
                    elem.style.background = TOKENS.danger100
                })
            }

            function leaveUnDroppable() {
                isAllowDrop = true
                const roads = document.querySelectorAll(ROAD)

                roads.forEach((elem) => {
                    elem.style.background = ""
                })
            }

            function dragging () {
                const towers = document.querySelectorAll(TOWER)
                document.body.classList.add("dragging")

                towers.forEach(el => {
                    el.style.border = `1px dashed ${TOKENS.danger50}`
                })
            }

            function removeDragging () {
                const towers = document.querySelectorAll(TOWER)
                document.body.classList.remove("dragging")

                towers.forEach(el => {
                    el.style.border = ""
                })
            }

            const onBougth = this._onBougth.bind(this)
            const towerSize = this._towerSize

            if (this[`_${towerId}`]) {
                if (this._money < TOWERS[towerId].coast) this.disableElement(this[`_${towerId}`].parentElement)

                this[`_${towerId}`].addEventListener("mousedown", (event) => {
                    dragging()

                    if (this._money < TOWERS[towerId].coast) {
                        event.preventDefault()
                        this.disableElement(event.target.parentElement)

                        return
                    }

                    const { x: startX, y: startY } = this[`_${towerId}`].getBoundingClientRect()
                    const shift = (this._towerSize / 2)
                    const fakeTower = document.createElement("div")

                    fakeTower.classList.add(NAMES.fakeTower)
                    fakeTower.classList.add(towerId)

                    fakeTower.style.top = startY + "px"
                    fakeTower.style.left = startX + "px"

                    this._root.style.setProperty(
                        "--fake-tower-size",
                        `${(TOWERS[towerId].covering * 2) + this._towerSize}px`
                    )

                    this._root.appendChild(fakeTower)

                    moveAt(event.pageX, event.pageY)

                    function moveAt(pageX, pageY) {
                        fakeTower.style.left = pageX - shift + "px"
                        fakeTower.style.top = pageY - shift + "px"
                    }

                    function onMouseMove(event) {
                        moveAt(event.pageX, event.pageY)

                        document.body.classList.add("dragging")

                        fakeTower.hidden = true
                        let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
                        fakeTower.hidden = false

                        // mousemove events may trigger out of the window (when the ball is dragged off-screen)
                        if (!elemBelow) return

                        let droppableBelow = elemBelow.closest(`${ROAD}, ${TOWER}, ${HEADER}, .header__towers`)

                        if (currentDroppable !== droppableBelow) {
                            if (currentDroppable) {
                                leaveUnDroppable(currentDroppable)
                            }

                            currentDroppable = droppableBelow

                            if (currentDroppable) {
                                enterUnDroppable(currentDroppable)
                            }
                        }
                    }

                    // move the ball on mousemove
                    document.addEventListener("mousemove", onMouseMove)

                    // drop the ball, remove unneeded handlers
                    fakeTower.onmouseup = function(e) {
                        if (!isAllowDrop) return

                        const { x, y } = e.target.getBoundingClientRect()

                        document.removeEventListener("mousemove", onMouseMove)
                        document.body.classList.remove("dragging")
                        fakeTower.onmouseup = null

                        removeDragging()
                        fakeTower.remove()

                        new Tower({
                            left: x,
                            top: y,
                            level: towerId,
                            covering: TOWERS[towerId].covering,
                            damage: TOWERS[towerId].damage,
                            size: towerSize,
                        })

                        if (onBougth) onBougth(TOWERS[towerId].coast)
                    }

                    fakeTower.ondragstart = function() {
                        return false
                    }
                })
            }
        })
    }

    disableElement (element) {
        if (!element) {
            Object.keys(TOWERS).forEach(towerId => {
                const tower = document.getElementById(`preview-tower-${towerId}`)
                const minPrice = Number(tower.parentElement.querySelector("span").innerText.replace("$", ""))

                if (tower && this._money < minPrice) {
                    tower.parentElement.classList.add("disabled")
                }
            })
        } else {
            element.classList.add("disabled")
        }
    }

    enableElement (element) {
        if (!element) {
            Object.keys(TOWERS).forEach(towerId => {
                const tower = document.getElementById(`preview-tower-${towerId}`)
                const minPrice = Number(tower.parentElement.querySelector("span").innerText.replace("$", ""))

                if (tower && this._money >= minPrice) {
                    tower.parentElement.classList.remove("disabled")
                }
            })
        } else {
            element.classList.remove("disabled")
        }
    }
}

export default DragAndDrop
