/**
 * Extended Euclidean Algorithm returning gcd and Bezout coefficients (s, t) s.t. s*a + t*b = gcd
 * @param {number} a
 * @param {number} b
 * @returns {{gcd: number, s: number, t: number, steps: string[]}}
 */
export function egcd(a, b) {
  let old_r = Math.abs(a)
  let r = Math.abs(b)
  let old_s = 1
  let s = 0
  let old_t = 0
  let t = 1
  const steps = [`Start: a=${a}, b=${b}`]

  while (r !== 0) {
    const q = Math.floor(old_r / r)
    const tmp_r = old_r - q * r
    old_r = r
    r = tmp_r
    const tmp_s = old_s - q * s
    old_s = s
    s = tmp_s
    const tmp_t = old_t - q * t
    old_t = t
    t = tmp_t
    steps.push(`q=${q}, r→${old_r}, s→${old_s}, t→${old_t}`)
  }

  // restore signs for s/t relative to original a,b
  const s_final = a < 0 ? -old_s : old_s
  const t_final = b < 0 ? -old_t : old_t
  steps.push(
    `gcd=${old_r} with Bezout: ${s_final}*(${a}) + ${t_final}*(${b}) = ${old_r}`
  )

  return { gcd: old_r, s: s_final, t: t_final, steps }
}

/**
 * Modular arithmetic helper - returns non-negative remainder
 * @param {number} a
 * @param {number} m
 * @returns {number}
 */
export function mod(a, m) {
  const r = a % m
  return r < 0 ? r + Math.abs(m) : r
}

/**
 * Calculate modular inverse
 * @param {number} a
 * @param {number} m
 * @returns {{inv?: number, detail: string}}
 */
export function invMod(a, m) {
  const { gcd, s } = egcd(a, m)
  if (gcd !== 1) {
    return { detail: `No inverse: gcd(${a}, ${m}) = ${gcd} ≠ 1` }
  }
  return { inv: mod(s, m), detail: `Inverse of ${a} mod ${m} is ${mod(s, m)}` }
}

/**
 * Solve linear congruence ax ≡ b (mod m)
 * @param {number} a
 * @param {number} b
 * @param {number} m
 * @returns {{solvable: boolean, x0?: number, m1?: number, steps: string[]}}
 */
export function solveLinearCongruence(a, b, m) {
  const ea = egcd(a, m)
  const g = ea.gcd
  const step = [...ea.steps]

  if (b % g !== 0) {
    step.push(`Since gcd(${a},${m}) = ${g} ∤ ${b}, no solutions.`)
    return { solvable: false, steps: step }
  }

  // Reduce and use inverse
  const a1 = a / g
  const b1 = b / g
  const m1 = m / g
  const invInfo = invMod(a1, m1)

  if (!invInfo.inv && invInfo.inv !== 0) {
    step.push(invInfo.detail)
    return { solvable: false, steps: step }
  }

  const x0 = mod(invInfo.inv * b1, m1)
  step.push(`Reduce: a'=${a1}, b'=${b1}, m'=${m1}`)
  step.push(invInfo.detail)
  step.push(`One solution: x₀ ≡ ${x0} (mod ${m1}).`)
  step.push(`All solutions: x ≡ ${x0} + ${m1}t (t ∈ ℤ).`)

  return { solvable: true, x0, m1, steps: step }
}

/**
 * Calculate LCM with steps
 * @param {number} a
 * @param {number} b
 * @returns {{lcm: number, steps: string[]}}
 */
export function lcm(a, b) {
  const ea = egcd(a, b)
  const g = ea.gcd
  const L = Math.abs((a / g) * b)
  return {
    lcm: L,
    steps: [
      ...ea.steps,
      `lcm(${a},${b}) = |${a}·${b}|/gcd = ${Math.abs(a * b)}/${g} = ${L}`,
    ],
  }
}

/**
 * Chinese Remainder Theorem for 2 congruences with coprime moduli
 * @param {number} a - x ≡ a (mod m)
 * @param {number} m
 * @param {number} b - x ≡ b (mod k)
 * @param {number} k
 * @returns {{ok: boolean, x?: number, M?: number, steps: string[]}}
 */
export function crt2(a, m, b, k) {
  const ea = egcd(m, k)
  const steps = [...ea.steps]

  if (ea.gcd !== 1) {
    steps.push(
      `m and k not coprime; gcd=${ea.gcd}. Use general CRT (not implemented here).`
    )
    return { ok: false, steps }
  }

  // x = a + m * t, impose a + m t ≡ b (mod k) ⇒ m t ≡ b-a (mod k)
  const rhs = mod(b - a, k)
  const inv = invMod(m, k)

  if (!inv.inv && inv.inv !== 0) {
    steps.push(inv.detail)
    return { ok: false, steps }
  }

  const t = mod(inv.inv * rhs, k)
  const x = a + m * t
  const M = m * k // since coprime, modulus is product

  steps.push(`Solve m·t ≡ (b−a) mod k ⇒ ${m}·t ≡ ${rhs} (mod ${k})`)
  steps.push(`t ≡ ${t} (mod ${k}) ⇒ x = a + m·t = ${x}`)
  steps.push(`General solution: x ≡ ${mod(x, M)} (mod ${M}).`)

  return { ok: true, x: mod(x, M), M, steps }
}

