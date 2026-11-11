/* Tiny dependency-free 3D for the portfolio: canvas 2D + perspective projection.
   Scenes.hero(canvas) and Scenes.mount(canvas, kind). Pauses off-screen and
   draws a single still frame when the visitor prefers reduced motion. */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Visitor's "Pause motion" choice (footer). Paused scenes keep their last frame.
  const MOTION_KEY = 'hk-motion';
  let PAUSED = false;
  try { PAUSED = localStorage.getItem(MOTION_KEY) === 'paused'; } catch (e) {}
  const runners = new Set();
  const markRoot = () => { document.documentElement.dataset.motion = PAUSED ? 'paused' : 'on'; };
  markRoot();
  const DARK = { amber: [255, 181, 71], cyan: [90, 209, 230], mint: [126, 224, 176], coral: [255, 122, 102], ink: [236, 233, 226], violet: [185, 156, 255] };
  const LIGHT = { amber: [156, 89, 0], cyan: [8, 120, 145], mint: [16, 130, 80], coral: [210, 64, 40], ink: [22, 23, 26], violet: [100, 72, 205] };
  const C = { ...DARK };
  let light = false, boost = 1;
  function syncTheme() {
    const isLight = document.documentElement.dataset.theme === 'light';
    if (isLight === light && C.amber === (isLight ? LIGHT : DARK).amber) return;
    light = isLight; boost = light ? 1.35 : 1;
    Object.assign(C, light ? LIGHT : DARK);
  }
  const statusDot = (ctx, x, y, col, filled) => { ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 6.28); if (filled) { ctx.fillStyle = col; ctx.fill(); } else { ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke(); } };
  const blend = () => (light ? 'source-over' : 'lighter');
  const rgba = (c, a) => `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${Math.min(1, a * boost)})`;
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // --- value noise -------------------------------------------------------
  const P = new Uint8Array(512);
  (function () { let s = 1337; const p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255]; })();
  const fade = (t) => t * t * (3 - 2 * t);
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const h = (a, b) => P[(P[(a & 255)] + (b & 255)) & 511] / 255;
    const u = fade(xf), v = fade(yf);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
  }
  function fbm(x, y) { let s = 0, a = .5, f = 1; for (let i = 0; i < 4; i++) { s += a * noise(x * f, y * f); f *= 2.03; a *= .5; } return s; }

  // --- camera ------------------------------------------------------------
  function camera(yaw, pitch, scale, cx, cy, dist = 3.2) {
    const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    // pass `out` to write into an existing array instead of allocating one
    return function (x, y, z, out) {
      const x1 = x * cy_ - z * sy, z1 = x * sy + z * cy_;
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      const k = dist / (dist + z2);
      if (out) { out[0] = cx + x1 * k * scale; out[1] = cy - y2 * k * scale; out[2] = k; out[3] = z2; return out; }
      return [cx + x1 * k * scale, cy - y2 * k * scale, k, z2];
    };
  }

  // --- runner ------------------------------------------------------------
  function run(canvas, draw, opts = {}) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, visible = false, raf = 0, last = null, lastMs = opts.still ?? 6000;
    // dt: seconds since the previous frame, so motion runs at the same speed at 30, 60 or 120 Hz
    const state = { mx: 0, my: 0, dragX: 0, dragY: 0, vx: 0, dt: 1 / 60 };
    const still = () => !visible || REDUCED || PAUSED;
    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still()) redraw();
    }
    function frame(ms, dt = 1 / 60) {
      syncTheme();
      lastMs = ms; state.dt = dt;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, ms / 1000, state);
    }
    const redraw = () => frame(lastMs); // the frame on screen now (the still frame until it has played)
    function loop(now) {
      if (still()) return;
      const dt = last == null ? 1 / 60 : Math.min(.1, (now - last) / 1000);
      last = now;
      frame(lastMs + dt * 1000, dt);
      raf = requestAnimationFrame(loop);
    }
    function start() { cancelAnimationFrame(raf); last = null; if (!still()) raf = requestAnimationFrame(loop); }
    runners.add(start);
    new ResizeObserver(resize).observe(canvas);
    document.addEventListener('themechange', () => { if (still()) redraw(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }, { rootMargin: '80px' }).observe(canvas);

    if (opts.interactive) {
      const host = opts.pointerTarget || canvas;
      host.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        state.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        state.my = ((e.clientY - r.top) / r.height) * 2 - 1;
      });
      let down = null;
      canvas.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') { down = [e.clientX, e.clientY, state.dragX, state.dragY]; canvas.setPointerCapture(e.pointerId); } });
      canvas.addEventListener('pointermove', (e) => { if (down) { state.dragX = down[2] + (e.clientX - down[0]) * 0.006; state.dragY = clamp(down[3] + (e.clientY - down[1]) * 0.003, -.35, .45); } });
      const release = () => { down = null; };
      canvas.addEventListener('pointerup', release);
      canvas.addEventListener('pointercancel', release);
      canvas.addEventListener('lostpointercapture', release);
      host.addEventListener('pointermove', () => { if (REDUCED || PAUSED) redraw(); });
    }
    resize();
  }

  // ======================================================================
  // HERO: a living terrain point cloud with a slope "scan" sweeping across
  // ======================================================================
  function hero(canvas) {
    const NX = window.innerWidth < 700 ? 54 : 84, NZ = window.innerWidth < 700 ? 36 : 52, N = NX * NZ;
    // one set of buffers, overwritten every frame (no per-frame allocation)
    const PX = new Float32Array(N), PY = new Float32Array(N), PZ = new Float32Array(N), SL = new Float32Array(N);
    const SX = new Float32Array(N), SY = new Float32Array(N), SK = new Float32Array(N);
    const tmp = [0, 0, 0, 0];
    let yawS = 0, pitchS = 0;
    run(canvas, (ctx, w, h, t, s) => {
      const mobile = w < 900;
      const scale = mobile ? Math.min(w * .42, 200) : Math.min(w * .26, h * .52);
      const cx = mobile ? w * .5 : w * .72, cy = mobile ? Math.min(h * .22, 230) : h * .52;
      const k = 1 - Math.pow(.95, s.dt * 60); // 5% per 60 Hz frame, at any refresh rate
      yawS += ((s.mx * .25 + s.dragX) - yawS) * k;
      pitchS += ((s.my * .12 + s.dragY) - pitchS) * k;
      const yaw = -.55 + Math.sin(t * .07) * .22 + yawS;
      const pitch = .62 + pitchS;
      const cam = camera(yaw, pitch, scale, cx, cy, 5);
      // island-shaped patch: noise terrain under a radial falloff so it reads as an object
      const height = (x, z) => {
        const n = fbm(x * 1.3 + 4 + t * .035, z * 1.3 + 9);
        const ridge = 1 - Math.abs(fbm(x * .8 - 2, z * .8 + t * .02) * 2 - 1);
        const fall = Math.max(0, 1 - (x * x / 2.56 + z * z));
        return (n * 1.1 + ridge * .7) * fall * 1.05 - .55;
      };
      const scanX = ((t * .22) % 1) * 3.6 - 1.8;
      ctx.globalCompositeOperation = blend();
      for (let j = 0; j < NZ; j++) {
        const z = (j / (NZ - 1)) * 2 - 1;
        for (let i = 0; i < NX; i++) {
          const n = j * NX + i, x = (i / (NX - 1)) * 3.2 - 1.6;
          const y = height(x, z), p = cam(x, y, z, tmp);
          PX[n] = x; PY[n] = y; PZ[n] = z;
          SL[n] = Math.abs(height(x + .05, z) - y) + Math.abs(height(x, z + .05) - y);
          SX[n] = p[0]; SY[n] = p[1]; SK[n] = p[2];
        }
      }
      // contour-ish row lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(C.cyan, .07);
      for (let j = 0; j < NZ; j += 2) {
        ctx.beginPath();
        for (let i = 0; i < NX; i++) { const n = j * NX + i; i ? ctx.lineTo(SX[n], SY[n]) : ctx.moveTo(SX[n], SY[n]); }
        ctx.stroke();
      }
      for (let n = 0; n < N; n++) {
        const x = PX[n], y = PY[n], z = PZ[n], slope = SL[n], pk = SK[n];
        const edge = Math.max(0, 1 - (x * x / 2.56 + z * z));
        if (edge <= 0) continue;
        const hgt = clamp((y + .55) / 1.2, 0, 1);
        const near = Math.exp(-Math.pow((x - scanX) * 5, 2));
        const risky = slope > .07;
        let col = mix(C.cyan, C.amber, Math.pow(hgt, 1.3));
        let a = (.3 + hgt * .7) * Math.min(1, edge * 3) * pk;
        if (near > .05 && risky) { col = mix(col, C.coral, near); a += near; }
        else a += near * .3;
        const r = (risky && near > .3 ? 2.6 : 1.7) * pk;
        ctx.fillStyle = rgba(col, clamp(a, 0, 1));
        ctx.fillRect(SX[n] - r / 2, SY[n] - r / 2, r, r);
      }
      ctx.globalCompositeOperation = 'source-over';
    }, { interactive: true, pointerTarget: canvas.parentElement, still: 9000 });
  }

  // ======================================================================
  // PROJECT SCENES
  // ======================================================================
  const scenes = {};

  // SlipSense: wireframe hill, susceptible cells glow, debris flows downhill
  scenes.terrain = function (canvas) {
    const N = 30, H = (x, z) => fbm(x * 1.1 + 3, z * 1.1 + 1) * 1.1 + Math.exp(-(x * x + z * z) * 1.4) * .7 - .75;
    const flows = Array.from({ length: 70 }, () => ({ x: 0, z: 0, life: 0 }));
    const spawn = (f) => { const a = Math.random() * 6.28, r = Math.random() * .35; f.x = Math.cos(a) * r; f.z = Math.sin(a) * r; f.life = 0; f.trail = []; };
    flows.forEach(spawn); flows.forEach((f, i) => (f.life = i * 2));
    run(canvas, (ctx, w, h, t, s) => {
      const f60 = s.dt * 60; // 1 at 60 Hz: steps below are tuned per 60 Hz frame
      const cam = camera(t * .12 + .6, .6, Math.min(w, h) * .44, w / 2, h * .55);
      const grid = [];
      for (let j = 0; j < N; j++) { grid[j] = []; for (let i = 0; i < N; i++) { const x = i / (N - 1) * 2 - 1, z = j / (N - 1) * 2 - 1; const y = H(x, z); grid[j][i] = [x, y, z, cam(x, y, z)]; } }
      // hazard cells
      for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
        const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], d = grid[j + 1][i];
        const slope = Math.abs(b[1] - a[1]) + Math.abs(d[1] - a[1]);
        if (slope < .07) continue;
        const tier = clamp((slope - .07) / .1, 0, 1);
        ctx.fillStyle = rgba(mix(C.amber, C.coral, tier), .05 + tier * .16);
        ctx.beginPath(); ctx.moveTo(a[3][0], a[3][1]); ctx.lineTo(b[3][0], b[3][1]); ctx.lineTo(c[3][0], c[3][1]); ctx.lineTo(d[3][0], d[3][1]); ctx.fill();
      }
      ctx.strokeStyle = rgba(C.cyan, .16); ctx.lineWidth = 1;
      for (let j = 0; j < N; j++) { ctx.beginPath(); for (let i = 0; i < N; i++) { const p = grid[j][i][3]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
      for (let i = 0; i < N; i++) { ctx.beginPath(); for (let j = 0; j < N; j++) { const p = grid[j][i][3]; j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
      // D8-ish runout: step downhill
      for (const f of flows) {
        f.life += f60;
        if (f.life > 140 || Math.abs(f.x) > 1 || Math.abs(f.z) > 1) { spawn(f); continue; }
        const e = .02, y = H(f.x, f.z);
        const gx = (H(f.x + e, f.z) - y) / e, gz = (H(f.x, f.z + e) - y) / e, g = Math.hypot(gx, gz) || 1;
        f.x -= gx / g * .012 * f60; f.z -= gz / g * .012 * f60;
        f.trail.push([f.x, H(f.x, f.z) + .01, f.z]); if (f.trail.length > 18) f.trail.shift();
        ctx.beginPath();
        f.trail.forEach((q, k) => { const p = cam(q[0], q[1], q[2]); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
        ctx.strokeStyle = rgba(C.coral, .55); ctx.lineWidth = 1.4; ctx.stroke();
      }
    });
  };

  // SecureVision: walking pose skeleton on a depth floor with a detection box
  scenes.pose = function (canvas) {
    run(canvas, (ctx, w, h, t) => {
      const cam = camera(Math.sin(t * .25) * .5 + .3, .18, Math.min(w * .5, h * .4), w / 2, h * .56);
      // floor grid (depth)
      ctx.lineWidth = 1;
      for (let i = -6; i <= 6; i++) {
        const a = cam(i * .25, -1, -1.5), b = cam(i * .25, -1, 1.5);
        ctx.strokeStyle = rgba(C.cyan, .08); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        const c = cam(-1.5, -1, i * .25), d = cam(1.5, -1, i * .25);
        ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
      }
      const ph = t * 3.2, sw = Math.sin(ph), bob = Math.abs(Math.cos(ph)) * .03;
      const J = {
        head: [0, .78 + bob, 0], neck: [0, .6 + bob, 0], hip: [0, .05 + bob, 0],
        ls: [-.18, .55 + bob, 0], rs: [.18, .55 + bob, 0],
        le: [-.24, .3 + bob, sw * .18], re: [.24, .3 + bob, -sw * .18],
        lh: [-.26, .06 + bob, sw * .32], rh: [.26, .06 + bob, -sw * .32],
        lp: [-.11, .02 + bob, 0], rp: [.11, .02 + bob, 0],
        lk: [-.12, -.45, -sw * .2], rk: [.12, -.45, sw * .2],
        la: [-.13, -.95, -sw * .38 + .03], ra: [.13, -.95, sw * .38 + .03],
      };
      const P = {}; for (const k in J) P[k] = cam(...J[k]);
      const bones = [['neck', 'hip'], ['ls', 'rs'], ['ls', 'le'], ['le', 'lh'], ['rs', 're'], ['re', 'rh'], ['lp', 'rp'], ['lp', 'lk'], ['lk', 'la'], ['rp', 'rk'], ['rk', 'ra']];
      ctx.lineWidth = 2; ctx.strokeStyle = rgba(C.mint, .9);
      for (const [a, b] of bones) { ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(P.head[0], P.head[1], 10 * P.head[2], 0, 6.28); ctx.stroke();
      for (const k in P) { ctx.fillStyle = rgba(C.amber, 1); ctx.beginPath(); ctx.arc(P[k][0], P[k][1], 2.6, 0, 6.28); ctx.fill(); }
      // bbox
      const xs = Object.values(P).map((p) => p[0]), ys = Object.values(P).map((p) => p[1]);
      const x0 = Math.min(...xs) - 18, x1 = Math.max(...xs) + 18, y0 = Math.min(...ys) - 26, y1 = Math.max(...ys) + 10;
      ctx.strokeStyle = rgba(C.amber, .8); ctx.lineWidth = 1; ctx.setLineDash([5, 4]); ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); ctx.setLineDash([]);
      const conf = (.92 + Math.sin(t * 1.7) * .04).toFixed(2);
      const tag = `person ${conf} · walk`;
      ctx.font = '500 11px "Geist Mono", monospace';
      ctx.fillStyle = rgba(C.amber, 1); ctx.fillRect(x0, y0 - 18, ctx.measureText(tag).width + 12, 18);
      ctx.fillStyle = '#111'; ctx.fillText(tag, x0 + 6, y0 - 5);
      // risk meter
      const risk = (Math.sin(t * .6) * .5 + .5) * .7;
      const mx = 18, my = h - 30, mw = Math.min(180, w * .4);
      ctx.fillStyle = rgba(C.ink, .08); ctx.fillRect(mx, my, mw, 4);
      ctx.fillStyle = rgba(mix(C.mint, C.coral, risk), .9); ctx.fillRect(mx, my, mw * risk, 4);
      ctx.fillStyle = rgba(C.ink, .45); ctx.fillText(`risk ${(risk * 100).toFixed(0)}`, mx, my - 8);
    });
  };

  // Talking Tom: a point-sphere that breathes with a synthetic voice signal
  scenes.orb = function (canvas) {
    const N = 900, pts = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    run(canvas, (ctx, w, h, t) => {
      const cam = camera(t * .3, .25 + Math.sin(t * .2) * .1, Math.min(w, h) * .28, w / 2, h * .46);
      const talk = Math.max(0, Math.sin(t * 1.3)) * (.6 + .4 * Math.sin(t * 9.1) * Math.sin(t * 5.3));
      ctx.globalCompositeOperation = blend();
      for (const [x, y, z] of pts) {
        const d = 1 + talk * .14 * Math.sin(y * 8 + t * 6) * Math.cos(x * 5 - t * 4);
        const p = cam(x * d, y * d, z * d);
        const front = clamp((1 - p[3]) / 2, 0, 1);
        ctx.fillStyle = rgba(mix(C.violet, C.amber, (y + 1) / 2), .15 + front * .7);
        const r = 1 + front * 1.2; ctx.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
      }
      ctx.globalCompositeOperation = 'source-over';
      // waveform
      ctx.beginPath(); const base = h - 34, W = Math.min(w * .7, 320), x0 = (w - W) / 2;
      for (let i = 0; i <= 80; i++) { const x = x0 + (i / 80) * W, env = Math.sin((i / 80) * Math.PI); const y = base + Math.sin(i * .6 + t * 12) * Math.sin(i * .21 - t * 3) * 12 * talk * env; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = rgba(C.amber, .7); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.font = '400 11px "Geist Mono", monospace'; ctx.fillStyle = rgba(C.ink, .4);
      statusDot(ctx, 20, 20, rgba(C.amber, .9), talk > .1); ctx.fillText(talk > .1 ? 'speaking · offline' : 'listening · offline', 30, 24);
    });
  };

  // ML platform: candidates travel the pipeline; only gate-passers get served
  scenes.pipeline = function (canvas) {
    const stages = ['data', 'tune', 'track', 'gate', 'serve'];
    const packets = Array.from({ length: 9 }, (_, i) => ({ u: -i * .22, ok: Math.random() > .4 }));
    run(canvas, (ctx, w, h, t, s) => {
      const cam = camera(-.5 + Math.sin(t * .2) * .15, .42, Math.min(w * .78, h * 1.2) * .4, w / 2, h * .5);
      const path = (u) => [u * 2.6 - 1.3, Math.sin(u * Math.PI * 2) * .12, Math.cos(u * Math.PI) * .25];
      // track
      ctx.beginPath(); for (let i = 0; i <= 60; i++) { const p = cam(...path(i / 60)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.strokeStyle = rgba(C.cyan, .25); ctx.lineWidth = 1; ctx.stroke();
      // stages
      ctx.font = '500 11px "Geist Mono", monospace'; ctx.textAlign = 'center';
      stages.forEach((s, i) => {
        const u = i / (stages.length - 1), q = path(u), p = cam(...q);
        const gate = s === 'gate';
        // 3D box
        const b = .09, c = [[-b, -b, -b], [b, -b, -b], [b, b, -b], [-b, b, -b], [-b, -b, b], [b, -b, b], [b, b, b], [-b, b, b]].map((v) => cam(q[0] + v[0], q[1] + v[1], q[2] + v[2]));
        ctx.strokeStyle = rgba(gate ? C.amber : C.ink, gate ? .9 : .35);
        [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, z]) => { ctx.beginPath(); ctx.moveTo(c[a][0], c[a][1]); ctx.lineTo(c[z][0], c[z][1]); ctx.stroke(); });
        ctx.fillStyle = rgba(gate ? C.amber : C.ink, gate ? .95 : .55);
        ctx.fillText(s, p[0], p[1] + 34 * p[2]);
      });
      ctx.textAlign = 'left';
      // packets
      let served = 0, rejected = 0;
      for (const k of packets) {
        k.u += .0035 * s.dt * 60;
        if (k.u > 1.05) { k.u = -.1; k.ok = Math.random() > .4; }
        if (k.u < 0) continue;
        let q = path(Math.min(k.u, 1)), col = C.cyan;
        if (k.u > .75) { col = k.ok ? C.mint : C.coral; if (!k.ok) { const f = (k.u - .75) * 4; q = [path(.75)[0], q[1] - f * f * .9, q[2] + f * .4]; } }
        if (k.u > .75) k.ok ? served++ : rejected++;
        const p = cam(...q); if (k.ok || k.u < 1) { ctx.fillStyle = rgba(col, .95); ctx.beginPath(); ctx.arc(p[0], p[1], 4 * p[2], 0, 6.28); ctx.fill(); }
      }
      ctx.fillStyle = rgba(C.ink, .45);
      ctx.fillText(`candidate models → only gate-passers reach KServe`, 16, h - 18);
    });
  };

  // RAG: embedding clusters; a query finds its top-k neighbours
  scenes.embeddings = function (canvas) {
    let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const g = () => (rnd() + rnd() + rnd() - 1.5) * .45;
    const centers = [[-.6, .2, .1], [.55, .35, -.3], [.1, -.45, .5], [.5, -.3, -.6]];
    const pts = []; centers.forEach((c, ci) => { for (let i = 0; i < 70; i++) pts.push([c[0] + g(), c[1] + g(), c[2] + g(), ci]); });
    run(canvas, (ctx, w, h, t) => {
      const cam = camera(t * .18, .35, Math.min(w, h) * .55, w / 2, h / 2);
      const cyc = (t * .12) % 1, target = centers[Math.floor(t * .12) % centers.length];
      const q = [target[0] + Math.sin(t) * .12, target[1] + Math.cos(t * .8) * .12, target[2]];
      const qp = cam(...q);
      const near = pts.map((p) => [p, Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])]).sort((a, b) => a[1] - b[1]).slice(0, 5);
      const nearSet = new Set(near.map((n) => n[0]));
      const show = clamp(cyc * 4, 0, 1);
      for (const p of pts) {
        const pp = cam(p[0], p[1], p[2]);
        const isN = nearSet.has(p);
        ctx.fillStyle = isN ? rgba(C.mint, .95) : rgba([C.cyan, C.violet, C.ink, C.cyan][p[3]], .22 + pp[2] * .25);
        const r = (isN ? 3.2 : 1.8) * pp[2]; ctx.beginPath(); ctx.arc(pp[0], pp[1], r, 0, 6.28); ctx.fill();
      }
      ctx.lineWidth = 1;
      near.forEach(([p], i) => { if (i / 5 > show) return; const pp = cam(p[0], p[1], p[2]); ctx.strokeStyle = rgba(C.mint, .55); ctx.beginPath(); ctx.moveTo(qp[0], qp[1]); ctx.lineTo(pp[0], pp[1]); ctx.stroke(); });
      ctx.fillStyle = rgba(C.amber, 1); ctx.beginPath(); ctx.arc(qp[0], qp[1], 5, 0, 6.28); ctx.fill();
      ctx.strokeStyle = rgba(C.amber, .4); ctx.beginPath(); ctx.arc(qp[0], qp[1], 9 + Math.sin(t * 4) * 2, 0, 6.28); ctx.stroke();
      ctx.font = '500 11px "Geist Mono", monospace'; ctx.fillStyle = rgba(C.amber, .95); ctx.fillText('query', qp[0] + 12, qp[1] - 8);
      ctx.fillStyle = rgba(C.ink, .45);
      const step = ['retrieve', 'grade', 'generate', 'grounding ✓'][Math.min(3, Math.floor(cyc * 4))];
      ctx.fillText(`top-5 neighbours · ${step}`, 16, h - 18);
    });
  };

  // Voice HR bot: a ring equaliser in perspective
  scenes.wave = function (canvas) {
    const B = 64;
    run(canvas, (ctx, w, h, t) => {
      const cam = camera(t * .15, .75, Math.min(w, h) * .5, w / 2, h * .56);
      const speaker = Math.floor(t / 3) % 2; // 0 bot, 1 you
      for (let ring = 0; ring < 3; ring++) {
        const R = .45 + ring * .28;
        for (let i = 0; i < B; i++) {
          const a = (i / B) * Math.PI * 2;
          const amp = Math.max(.02, (Math.sin(i * .7 + t * 6 + ring) * Math.sin(i * .23 - t * 2.3) * .5 + .5) * (.35 - ring * .08) * (1 + Math.sin(t * 1.4) * .3));
          const x = Math.cos(a) * R, z = Math.sin(a) * R;
          const p0 = cam(x, -.2, z), p1 = cam(x, -.2 + amp, z);
          ctx.strokeStyle = rgba(speaker ? C.cyan : C.amber, .25 + p0[2] * .35 - ring * .08);
          ctx.lineWidth = 2 * p0[2]; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
        }
      }
      ctx.font = '500 11px "Geist Mono", monospace'; ctx.fillStyle = rgba(speaker ? C.cyan : C.amber, .9);
      statusDot(ctx, 20, h - 22, rgba(speaker ? C.cyan : C.amber, .9), true);
      ctx.fillText(speaker ? 'you, answering' : 'interviewer, asking', 30, h - 18);
    });
  };


  // ---------------------------------------------------------------- open source

  // sktime: out-of-sample forecast breaks on an unsupported index, then works
  scenes.forecast = function (canvas) {
    const N = 48, H = 22; // history points, horizon
    const series = Array.from({ length: N + H }, (_, i) => Math.sin(i * .32) * .32 + Math.sin(i * .11 + 1) * .18 + i * .006 + (noise(i * .7, 3) - .5) * .18);
    run(canvas, (ctx, w, h, t) => {
      const cyc = (t / 9) % 1, fixed = cyc > .5, ph = fixed ? (cyc - .5) * 2 : cyc * 2;
      const cam = camera(-.35 + Math.sin(t * .18) * .12, .28, Math.min(w * .95, h * 1.15) * .4, w / 2, h * .47);
      const X = (i) => (i / (N + H - 1)) * 2.4 - 1.2;
      const font = '500 11px "Geist Mono", monospace';
      // floor ticks = the index
      ctx.lineWidth = 1;
      for (let i = 0; i < N + H; i += 3) {
        const a = cam(X(i), -.62, 0), b = cam(X(i), -.68, 0);
        ctx.strokeStyle = rgba(i < N ? C.ink : (fixed ? C.mint : C.coral), i < N ? .25 : .45);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      const fa = cam(X(0), -.62, 0), fb = cam(X(N + H - 1), -.62, 0);
      ctx.strokeStyle = rgba(C.ink, .18); ctx.beginPath(); ctx.moveTo(fa[0], fa[1]); ctx.lineTo(fb[0], fb[1]); ctx.stroke();
      // history
      ctx.beginPath();
      for (let i = 0; i < N; i++) { const p = cam(X(i), series[i], 0); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.strokeStyle = rgba(C.cyan, .9); ctx.lineWidth = 1.8; ctx.stroke();
      // "now" marker
      const n0 = cam(X(N - 1), .75, 0), n1 = cam(X(N - 1), -.62, 0);
      ctx.setLineDash([3, 4]); ctx.strokeStyle = rgba(C.ink, .3); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(n0[0], n0[1]); ctx.lineTo(n1[0], n1[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = font; ctx.fillStyle = rgba(C.ink, .45); ctx.fillText('training data', cam(X(2), .7, 0)[0], n0[1] + 4);
      ctx.fillText('future', n0[0] + 8, n0[1] + 4);
      const reach = Math.floor(clamp(ph * 1.6, 0, 1) * (H - 1));
      if (!fixed) {
        // forecast starts, then fails at the index
        const stop = Math.min(reach, 4);
        ctx.beginPath();
        for (let k = 0; k <= stop; k++) { const p = cam(X(N - 1 + k), series[N - 1 + k], 0); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(C.amber, .9); ctx.lineWidth = 1.6; ctx.stroke(); ctx.setLineDash([]);
        if (reach >= 4) {
          const p = cam(X(N + 3), series[N + 3], 0), s = 7 + Math.sin(t * 10) * 1.5;
          ctx.strokeStyle = rgba(C.coral, 1); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(p[0] - s, p[1] - s); ctx.lineTo(p[0] + s, p[1] + s); ctx.moveTo(p[0] + s, p[1] - s); ctx.lineTo(p[0] - s, p[1] + s); ctx.stroke();
          ctx.fillStyle = rgba(C.coral, .95); ctx.fillText('unsupported index → predict fails', p[0] - 60, p[1] - 18);
        }
        ctx.fillStyle = rgba(C.coral, .9); ctx.fillText('before · statsmodels 0.15', 16, h - 18);
      } else {
        // confidence cone in depth + forecast
        const up = [], dn = [];
        for (let k = 0; k <= reach; k++) { const i = N - 1 + k, sp = .04 + k * .018; up.push(cam(X(i), series[i] + sp, -sp * .6)); dn.push(cam(X(i), series[i] - sp, sp * .6)); }
        if (up.length > 1) {
          ctx.beginPath(); up.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let k = dn.length - 1; k >= 0; k--) ctx.lineTo(dn[k][0], dn[k][1]);
          ctx.closePath(); ctx.fillStyle = rgba(C.mint, .14); ctx.fill();
        }
        ctx.beginPath();
        for (let k = 0; k <= reach; k++) { const p = cam(X(N - 1 + k), series[N - 1 + k], 0); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = rgba(C.mint, 1); ctx.lineWidth = 1.8; ctx.stroke();
        const tip = cam(X(N - 1 + reach), series[N - 1 + reach], 0);
        ctx.fillStyle = rgba(C.mint, 1); ctx.beginPath(); ctx.arc(tip[0], tip[1], 3, 0, 6.28); ctx.fill();
        ctx.fillStyle = rgba(C.mint, .95); ctx.fillText('after fix · forecast on the original index', 16, h - 18);
      }
    }, { still: 7000 });
  };

  // PyTorch: two Triton builds share a version; a local version tag tells them apart
  scenes.wheels = function (canvas) {
    run(canvas, (ctx, w, h, t) => {
      const cyc = (t / 10) % 1, fixed = cyc > .5, ph = fixed ? (cyc - .5) * 2 : cyc * 2;
      const cam = camera(-.25 + Math.sin(t * .2) * .1, .35, Math.min(w * .3, h * .5), w / 2, h * .48);
      const font = '500 11px "Geist Mono", monospace'; ctx.font = font;
      const box = (cx, cy, cz, bw, bh, bd, col, a) => {
        const v = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(([x, y, z]) => cam(cx + x * bw, cy + y * bh, cz + z * bd));
        ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 1;
        [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([p, q]) => { ctx.beginPath(); ctx.moveTo(v[p][0], v[p][1]); ctx.lineTo(v[q][0], v[q][1]); ctx.stroke(); });
        return cam(cx, cy + bh, cz);
      };
      const wheel = (x, y, z, col, label, below = false, a = 1) => {
        const c = cam(x, y, z), r = 11 * c[2];
        ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(c[0], c[1], r * .45, r, 0, 0, 6.28); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(c[0] + 5 * c[2], c[1], r * .45, r, 0, -1.57, 1.57); ctx.stroke();
        ctx.fillStyle = rgba(col, a); const tw = ctx.measureText(label).width; ctx.fillText(label, c[0] - tw / 2, below ? c[1] + r + 14 : c[1] - r - 6);
      };
      // sources and server
      const s1 = box(-1.0, .45, 0, .16, .12, .12, C.cyan, .7), s2 = box(-1.0, -.45, 0, .16, .12, .12, C.amber, .7);
      const lb1 = cam(-1.0, .27, 0), lb2 = cam(-1.0, -.63, 0);
      ctx.fillStyle = rgba(C.cyan, .85); ctx.fillText('upstream', lb1[0] - 26, lb1[1] + 14);
      ctx.fillStyle = rgba(C.amber, .85); ctx.fillText('PyTorch', lb2[0] - 24, lb2[1] + 28);
      const sv = box(.85, 0, 0, .26, .42, .2, C.ink, .45), svl = cam(.85, -.42, 0);
      ctx.fillStyle = rgba(C.ink, .6); ctx.fillText('download server', svl[0] - 50, svl[1] + 18);
      if (fixed) { // two shelves
        box(.85, .2, 0, .24, .005, .18, C.cyan, .35); box(.85, -.2, 0, .24, .005, .18, C.amber, .35);
      }
      // travelling wheels
      const u = clamp(ph * 1.4, 0, 1), e = u * u * (3 - 2 * u);
      const yA = fixed ? .28 : .06, yB = fixed ? -.12 : .02;
      const ax = -.7 + e * 1.55, ay = .45 + (yA - .45) * e, bx = -.7 + e * 1.55, by = -.45 + (yB + .0 - (-.45)) * e;
      wheel(ax, ay, 0, C.cyan, 'triton 3.x');
      wheel(bx, by, .02, C.amber, fixed ? 'triton 3.x+pt' : 'triton 3.x', !fixed);
      if (u >= 1) {
        const c = cam(.85, .55, 0);
        if (!fixed) {
          const pulse = .5 + Math.sin(t * 8) * .5;
          ctx.fillStyle = rgba(C.coral, .6 + pulse * .4); ctx.font = '600 22px "Geist Mono", monospace'; ctx.fillText('?', c[0] - 6, c[1] - 6); ctx.font = font;
          ctx.fillStyle = rgba(C.coral, .95); ctx.fillText(w < 420 ? 'same version: which is which?' : 'same version: which one is this?', 16, h - 18);
        } else {
          ctx.strokeStyle = rgba(C.mint, 1); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(c[0] - 7, c[1] - 12); ctx.lineTo(c[0] - 2, c[1] - 7); ctx.lineTo(c[0] + 8, c[1] - 18); ctx.stroke(); ctx.lineCap = 'butt';
          ctx.fillStyle = rgba(C.mint, .95); ctx.fillText(w < 420 ? 'proposed: local version tag' : 'proposed: a local version tag keeps them apart', 16, h - 18);
        }
      } else {
        ctx.fillStyle = rgba(C.ink, .45); ctx.fillText(fixed ? 'with a local version' : 'today', 16, h - 18);
      }
    }, { still: 8500 });
  };

  // Default for future PRs: a diff sheet, red lines out, green lines in
  scenes.diff = function (canvas) {
    let s = 3; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const lines = Array.from({ length: 16 }, (_, i) => ({ w: .4 + rnd() * 1.1, ind: Math.floor(rnd() * 3) * .12, kind: i === 5 || i === 6 ? -1 : i === 9 || i === 10 || i === 11 ? 1 : 0 }));
    run(canvas, (ctx, w, h, t) => {
      const cam = camera(-.5 + Math.sin(t * .25) * .15, .5, Math.min(w, h) * .6, w / 2, h * .52);
      const ph = (t / 6) % 1;
      lines.forEach((l, i) => {
        const z = -.9 + i * .12, x0 = -.8 + l.ind;
        let a = .35, col = C.ink, dx = 0;
        if (l.kind < 0) { col = C.coral; a = .9 * (1 - clamp((ph - .3) * 3, 0, 1)); dx = -clamp((ph - .3) * 3, 0, 1) * .3; }
        if (l.kind > 0) { col = C.mint; const k = clamp((ph - .45) * 3, 0, 1); a = .9 * k; dx = (1 - k) * .3; }
        const p = [cam(x0 + dx, 0, z), cam(x0 + dx + l.w, 0, z), cam(x0 + dx + l.w, 0, z + .07), cam(x0 + dx, 0, z + .07)];
        ctx.fillStyle = rgba(col, a * (l.kind ? .5 : .25));
        ctx.beginPath(); p.forEach((q, k) => k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill();
        if (l.kind) { ctx.fillStyle = rgba(col, a); ctx.font = '600 12px "Geist Mono", monospace'; const g = cam(-.95, 0, z + .05); ctx.fillText(l.kind > 0 ? '+' : '−', g[0], g[1]); }
      });
      ctx.font = '500 11px "Geist Mono", monospace'; ctx.fillStyle = rgba(C.ink, .45); ctx.fillText('the change, line by line', 16, h - 18);
    });
  };

  // Contact: dotted globe with a pulse on Malappuram, Kerala and the local time there
  scenes.globe = function (canvas) {
    const N = 1100, pts = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const LAT = 11.05 * Math.PI / 180, LON = 76.07 * Math.PI / 180;
    const home = [Math.cos(LAT) * Math.sin(LON), Math.sin(LAT), -Math.cos(LAT) * Math.cos(LON)];
    const fmt = (() => { try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }); } catch { return null; } })();
    run(canvas, (ctx, w, h, t) => {
      const R = Math.min(w, h) * .36;
      const cam = camera(-LON + Math.sin(t * .15) * .35, .2, R, w / 2, h * .48, 4);
      ctx.globalCompositeOperation = blend();
      for (const [x, y, z] of pts) {
        const p = cam(x, y, z); const front = clamp(-p[3] * 1.2 + .3, 0, 1);
        ctx.fillStyle = rgba(C.cyan, .1 + front * .6);
        const r = .8 + front; ctx.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
      }
      ctx.globalCompositeOperation = 'source-over';
      const m = cam(...home);
      if (m[3] < .2) {
        const k = (t * .8) % 1;
        ctx.strokeStyle = rgba(C.amber, 1 - k); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(m[0], m[1], 4 + k * 22, 0, 6.28); ctx.stroke();
        ctx.fillStyle = rgba(C.amber, 1); ctx.beginPath(); ctx.arc(m[0], m[1], 4, 0, 6.28); ctx.fill();
        ctx.font = '500 11px "Geist Mono", monospace';
        const l1 = 'Malappuram, Kerala', l2 = fmt ? `${fmt.format(new Date())} IST` : 'IST · UTC+5:30';
        const lw = ctx.measureText(l1).width, lx = m[0] + 12 + lw > w - 8 ? m[0] - 12 - lw : m[0] + 12;
        ctx.fillText(l1, lx, m[1] - 4);
        ctx.fillStyle = rgba(C.ink, .55); ctx.fillText(l2, lx, m[1] + 12);
      }
    }, { still: 2000 });
  };

  window.Scenes = {
    hero,
    mount(canvas, kind) { (scenes[kind] || scenes.orb)(canvas); },
    get paused() { return PAUSED; },
    reduced: REDUCED,
    setPaused(v) {
      PAUSED = !!v;
      try { PAUSED ? localStorage.setItem(MOTION_KEY, 'paused') : localStorage.removeItem(MOTION_KEY); } catch (e) {}
      markRoot();
      runners.forEach((start) => start()); // stops loops (last frame stays) or resumes from it
    },
  };
})();
