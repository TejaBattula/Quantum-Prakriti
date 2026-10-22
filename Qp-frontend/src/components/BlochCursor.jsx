import { useEffect, useRef } from "react";

/**
 * 3D Bloch sphere cursor.
 * Usage: render <BlochCursor /> once, near the root of your app (e.g. in App.jsx).
 * Props: size (px, default 96)
 */
export default function BlochCursor({ size = 26 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Skip touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const c = canvasRef.current;
    const g = c.getContext("2d");
    const R = size * 0.4;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const tilt = 0.45;

    c.width = c.height = size * dpr;
    g.scale(dpr, dpr);

    // Pick colors that contrast with the page background (light or dark mode)
    const PALETTES = {
      dark: {
        front: "rgba(180,200,255,.75)",
        back: "rgba(180,200,255,.22)",
        fill: "rgba(255,170,190,.16)",
        outline: "rgba(200,215,255,.9)",
        dot: "#fff",
      },
      light: {
        front: "rgba(30,45,100,.8)",
        back: "rgba(30,45,100,.25)",
        fill: "rgba(255,110,140,.18)",
        outline: "rgba(25,40,95,.95)",
        dot: "#111827",
      },
    };
    const pageIsDark = () => {
      let el = document.body;
      while (el) {
        const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (m && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
          const [r, gr, b] = m.map(Number);
          return 0.299 * r + 0.587 * gr + 0.114 * b < 140;
        }
        el = el.parentElement;
      }
      return false; // browser default is white
    };
    let pal = pageIsDark() ? PALETTES.dark : PALETTES.light;
    const themeTimer = setInterval(() => {
      pal = pageIsDark() ? PALETTES.dark : PALETTES.light;
    }, 500);

    // Hide the system cursor while this component is mounted
    const style = document.createElement("style");
    style.textContent =
      "html.bloch-on, html.bloch-on * { cursor: none !important; }";
    document.head.appendChild(style);
    document.documentElement.classList.add("bloch-on");

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      x = mx,
      y = my;
    let yaw = 0.6,
      spin = 0.01,
      hover = false,
      down = false,
      raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      c.style.opacity = 1;
      hover = !!e.target.closest?.(
        'a, button, [role="button"], input, select, textarea, label'
      );
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const onLeave = () => (c.style.opacity = 0);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    // 3D point -> screen (rotate about vertical axis, then tilt toward viewer)
    const P = (px, py, pz) => {
      const cy = Math.cos(yaw),
        sy = Math.sin(yaw);
      const X = px * cy + pz * sy,
        Z = -px * sy + pz * cy;
      const ct = Math.cos(tilt),
        st = Math.sin(tilt);
      const Y2 = py * ct - Z * st,
        Z2 = py * st + Z * ct;
      return [size / 2 + X * R, size / 2 - Y2 * R, Z2]; // Z2 > 0 faces viewer
    };

    const ring = (fn, n = 64) => {
      let prev = null;
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * Math.PI * 2;
        const p = P(...fn(t));
        if (prev) {
          const front = (p[2] + prev[2]) / 2 > 0;
          g.strokeStyle = front ? pal.front : pal.back;
          g.beginPath();
          g.moveTo(prev[0], prev[1]);
          g.lineTo(p[0], p[1]);
          g.stroke();
        }
        prev = p;
      }
    };

    const arrow = (vec, color, w) => {
      const o = P(0, 0, 0),
        t = P(...vec);
      const a = Math.atan2(t[1] - o[1], t[0] - o[0]),
        h = 7;
      g.strokeStyle = g.fillStyle = color;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(o[0], o[1]);
      g.lineTo(t[0], t[1]);
      g.stroke();
      g.beginPath();
      g.moveTo(t[0], t[1]);
      g.lineTo(t[0] - h * Math.cos(a - 0.4), t[1] - h * Math.sin(a - 0.4));
      g.lineTo(t[0] - h * Math.cos(a + 0.4), t[1] - h * Math.sin(a + 0.4));
      g.closePath();
      g.fill();
    };

    const frame = () => {
      const dx = mx - x,
        dy = my - y;
      x += dx * 0.35;
      y += dy * 0.35; // slight trailing lag
      const speed = Math.hypot(dx, dy);
      const target = reduce ? 0 : 0.008 + Math.min(speed * 0.004, 0.12);
      spin += (target - spin) * 0.1;
      yaw += spin;

      c.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      g.clearRect(0, 0, size, size);

      // sphere body
      g.fillStyle = pal.fill;
      g.beginPath();
      g.arc(size / 2, size / 2, R, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = pal.outline;
      g.lineWidth = 1.2;
      g.beginPath();
      g.arc(size / 2, size / 2, R, 0, Math.PI * 2);
      g.stroke();

      // wireframe: equator, two meridians, two latitude rings
      g.lineWidth = 0.8;
      ring((t) => [Math.cos(t), 0, Math.sin(t)]);
      ring((t) => [Math.cos(t), Math.sin(t), 0]);
      ring((t) => [0, Math.sin(t), Math.cos(t)]);
      for (const lat of [0.5, -0.5]) {
        const r = Math.sqrt(1 - lat * lat);
        ring((t) => [r * Math.cos(t), lat, r * Math.sin(t)]);
      }

      // state vector (red) tips over on hover / click; green is an axis
      const lean = down ? 0.7 : hover ? 0.35 : 0;
      arrow([Math.sin(lean) * 0.95, Math.cos(lean) * 0.95, 0], "#e0483e", 2);
      arrow([0, 0, 0.95], "#35a85a", 2);

      // exact click point
      g.fillStyle = pal.dot;
      g.beginPath();
      g.arc(size / 2, size / 2, 1.6, 0, Math.PI * 2);
      g.fill();

      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(themeTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("bloch-on");
      style.remove();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 2147483647,
        opacity: 0,
        transition: "opacity .2s",
      }}
    />
  );
}
