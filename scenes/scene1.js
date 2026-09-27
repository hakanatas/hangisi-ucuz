/* SAHNE 1 — İKİ MAĞAZA (0–10 s)  An 80 TL bag, two offers.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const fr = (n, d, hot) => F().fr(n, d, hot);
  const at = (P, k) => ({ x: P.x, y: P.y[k], s: P.s, w: P.w });
  /** a tick after a centred line */
  function tickAfter(ctx, P, s, t0, t1, t) {
    const f = F(), p = seg(t, t0, t0 + 0.5) * (1 - seg(t, t1 - 0.4, t1)); if (p <= 0) return;
    const w = Math.min(f.width(ctx, s, P.s), P.w); f.tick(ctx, P.x + w / 2 + 26, P.y, seg(t, t0, t0 + 0.5), 1 - seg(t, t1 - 0.4, t1));
  }

  function context(ctx, env, t) {
    const L = KD.L(env);
    exprs(ctx, t, L.CX, [
      [4.4, 10.2, 'Aynı çanta iki mağazada: hangisi daha ucuz?'],
      [10.6, 17.8, 'Önce verilenleri ve istenenleri ayıralım'],
      [18.0, 29.8, 'Şekille gösterelim: 80 TL’yi 4 eşit parçaya bölelim'],
      [30.4, 41.0, 'İşlemle çözelim ve kontrol edelim'],
      [41.2, 45.8, ['%25 indirim = ', fr(1, 4), '’ünü çıkarmak = ', fr(3, 4), '’ünü ödemek'], true],
      [46.4, 59.8, 'Kısa yol: aynı sayının üç gösterimi'],
      [60.4, 64.8, 'Genelleyelim mi? İki kez %25 indirim, %50 indirim mi?'],
      [65.0, 72.8, 'Kontrol: ikinci indirim yeni fiyata, 60 TL’ye uygulanır'],
      [73.0, 79.8, 'İkinci yüzde, yeni fiyatın yüzdesidir', true],
    ]);
    const pa = Math.max(win(t, 4.6, 17.9), win(t, 30.4, 45.8)); if (pa > 0) F().T(ctx, 'Çanta: 80 TL', L.PR.x, L.PR.y, { size: L.PR.s, alpha: pa, halo: true });
  }

  /* ── 0–18 s: two offers; given, asked, a guess ── */
  function offers(ctx, env, t) {
    const L = KD.L(env), G = L.TAG, f = F(), a = win(t, 5.0, 17.8);
    [0, 1].forEach((i) => {
      const k = seg(t, 5.0 + i * 1.2, 5.6 + i * 1.2) * a; if (k <= 0) return;
      f.tag(ctx, G.x[i], G.y[i], G.w, G.h, k);
      f.T(ctx, i ? 'Mağaza B' : 'Mağaza A', G.x[i], G.y[i] - G.h * 0.2, { size: G.s * 0.8, alpha: k });
      f.expr(ctx, i ? ['fiyatın ', fr(3, 4, true), '’ü'] : ['%25 indirim'], G.x[i], G.y[i] + G.h * 0.18, G.s, { alpha: k, color: i ? undefined : A.amber });
    });
    exprs(ctx, t, at(L.LOW, 0), [[11.2, 17.8, 'Verilen: 80 TL, %25 indirim, fiyatın 3/4’ü']]);
    exprs(ctx, t, at(L.LOW, 1), [[12.8, 17.8, 'İstenen: hangi mağazada fiyat daha düşük?', true]]);
    exprs(ctx, t, at(L.LOW, 2), [[14.6, 17.8, 'Tahmin: belki ikisi aynıdır?']]);
  }

  /* ── 18–30 s: the bar model ── */
  function bars(ctx, env, t) {
    const L = KD.L(env), B = L.BAR, f = F(), a = win(t, 18.2, 30.0);
    if (a > 0) {
      f.bar(ctx, B, 0, 80, 1, seg(t, 18.4, 19.4), seg(t, 21.0, 21.8), seg(t, 22.4, 23.2), a, 'A');
      f.bar(ctx, B, 1, 80, 1, seg(t, 23.6, 24.6), 0, seg(t, 25.0, 25.8), a, 'B');
      const u = B.W / 4, la = (row, s, t0, x) => { const g = seg(t, t0, t0 + 0.4) * a; if (g > 0) f.T(ctx, s, x, B.y[row] + B.h / 2 + 34, Object.assign({ size: B.s * 1.1, alpha: g }, f.AMB)); };
      la(0, 'indirim: %25', 21.4, B.x0 + 3.5 * u); la(0, 'ödenen: 60 TL', 22.8, B.x0 + 1.5 * u);
      la(1, ['fiyatın 3/4’ü: 60 TL'][0], 25.4, B.x0 + 1.5 * u);
    }
    exprs(ctx, t, at(L.LOW, 2), [[27.0, 29.8, 'Şekle göre ikisi de 60 TL', true]]);
  }

  /* ── 30–46 s: working and checking ── */
  function working(ctx, env, t) {
    const E = KD.L(env).E;
    exprs(ctx, t, at(E, 0), [[31.0, 45.8, ['A: 80’in %25’i = 80 × ', fr(25, 100), ' = 20']]]);
    exprs(ctx, t, at(E, 1), [[33.4, 45.8, ['80 − 20 = 60 TL']]]);
    exprs(ctx, t, at(E, 2), [[35.8, 45.8, ['B: 80 × ', fr(3, 4), ' = ', fr(240, 4), ' = 60 TL']]]);
    exprs(ctx, t, at(E, 3), [[38.4, 45.8, 'Tahmin doğru: iki mağazada da 60 TL', true]]);
    tickAfter(ctx, at(E, 3), 'Tahmin doğru: iki mağazada da 60 TL', 39.2, 45.8, t);
  }

  /* ── 46–60 s: three forms, one short way ── */
  function shortWay(ctx, env, t) {
    const L = KD.L(env), P = L.E4, f = F(), a = win(t, 46.4, 59.8);
    exprs(ctx, t, at(P, 0), [[47.0, 59.8, [fr(1, 4), ' = 0,25 = %25']]]);
    exprs(ctx, t, at(P, 1), [[48.6, 59.8, [fr(3, 4), ' = 0,75 = %75'], true]]);
    f.grid(ctx, L.GRID, seg(t, 49.4, 50.4), Math.round(75 * seg(t, 50.6, 52.6)), a);
    const ga = seg(t, 52.6, 53.0) * a; if (ga > 0) f.T(ctx, '100 karenin 75’i', L.GRID.x, L.GRID.y + 5.6 * L.GRID.cell + 16, Object.assign({ size: 34, alpha: ga }, f.AMB));
    exprs(ctx, t, at(P, 2), [[53.6, 59.8, '%25 indirim: fiyatın %75’ini ödersin']]);
    exprs(ctx, t, at(P, 3), [[55.6, 59.8, '80 × 0,75 = 60 TL: tek işlem!', true]]);
  }

  /* ── 60–80 s: a generalisation that fails ── */
  function twice(ctx, env, t) {
    const L = KD.L(env), B = L.BAR, f = F(), a = win(t, 62.0, 72.8);
    if (a > 0) {
      f.bar(ctx, B, 0, 80, 1, seg(t, 62.2, 63.0), seg(t, 63.2, 63.8), seg(t, 63.6, 64.2), a, '1.');
      f.bar(ctx, B, 1, 60, 0.75, seg(t, 64.6, 65.4), seg(t, 65.8, 66.4), seg(t, 66.2, 66.8), a, '2.');
    }
    exprs(ctx, t, at(L.LOW, 0), [[61.0, 72.8, 'Tahmin: %25 + %25 = %50, yani 40 TL mi?']]);
    exprs(ctx, t, at(L.LOW, 1), [[67.0, 72.8, '80 × 0,75 = 60,   60 × 0,75 = 45 TL']]);
    exprs(ctx, t, at(L.LOW, 2), [[69.0, 72.8, '45 TL, 40 TL değil: bu genelleme geçersiz', true]]);
    exprs(ctx, t, at(L.E, 1), [[73.4, 79.8, 'Strateji: her indirimi o anki fiyata uygula']]);
    exprs(ctx, t, at(L.E, 2), [[75.0, 79.8, '0,75 × 0,75 = 0,5625: fiyatın %56,25’ini ödersin', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Verilen ne, istenen ne?', 80.6], ['Şekil, tablo ya da diyagramla göster', 81.6], ['Tahmin et, çöz, kontrol et', 82.6], ['%25 indirim = fiyat × 0,75', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.2 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); offers(ctx, env, t); bars(ctx, env, t); working(ctx, env, t); shortWay(ctx, env, t); twice(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Two shops', nameTr: 'İki mağaza', concept: '25% off or 3/4 of the price?', conceptTr: '%25 indirim mi, 3/4’ü mü?', render });
})(window.LI = window.LI || {});
