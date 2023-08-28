import { START_MONEY } from "./constants.js"

class BaseGameController {
    constructor () {
        this._lifes = 5
        this._round = 1
        this._money = START_MONEY

        this._moneyElement = document.querySelector(".header__gold-value")
        this._lifeElement = document.querySelector(".header__health-value")

        this._moneyElement.innerHTML = this._money
        this._lifeElement.innerHTML = this._lifes
    }

    _getRound () {
        return `l${this._round}`
    }

    _getLifeCount () {
        return `l${this._lifes}`
    }

    _setUpRound () {
        this._round = this._round + 1
    }

    _spendMoney(value) {
        this._money = this._money - value
        this._moneyElement.innerHTML = this._money
    }

    _riseMoney(value) {
        this._money = this._money + value
        this._moneyElement.innerHTML = this._money
    }

    _spendLife () {
        this._lifes = this._lifes - 1
        this._lifeElement.innerHTML = this._lifes
    }
}

export default BaseGameController
