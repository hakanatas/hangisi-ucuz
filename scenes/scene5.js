/* SAHNE 5 — GENELLEME GEÇERLİ Mİ? (60–80 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 5, start: 60, end: 80, name: 'Does it generalise?', nameTr: 'Genelleme geçerli mi?', concept: 'Two 25% discounts', conceptTr: 'İki kez %25 indirim', render });
})(window.LI = window.LI || {});
