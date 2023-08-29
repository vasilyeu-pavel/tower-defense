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

export const DELAY_BEETWEEN_ROUNDS = 3000

export const getMaxVW = (percentage = PERCENTAGE) => {
  return VW - (VW * percentage)
}

export const TOKENS = {
  danger100: "rgba(255, 0, 0, 1)",
  danger50: "rgba(255, 0, 0, 0.5)",
}

export const START_MONEY = 100

export const LEVELS = {
  l1: "l1",
  l2: "l2",
}

export const TOWERS = {
  t1: {
    covering: 50,
    coast: 50,
    damage: 0.21, // %
    speed: 100,
  },
  t2: {
    covering: 50,
    coast: 100,
    damage: 0.31, // %
    speed: 80,
  },
  t3: {
    covering: 50,
    coast: 150,
    damage: 0.41, // %
    speed: 80,
  },
  t4: {
    covering: 50,
    coast: 200,
    damage: 0.51, // %
    speed: 80,
  },
  t5: {
    covering: 50,
    coast: 250,
    damage: 0.61, // %
    speed: 80,
  },
  t6: {
    covering: 50,
    coast: 300,
    damage: 0.71, // %
    speed: 80,
  },
}

export const ENEMIES = {
  [LEVELS.l1]: {
    health: 100, // %
    count: 8,
    delay: 1000,
    speed: 40,
  },
  [LEVELS.l2]: {
    health: 110, // %
    count: 12,
    delay: 1000,
    speed: 40,
  },
}

export const PRIZE_MAP = {
  [LEVELS.l1]: 50,
  [LEVELS.l2]: 60,
}

export const LEFT = "left"
export const BOTTOM = "bottom"
export const RIGHT = "right"

export const TOWER_SIZE=  40
