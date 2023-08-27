import { ROOT, TOKENS, TOWER, ROAD, HEADER, LEVELS, NAMES, TOWERS } from "./constants.js"
import Tower from "./Tower.js"

class DragAndDrop {
    constructor({ money }) {
        const root = document.querySelector(ROOT)
        this._money = money

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
                elem.style.background = ''
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
                el.style.border = ''
            })
        }

        if (this._money < TOWERS[LEVELS.l1].coast) this.disableElement(this._towerL1)

        let onBougth = this._onBougth.bind(this)

        if (this._towerL1) {
            this._towerL1.addEventListener("mousedown", (event) => {
                dragging()

                if (this._money < TOWERS[LEVELS.l1].coast) {
                    event.preventDefault()
                    this.disableElement(event.target.parentElement)

                    return
                }

                const fakeTower = document.createElement("div")

                fakeTower.classList.add(NAMES.fakeTower)

                let shiftX = event.clientX - fakeTower.getBoundingClientRect().left - 20
                let shiftY = event.clientY - fakeTower.getBoundingClientRect().top

                root.appendChild(fakeTower)

                moveAt(event.pageX, event.pageY)

                function moveAt(pageX, pageY) {
                    fakeTower.style.left = pageX - shiftX + "px"
                    fakeTower.style.top = pageY - shiftY + "px"
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY)

                    document.body.classList.add("dragging")

                    fakeTower.hidden = true
                    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
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
                        level: LEVELS.l1,
                        covering: TOWERS[LEVELS.l1].covering,
                        damage: TOWERS[LEVELS.l1].damage,
                    })

                    if (onBougth) onBougth(TOWERS[LEVELS.l1].coast)
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
}

export default DragAndDrop
