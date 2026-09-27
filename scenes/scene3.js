/* SAHNE 3 — ÇÖZ VE KONTROL ET (30–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 30, end: 46, name: 'Solve and check', nameTr: 'Çöz ve kontrol et', concept: 'Both are 60 TL', conceptTr: 'İkisi de 60 TL', render });
})(window.LI = window.LI || {});
