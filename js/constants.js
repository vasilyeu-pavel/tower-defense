export const ROOT = ".root"

export const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
export const VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

export const PERCENTAGE = 0.2 // %
export const VERTICAL_LINE = 100 // px

export const ROAD_HEIGHT = 50

export const STEP = 2

export const getMaxVW = (percentage = PERCENTAGE) => {
  return VW - (VW * percentage)
}

export const MAX_ENEMIES = 10

export const ENEMY_DELAY = 1000
