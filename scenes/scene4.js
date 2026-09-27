/* SAHNE 4 — KISA YOL (46–60 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 60, name: 'The short way', nameTr: 'Kısa yol', concept: '1/4 = 0.25 = 25%', conceptTr: '1/4 = 0,25 = %25', render });
})(window.LI = window.LI || {});
