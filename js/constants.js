export const NAMES = {
  root: "root",
  tower: "tower",
  fakeTower: "fake-tower",
  road: "road",
  header: "header",
  enemy: "enemy",
  boom: "boom",
  hurt: "hurt",
}

export const ROOT = `.${NAMES.root}`
export const TOWER = `.${NAMES.tower}`
export const FAKE_TOWER = `.${NAMES.fakeTower}`
export const ROAD = `.${NAMES.road}`
export const HEADER = `.${NAMES.header}`
export const ENEMY = `.${NAMES.enemy}`

export const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
export const VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

export const PERCENTAGE = 0.2 // %
export const VERTICAL_LINE = 100 // px

export const ROAD_HEIGHT = 50

export const STEP = 2

export const getMaxVW = (percentage = PERCENTAGE) => {
  return VW - (VW * percentage)
}

export const MAX_ENEMIES = 1

export const ENEMY_DELAY = 1000

export const TOKENS = {
  danger100: "rgba(255, 0, 0, 1)",
  danger50: "rgba(255, 0, 0, 0.5)",
}

export const START_MONEY = 100

export const LEVELS = {
  l1: "l1",
}

export const TOWERS = {
  [LEVELS.l1]: {
    covering: 50,
    coast: 100,
    damage: 51,
    speed: 100,
  }
}

export const LEFT = "left"
export const BOTTOM = "bottom"
export const RIGHT = "right"
