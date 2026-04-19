"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient particle network: drifting dots with lines between near neighbours.
 * Colours pull from the palette (navy → cream accent) and read cleanly through
 * a subtle card blur without competing with foreground content.
 *
 * Perf guards: FPS capped ~45, density scales with viewport area and is halved
 * on coarse pointers, respects prefers-reduced-motion (static field, no drift).
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const c2d = el.getContext("2d");
    if (!c2d) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = c2d;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];
    let raf = 0;
    let last = 0;
    const fpsCap = reduced ? 0 : 60;
    const frameMs = fpsCap > 0 ? 1000 / fpsCap : 0;

    function sizeAndSeed() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = w * h;
      const densityDivisor = coarse ? 28000 : 16000;
      const target = Math.min(110, Math.floor(area / densityDivisor));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        // Flow left→right: base speed with small per-particle variation.
        vx: reduced ? 0 : 0.7 + Math.random() * 1.4,
        vy: reduced ? 0 : (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.1 + 0.7,
        // Hue in the cyan–mint–green band (160°–185°).
        hue: 160 + Math.random() * 25,
      }));
    }

    function draw(ts: number) {
      raf = requestAnimationFrame(draw);
      if (frameMs > 0 && ts - last < frameMs) return;
      last = ts;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Drift: particles move left→right, wrap around at the right edge.
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > w + 20) {
          p.x = -20;
          p.y = Math.random() * h;
        }
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }

      // Links — neon cyan/mint, fade with distance.
      ctx.lineWidth = 1;
      const linkDist = 140;
      const linkDist2 = linkDist * linkDist;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const t = 1 - Math.sqrt(d2) / linkDist;
            const hue = (a.hue + b.hue) / 2;
            ctx.strokeStyle = `hsla(${hue.toFixed(0)}, 80%, 60%, ${(0.22 * t).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots — bright neon centre with soft glow halo.
      for (const p of particles) {
        ctx.fillStyle = `hsla(${p.hue.toFixed(0)}, 85%, 65%, 0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${p.hue.toFixed(0)}, 85%, 65%, 0.12)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    sizeAndSeed();
    raf = requestAnimationFrame(draw);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        sizeAndSeed();
      }, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
