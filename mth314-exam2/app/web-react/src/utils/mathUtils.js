const clampToInteger = value => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    throw new TypeError('Expected a finite numeric value')
  }
  return Math.trunc(numeric)
}

/**
 * Compute the greatest common divisor (GCD) of two integers using Euclid's algorithm.
 * Supports negative values by normalizing inputs to their absolute values.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number} Greatest common divisor (non-negative integer)
 */
export const gcd = (a, b) => {
  let x = Math.abs(clampToInteger(a))
  let y = Math.abs(clampToInteger(b))

  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new TypeError('gcd expects numeric inputs')
  }

  while (y !== 0) {
    const remainder = x % y
    x = y
    y = Math.abs(remainder)
  }

  return x
}

/**
 * Compute the Extended Euclidean Algorithm.
 * Returns gcd(a, b) along with the Bézout coefficients (x, y) such that ax + by = gcd(a, b).
 *
 * @param {number} a
 * @param {number} b
 * @returns {{gcd: number, x: number, y: number}}
 */
export const extendedGCD = (a, b) => {
  let oldR = clampToInteger(a)
  let r = clampToInteger(b)
  let oldS = 1
  let s = 0
  let oldT = 0
  let t = 1

  while (r !== 0) {
    const quotient = Math.trunc(oldR / r)

    ;[oldR, r] = [r, oldR - quotient * r]
    ;[oldS, s] = [s, oldS - quotient * s]
    ;[oldT, t] = [t, oldT - quotient * t]
  }

  return {
    gcd: Math.abs(oldR),
    x: oldS,
    y: oldT,
  }
}

/**
 * Compute the mathematical modulo of a number.
 * Ensures the result is always in the range [0, modulus).
 *
 * @param {number} value
 * @param {number} modulus
 * @returns {number}
 */
export const mod = (value, modulus) => {
  const n = clampToInteger(value)
  const m = clampToInteger(modulus)

  if (m === 0) {
    throw new RangeError('modulus must be a non-zero integer')
  }

  const result = n % m
  return result >= 0 ? result : result + Math.abs(m)
}

/**
 * Compute the least common multiple (LCM) of two integers.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const lcm = (a, b) => {
  const x = clampToInteger(a)
  const y = clampToInteger(b)

  if (x === 0 || y === 0) {
    return 0
  }

  return Math.abs((x * y) / gcd(x, y))
}

/**
 * Normalize a remainder to a positive representative for modular arithmetic proofs.
 *
 * @param {number} value
 * @param {number} modulus
 * @returns {number}
 */
export const normalizeRemainder = (value, modulus) => mod(value, modulus)

export default {
  gcd,
  extendedGCD,
  mod,
  lcm,
  normalizeRemainder,
}

