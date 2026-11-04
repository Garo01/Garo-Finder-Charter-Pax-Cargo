/**
 * GARO AM4 Core — formulas tested against in-game charter times (2026-11)
 * Flight time: calibrated so CI≈55–58 @ ~5850 km A340+10% → ~07:09–07:11
 */
(function (root) {
  'use strict';

  function kOfDistance(d) {
    if (d < 6000) return 0.0064;
    if (d < 10000) return 0.0032;
    return 0.0048;
  }

  function contributionPaper(d, ci, opts) {
    opts = opts || {};
    const realism = !!opts.realism;
    const kDrop = opts.kDrop != null ? opts.kDrop : 1;
    const kGm = realism ? 1.5 : 1;
    const raw = kGm * kOfDistance(d) * d * (3 - ci / 100);
    const capped = Math.min(raw, 152);
    return { raw: raw, capped: capped, withDrop: kDrop * capped, expected: 0.875 * capped };
  }

  /**
   * In-game speed ratio vs CI (GARO calibration).
   * Published Cathay 0.0035*CI+0.3 yields CI55→~10:45h on A340+10%/5850km — NOT what client shows.
   * Fit: ratio(55)=0.7405, ratio(200)=1 → ratio = 0.642 + 0.00179*CI
   */
  function speedRatio(ci) {
    ci = Math.max(0, Math.min(200, ci == null ? 200 : Number(ci)));
    return Math.max(0.35, Math.min(1.0, 0.642 + 0.00179 * ci));
  }

  function speedWithCI(v, ci) {
    return v * speedRatio(ci);
  }

  function ciForTime(d, v, T) {
    if (T <= 0 || v <= 0 || d <= 0) return 200;
    const ratio = d / (v * T);
    if (ratio >= 1.0) return 200;
    if (ratio <= 0.35) return 0;
    return Math.max(0, Math.min(200, Math.round((ratio - 0.642) / 0.00179)));
  }

  function flightHours(d, v, ci) {
    const vp = speedWithCI(v, ci);
    return vp > 0 ? d / vp : 99;
  }

  /** Paper ratio (docs only) */
  function speedWithCI_paper(v, ci) {
    ci = Math.max(0, Math.min(200, ci == null ? 200 : ci));
    return v * (0.0035 * ci + 0.3);
  }

  function contributionCharter(d, ci, opts) {
    opts = opts || {};
    const cycleIndex = Math.max(1, opts.cycleIndex || 1);
    const n = Math.max(1, opts.nAircraft || opts.n || 10);
    const realism = !!opts.realism;
    const k_gm = realism ? 1.5 : 1.0;
    const paper = contributionPaper(d, ci, opts);
    let base;
    if (cycleIndex === 1) base = 45;
    else if (n >= 10) base = 220;
    else if (n >= 5) base = 115;
    else base = 50;
    const estimate = Math.round(base * k_gm * 10) / 10;
    return {
      paper: paper,
      empiricalPerAc: estimate,
      perAc: estimate,
      baseEasy: base,
      k_gm: k_gm,
      cycleIndex: cycleIndex,
      nAircraft: n,
      realism: realism,
    };
  }

  function contributionCharterProgram(d, ci, cycles, nAircraft, opts) {
    opts = opts || {};
    const cyc = Math.max(1, cycles || 1);
    const n = Math.max(1, nAircraft || 10);
    let total = 0;
    for (let k = 1; k <= cyc; k++) {
      total += contributionCharter(d, ci, Object.assign({}, opts, { cycleIndex: k, nAircraft: n })).empiricalPerAc;
    }
    return {
      perAcProgram: Math.round(total * 10) / 10,
      perAcAvg: Math.round((total / cyc) * 10) / 10,
      cycles: cyc,
      nAircraft: n,
    };
  }

  function ticketsPax(d, mode) {
    mode = mode || 'easy';
    let y, j, f;
    if (mode === 'realism' || mode === 'vip-realism') {
      y = 0.3 * d + 150;
      j = 0.6 * d + 500;
      f = 0.9 * d + 1000;
    } else {
      y = 0.4 * d + 170;
      j = 0.8 * d + 560;
      f = 1.2 * d + 1200;
    }
    const optMul = { y: 1.1, j: 1.08, f: 1.06 };
    return {
      auto: { y: y, j: j, f: f },
      optimal: { y: y * optMul.y, j: j * optMul.j, f: f * optMul.f },
    };
  }

  function ticketsCargo(d, realism) {
    const L = 0.0776321822039374 * d + 85.0567600367807;
    const H = 0.0517742799409248 * d + 24.6369915396414;
    return { auto: { L: L, H: H }, optimal: { L: L * 1.1, H: H * 1.08 } };
  }

  function charterSeats(dy, dj, cap, flights) {
    const f = Math.max(flights || 1, 1);
    const my = Math.floor(dy / f);
    const mj = Math.floor(dj / f);
    const j = Math.min(mj, Math.floor(cap / 2));
    const y = Math.max(0, Math.min(my, cap - 2 * j));
    return { y: y, j: Math.max(0, j), units: y + 2 * j, cap: cap };
  }

  /** Self-test: returns true if A340+10% CI55 @5847km ≈ 7.15h */
  function selfTest() {
    const v = 1003.52 * 1.1;
    const h = flightHours(5847, v, 55);
    const ci = ciForTime(5847, v, 7.15);
    const ok = h > 7.0 && h < 7.3 && ci >= 50 && ci <= 60;
    return { ok: ok, flightHours: h, ciFor715: ci, v: v };
  }

  root.GARO_AM4 = {
    kOfDistance: kOfDistance,
    contributionPaper: contributionPaper,
    contributionCharter: contributionCharter,
    contributionCharterProgram: contributionCharterProgram,
    speedRatio: speedRatio,
    speedWithCI: speedWithCI,
    speedWithCI_paper: speedWithCI_paper,
    ciForTime: ciForTime,
    flightHours: flightHours,
    ticketsPax: ticketsPax,
    ticketsCargo: ticketsCargo,
    charterSeats: charterSeats,
    selfTest: selfTest,
    VERSION: '2026-11-02-ci-game-calibrated',
  };
})(typeof window !== 'undefined' ? window : globalThis);
