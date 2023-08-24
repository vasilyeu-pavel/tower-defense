/**
 * @description Check if a pt is in, on or outside of a circle.
 * @param {[float]} pt The point to test. An array of two floats - x and y coordinates.
 * @param {[float]} center The circle center. An array of two floats - x and y coordinates.
 * @param {float} r The circle radius.
 * @returns {-1 | 0 | 1} -1 if the point is inside, 0 if it is on and 1 if it is outside the circle.
 */
export function ptInCircle(pt, center, r) {

  const lhs = Math.pow(center[0] - pt[0], 2) + Math.pow(center[1] - pt[1], 2);
  const rhs = Math.pow(r, 2);

  return lhs < rhs ? -1 : (lhs === rhs ? 0 : 1);
}

export function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

export function animate({ duration, draw, timing }) {
  let start = performance.now()

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) timeFraction = 1

    let progress = timing(timeFraction)

    draw(progress)

    if (timeFraction < 1) {
      requestAnimationFrame(animate)
    }

  });
}

export function linear(timeFraction) {
  return timeFraction
}

export function interpolate(a, b, frac) {
  const nx = a.x + (b.x - a.x) * frac
  const ny = a.y + (b.y - a.y) * frac

  return { x: nx, y: ny }
}
