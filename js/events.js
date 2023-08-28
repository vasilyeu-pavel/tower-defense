export const UPDATE_ENEMY_POSITION = "UPDATE_ENEMY_POSITION"

export const enemyPosition = new Event(UPDATE_ENEMY_POSITION, { bubbles: true })

export const getEnemyDamage = (id, value) => new CustomEvent(`damage-${id}`, {
    detail: { damage: value, id }
})
