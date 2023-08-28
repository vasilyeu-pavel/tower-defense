import { ROOT } from "./constants.js"

class BaseElement {
    constructor({ tagName = "div" }) {
        this._tagName= tagName
        const root = document.querySelector(ROOT)

        if (!root) throw new Error("root isn't found")

        this._root = root
    }

    _createElement() {
        this._element = document.createElement(this._tagName)
        this._root.appendChild(this._element)
    }
}

export default BaseElement
