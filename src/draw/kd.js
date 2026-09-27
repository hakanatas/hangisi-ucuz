/* Shared layout + Nokta helpers for "Hangisi Ucuz?". */
(function (LI) {
  'use strict';
  const { clamp } = LI.E;
  LI.KD = {
    /** positions for 16:9 and 9:16 */
    L(env) {
      return env.V
        ? {
          CX: { x: 0, y: -780, s: 42, w: 980 },
          PR: { x: 0, y: -670, s: 90 },
          TAG: { x: [0, 0], y: [-500, -300], w: 620, h: 150, s: 46 },
          E: { x: 0, y: [-560, -440, -320, -200], s: 46, w: 980 },
          LOW: { x: 0, y: [-180, -90, 0], s: 44, w: 980 },
          BAR: { x0: -440, W: 880, y: [-540, -350], h: 80, s: 34 },
          E4: { x: 0, y: [-660, -570, -480, -390], s: 46, w: 980 },
          GRID: { x: 0, y: -150, cell: 24 },
          SUM: { x: 0, y: [-560, -460, -360, -240], s: 48, w: 980 },
          nx: -360, gy: 560, s: 1.15 }
        : {
          CX: { x: 60, y: -445, s: 48, w: 1300 },
          PR: { x: 60, y: -345, s: 90 },
          TAG: { x: [-170, 430], y: [-160, -160], w: 480, h: 170, s: 48 },
          E: { x: 110, y: [-250, -140, -30, 80], s: 54, w: 1250 },
          LOW: { x: 110, y: [40, 125, 210], s: 50, w: 1250 },
          BAR: { x0: -400, W: 1000, y: [-250, -80], h: 84, s: 38 },
          E4: { x: -170, y: [-250, -140, -30, 80], s: 52, w: 720 },
          GRID: { x: 500, y: -120, cell: 27 },
          SUM: { x: 100, y: [-240, -140, -40, 80], s: 54, w: 1250 },
          nx: -800, gy: 262, s: 1.15 };
    },
    cam(env, o = {}) { return Object.assign({ x: env.V ? 0 : -60, y: env.V ? 60 : 0, zoom: 1, rot: 0, tilt: 1 }, o); },
    /** pupils + face toward a world point */
    look(p, target) {
      const e = LI.Nokta.eyes(p)[0];
      const dx = target[0] - e[0], dy = target[1] - e[1], d = Math.hypot(dx, dy) || 1;
      p.lookX = clamp(dx / d * 1.1, -1, 1); p.lookY = clamp(dy / d * 1.1, -1, 1);
      p.turn = clamp(dx / 900, -0.5, 0.5);
      return p;
    },
    /** a short ground stroke under Nokta */
    ground(ctx, env, x, gy) { LI.Ambient.ground(ctx, x - 360, x + 360, gy + 6, { alpha: 0.32 }); },
  };
})(window.LI = window.LI || {});
