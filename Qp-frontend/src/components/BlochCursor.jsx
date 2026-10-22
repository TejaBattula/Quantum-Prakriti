
import { useEffect, useRef } from "react";

/**
 * 3D Bloch sphere cursor.
 *
 * Usage:
 * Place <BlochCursor /> inside the div where the effect should work.
 *
 * Example:
 * <div className="my-target-box">
 *   <BlochCursor />
 *   Your content
 * </div>
 *
 * Props:
 * size: cursor size in pixels (default 26)
 */

export default function BlochCursor({ size = 26 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Skip touch devices
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const c = canvasRef.current;
    if (!c) return;

    // The parent div controls the cursor area
    const container = c.parentElement;
    if (!container) return;

    const g = c.getContext("2d");
    if (!g) return;

    const R = size * 0.4;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const tilt = 0.45;

    c.width = size * dpr;
    c.height = size * dpr;

    g.scale(dpr, dpr);

    // Colors for dark and light themes
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
      let el = container;

      while (el) {
        const bg = getComputedStyle(el).backgroundColor;
        const m = bg.match(/[\d.]+/g);

        if (m && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
          const [r, gr, b] = m.map(Number);

          return (
            0.299 * r +
            0.587 * gr +
            0.114 * b
          ) < 140;
        }

        el = el.parentElement;
      }

      return false;
    };

    let pal = pageIsDark() ? PALETTES.dark : PALETTES.light;

    const themeTimer = setInterval(() => {
      pal = pageIsDark() ? PALETTES.dark : PALETTES.light;
    }, 500);

    // Hide the normal cursor only inside the target container
    const style = document.createElement("style");

    style.textContent = `
      .bloch-cursor-active,
      .bloch-cursor-active * {
        cursor: none !important;
      }
    `;

    document.head.appendChild(style);

    // Mouse and animation state
    let mx = 0;
    let my = 0;

    let x = 0;
    let y = 0;

    let yaw = 0.6;
    let spin = 0.01;

    let hover = false;
    let down = false;
    let raf = 0;
    let active = false;

    const INTERACTIVE_SELECTOR =
      'a, button, [role="button"], input, select, textarea, label';

    // Activate only inside the parent div
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;

      if (!active) {
        active = true;
        x = mx;
        y = my;
      }

      c.style.opacity = "1";

      hover = !!e.target.closest?.(INTERACTIVE_SELECTOR);

      container.classList.add("bloch-cursor-active");
    };

    const onLeave = () => {
      active = false;
      hover = false;
      down = false;

      c.style.opacity = "0";

      container.classList.remove("bloch-cursor-active");
    };

    const onDown = () => {
      if (active) {
        down = true;
      }
    };

    const onUp = () => {
      down = false;
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // 3D point projection
    const P = (px, py, pz) => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);

      const X = px * cy + pz * sy;
      const Z = -px * sy + pz * cy;

      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      const Y2 = py * ct - Z * st;
      const Z2 = py * st + Z * ct;

      return [
        size / 2 + X * R,
        size / 2 - Y2 * R,
        Z2,
      ];
    };

    // Draw sphere wireframe rings
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

    // Draw vector arrows
    const arrow = (vec, color, w) => {
      const o = P(0, 0, 0);
      const t = P(...vec);

      const a = Math.atan2(
        t[1] - o[1],
        t[0] - o[0]
      );

      const h = 7;

      g.strokeStyle = color;
      g.fillStyle = color;
      g.lineWidth = w;

      g.beginPath();
      g.moveTo(o[0], o[1]);
      g.lineTo(t[0], t[1]);
      g.stroke();

      g.beginPath();

      g.moveTo(t[0], t[1]);

      g.lineTo(
        t[0] - h * Math.cos(a - 0.4),
        t[1] - h * Math.sin(a - 0.4)
      );

      g.lineTo(
        t[0] - h * Math.cos(a + 0.4),
        t[1] - h * Math.sin(a + 0.4)
      );

      g.closePath();
      g.fill();
    };

    // Main animation loop
    const frame = () => {
      if (active) {
        const dx = mx - x;
        const dy = my - y;

        // Smooth trailing movement
        x += dx * 0.35;
        y += dy * 0.35;

        const speed = Math.hypot(dx, dy);

        const target = reduce
          ? 0
          : 0.008 + Math.min(speed * 0.004, 0.12);

        spin += (target - spin) * 0.1;
        yaw += spin;

        c.style.transform = `
          translate(${x - size / 2}px, ${y - size / 2}px)
        `;

        g.clearRect(0, 0, size, size);

        // Sphere body
        g.fillStyle = pal.fill;

        g.beginPath();
        g.arc(size / 2, size / 2, R, 0, Math.PI * 2);
        g.fill();

        g.strokeStyle = pal.outline;
        g.lineWidth = 1.2;

        g.beginPath();
        g.arc(size / 2, size / 2, R, 0, Math.PI * 2);
        g.stroke();

        // Wireframe: equator and meridians
        g.lineWidth = 0.8;

        ring((t) => [
          Math.cos(t),
          0,
          Math.sin(t),
        ]);

        ring((t) => [
          Math.cos(t),
          Math.sin(t),
          0,
        ]);

        ring((t) => [
          0,
          Math.sin(t),
          Math.cos(t),
        ]);

        // Latitude rings
        for (const lat of [0.5, -0.5]) {
          const r = Math.sqrt(1 - lat * lat);

          ring((t) => [
            r * Math.cos(t),
            lat,
            r * Math.sin(t),
          ]);
        }

        // State vector responds to hover and clicks
        const lean = down ? 0.7 : hover ? 0.35 : 0;

        arrow(
          [
            Math.sin(lean) * 0.95,
            Math.cos(lean) * 0.95,
            0,
          ],
          "#e0483e",
          2
        );

        // Green axis
        arrow(
          [0, 0, 0.95],
          "#35a85a",
          2
        );

        // Center point
        g.fillStyle = pal.dot;

        g.beginPath();
        g.arc(size / 2, size / 2, 1.6, 0, Math.PI * 2);
        g.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    frame();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(themeTimer);

      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);

      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);

      container.classList.remove("bloch-cursor-active");

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
