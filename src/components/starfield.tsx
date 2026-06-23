"use client";

import { useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/** Deterministic PRNG so server & client render identical stars (no hydration mismatch). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { x: number; y: number; size: number; delay: number; opacity: number };

function buildLayer(seed: number, count: number, maxSize: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 0.5 + rand() * maxSize,
    delay: rand() * 6,
    opacity: 0.4 + rand() * 0.6,
  }));
}

type LayerProps = {
  stars: Star[];
  depth: number; // parallax multiplier (smaller = farther)
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  scrollDepth: ReturnType<typeof useSpring>;
};

function Layer({ stars, depth, mx, my, scrollDepth }: LayerProps) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform([my, scrollDepth], ([m, s]: number[]) => m * depth + s * depth * 6);

  return (
    <motion.div className="star-layer" style={{ x, y }} aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star-twinkle absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,250,240,0.7)`,
          }}
        />
      ))}
    </motion.div>
  );
}

/**
 * Three depth layers of stars that drift subtly with the cursor and scroll,
 * creating a slow sense of cosmic depth behind the hero.
 */
export function Starfield({ className }: { className?: string }) {
  const layers = useMemo(
    () => [
      { stars: buildLayer(101, 70, 1.2), depth: 6 },
      { stars: buildLayer(202, 45, 1.8), depth: 12 },
      { stars: buildLayer(303, 22, 2.6), depth: 22 },
    ],
    []
  );

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawScroll = useMotionValue(0);
  const spring = { stiffness: 40, damping: 18, mass: 0.6 };
  const mx = useSpring(rawX, spring);
  const my = useSpring(rawY, spring);
  const scrollDepth = useSpring(rawScroll, { stiffness: 50, damping: 22 });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        rawX.set(nx);
        rawY.set(ny);
      });
    };
    const onScroll = () => rawScroll.set(window.scrollY / window.innerHeight);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [rawX, rawY, rawScroll]);

  return (
    <div className={className} aria-hidden>
      {layers.map((l, i) => (
        <Layer key={i} stars={l.stars} depth={l.depth} mx={mx} my={my} scrollDepth={scrollDepth} />
      ))}
    </div>
  );
}
