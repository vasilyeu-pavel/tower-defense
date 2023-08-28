import { TOKENS, TOWER, ROAD, HEADER, LEVELS, NAMES, TOWERS, TOWER_SIZE, ROOT } from "./constants.js"
import Tower from "./Tower.js"
import BaseGameController from "./BaseGameController.js"

class DragAndDrop extends BaseGameController {
    constructor() {
        super()
        const root = document.querySelector(ROOT)

        if (!root) throw new Error("root isn't found")

        this._root = root

        this._towerSize = TOWER_SIZE
        this._towerL1 = document.getElementById("preview-tower-l1")

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
        const getRound = this._getRound.bind(this)
        const towerSize = this._towerSize

        if (this._towerL1) {
            if (this._money < TOWERS[LEVELS.l1].coast) this.disableElement(this._towerL1.parentElement)

            this._towerL1.addEventListener("mousedown", (event) => {
                dragging()

                if (this._money < TOWERS[LEVELS.l1].coast) {
                    event.preventDefault()
                    this.disableElement(event.target.parentElement)

                    return
                }

                const fakeTower = document.createElement("div")

                fakeTower.classList.add(NAMES.fakeTower)

                this._root.style.setProperty(
                    "--fake-tower-size",
                    `${(TOWERS[this._getRound()].covering * 2) + this._towerSize}px`
                )

                let shiftX = event.clientX - fakeTower.getBoundingClientRect().left - (this._towerSize / 2)
                let shiftY = event.clientY - fakeTower.getBoundingClientRect().top

                this._root.appendChild(fakeTower)

                moveAt(event.pageX, event.pageY)

                function moveAt(pageX, pageY) {
                    fakeTower.style.left = pageX - shiftX + "px"
                    fakeTower.style.top = pageY - shiftY + "px"
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
                        level: getRound(),
                        covering: TOWERS[getRound()].covering,
                        damage: TOWERS[getRound()].damage,
                        size: towerSize,
                    })

                    if (onBougth) onBougth(TOWERS[getRound()].coast)
                }

                fakeTower.ondragstart = function() {
                    return false
                }
            })
        }
    }

    disableElement (element) {
        if (!element) {
            this._towerL1.parentElement.classList.add("disabled")
        } else {
            element.classList.add("disabled")
        }
    }

    enabletElement (element) {
        if (!element) {
            this._towerL1.parentElement.classList.remove("disabled")
        } else {
            element.classList.remove("disabled")
        }
    }
}

export default DragAndDrop
