/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   A bag costs 80 TL: shop A gives 25% off, shop B charges 3/4 of the
   price. Given and asked, a bar model, a guess, the working, a check;
   the short way (× 0,75); and a tempting generalisation that fails.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /** text whose last k characters can glow amber (h: 0..1) */
  function hotTail(ctx, s, x, y, size, k, h, o = {}) {
    const w = width(ctx, s, size), head = s.slice(0, s.length - k), tail = s.slice(s.length - k), wh = width(ctx, head, size);
    const a = o.alpha ?? 1, base = Object.assign({}, o, { size, align: 'left' });
    if (head) T(ctx, head, x - w / 2, y, base);
    if (h < 1) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, { alpha: a * (1 - h) }));
    if (h > 0) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, AMB, { alpha: a * h }));
  }
  /** the big number, digit by digit; hot(i) → 0..1 amber for digit i (spaces skipped) */
  const NUMBER = '2,375';
  function bigNum(ctx, NUM, a, p, hot) {
    if (a <= 0) return;
    const w = width(ctx, NUMBER, NUM.s); let x = NUM.x - w / 2, di = 0;
    [...NUMBER].forEach((ch, j) => {
      const cw = width(ctx, ch, NUM.s);
      if (/[0-9]/.test(ch)) {
        const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2), h = hot(di++);
        if (k > 0) {
          const y = NUM.y - 20 * (1 - outBack(k)) - 10 * h;
          if (h < 1) T(ctx, ch, x + cw / 2, y, { size: NUM.s, alpha: a * k * (1 - h) });
          if (h > 0) T(ctx, ch, x + cw / 2, y, Object.assign({ size: NUM.s * (1 + 0.08 * h), alpha: a * k * h }, AMB));
        }
      }
      else if (ch !== ' ') { const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2); if (k > 0) T(ctx, ch, x + cw / 2, NUM.y, { size: NUM.s, alpha: a * k }); }
      x += cw;
    });
  }
  /* ── fractions and expressions ──────────────────────────── */
  /** width of one expression item (a string, or {n, d} for a fraction) */
  function itemW(ctx, it, s) { return typeof it === 'string' ? width(ctx, it, s) : Math.max(width(ctx, String(it.n), s * 0.72), width(ctx, String(it.d), s * 0.72)) + s * 0.25; }
  /** a row of text and stacked fractions, centred at x */
  function expr(ctx, items, x, y, s, o = {}) {
    const a = o.alpha ?? 1, col = o.color ? { color: o.color } : {};
    let w = items.reduce((u, it) => u + itemW(ctx, it, s), 0);
    const sc = o.w && w > o.w ? o.w / w : 1; s *= sc; w *= sc;
    let cx = x - w / 2;
    items.forEach((it) => {
      const iw = itemW(ctx, it, s);
      if (typeof it === 'string') T(ctx, it, cx, y, Object.assign({ size: s, alpha: a, align: 'left', halo: o.halo }, col));
      else {
        const fc = it.hot ? AMB : col, m = cx + iw / 2;
        T(ctx, String(it.n), m, y - s * 0.42, Object.assign({ size: s * 0.72, alpha: a }, fc));
        ctx.strokeStyle = it.hot ? `rgba(${LI.AMBER_RGB},${a})` : `rgba(${LI.INK_RGB},${0.85 * a})`; ctx.lineWidth = Math.max(2.5, s * 0.055);
        ctx.beginPath(); ctx.moveTo(cx + s * 0.1, y + 2); ctx.lineTo(cx + iw - s * 0.1, y + 2); ctx.stroke();
        T(ctx, String(it.d), m, y + s * 0.46, Object.assign({ size: s * 0.72, alpha: a }, fc));
      }
      cx += iw;
    });
  }
  const fr = (n, d, hot) => ({ n, d, hot });

  /* ── bar model ──────────────────────────────────────────── */
  /** a bar for `total` split into 4 parts; frac: bar length relative to BAR.W;
      off: 0..1 hatches the last part (the discount); paid: 0..1 fills the first three amber */
  function bar(ctx, B, row, total, frac, k, off, paid, a, label) {
    if (a <= 0 || k <= 0) return;
    const y = B.y[row], h = B.h, x0 = B.x0, W = B.W * frac, u = W / 4, w = W * LI.E.outCubic(clamp(k));
    if (paid > 0) { ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.4 * a * paid})`; ctx.fillRect(x0, y - h / 2, 3 * u * clamp(paid * 1.2), h); }
    if (off > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + 3 * u, y - h / 2, u, h); ctx.clip();
      for (let i = -6; i < 12; i++) Ink.path(ctx, [[x0 + 3 * u + i * 16, y + h / 2], [x0 + 3 * u + i * 16 + h, y - h / 2]], { w: 2.5, alpha: a * 0.5 * off, seed: 600 + i, taper: [0, 0] });
      ctx.restore(); }
    Ink.path(ctx, [[x0, y - h / 2], [x0 + w, y - h / 2], [x0 + w, y + h / 2], [x0, y + h / 2], [x0, y - h / 2]], { w: 4, alpha: a, seed: 610 + row, taper: [0, 0], wob: 0.1 });
    for (let i = 1; i < 4; i++) { const x = x0 + i * u; if (x < x0 + w) Ink.path(ctx, [[x, y - h / 2], [x, y + h / 2]], { w: 3, alpha: a * 0.8, seed: 620 + i + row * 5, taper: [0, 0] }); }
    const pk = seg(k, 0.6, 1);
    if (pk > 0) for (let i = 0; i < 4; i++) T(ctx, `${total / 4} TL`, x0 + (i + 0.5) * u, y + 3, { size: B.s, alpha: a * pk });
    if (label) T(ctx, label, x0 - 22, y, { size: B.s * 1.1, alpha: a * clamp(k * 2), align: 'right' });
  }
  /** a price tag card */
  function tag(ctx, x, y, w, h, a) {
    if (a <= 0) return;
    const r = 18, x0 = x - w / 2, y0 = y - h / 2;
    Ink.path(ctx, [[x0 + r, y0], [x0 + w - r, y0], [x0 + w, y0 + r], [x0 + w, y0 + h - r], [x0 + w - r, y0 + h], [x0 + r, y0 + h], [x0, y0 + h - r], [x0, y0 + r], [x0 + r, y0]], { w: 4, alpha: a, seed: 700 + Math.round(x), taper: [0, 0], wob: 0.15 });
    ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.6 * a})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x0 + 26, y0 + 26, 8, 0, Math.PI * 2); ctx.stroke();
  }
  /** a 10 × 10 grid with `n` cells shaded amber */
  function grid(ctx, G, k, n, a) {
    if (a <= 0 || k <= 0) return;
    const c = G.cell, x0 = G.x - 5 * c, y0 = G.y - 5 * c;
    for (let i = 0; i < 100; i++) {
      const g = seg(k, i / 100 * 0.7, i / 100 * 0.7 + 0.3); if (g <= 0) continue;
      const cx = x0 + (i % 10) * c, cy = y0 + Math.floor(i / 10) * c;
      if (i < n) { ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.55 * a * g})`; ctx.fillRect(cx + 2, cy + 2, c - 4, c - 4); }
      ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.45 * a * g})`; ctx.lineWidth = 1.5; ctx.strokeRect(cx + 2, cy + 2, c - 4, c - 4);
    }
  }

  /** an ink (not amber) cross for "not divisible" */
  function crossInk(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, seed: 421, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, seed: 422, taper: [0.1, 0.3] });
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.PR.x, L.PR.y]);
    if (t > 10.4 && t < 18) KD.look(p, [L.LOW.x, L.LOW.y[0]]);
    if ((t > 18 && t < 30) || (t > 62 && t < 72)) KD.look(p, [L.BAR.x0 + L.BAR.W / 2, (L.BAR.y[0] + L.BAR.y[1]) / 2]);
    if (t > 30 && t < 46) KD.look(p, [L.E.x, L.E.y[1]]);
    if (t > 46 && t < 60) KD.look(p, [L.GRID.x, L.GRID.y]);
    if (t > 72 && t < 80) KD.look(p, [L.LOW.x, L.LOW.y[1]]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(12.8, 14.4); pointing(21.0, 22.6); pointing(25.0, 26.6); pointing(35.8, 37.4); pointing(50.6, 52.2); pointing(55.6, 57.2); pointing(67.0, 68.6); pointing(80.6, 82.4);
    const think = seg(t, 14.6, 15.0) * (1 - seg(t, 16.8, 17.1)) + seg(t, 61.0, 61.4) * (1 - seg(t, 63.0, 63.3));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if (t > 69.0 && t < 70.4) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(39.0, 40.6); joy(57.0, 58.6); joy(76.0, 77.6);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 70.0, 70.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, crossInk, expr, fr, bar, tag, grid, nokta, base };
})(window.LI = window.LI || {});
