"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Search, ChevronDown } from "lucide-react";
import { Starfield } from "@/components/starfield";
import { useSearchDialog } from "@/components/search-dialog-context";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const { openDialog } = useSearchDialog();

  // Beam follows the cursor horizontally with a gentle spring.
  const rawBeam = useMotionValue(0);
  const beam = useSpring(rawBeam, { stiffness: 35, damping: 16, mass: 0.7 });
  const beamX = useTransform(beam, (v) => `${v}px`);
  const beamRot = useTransform(beam, (v) => `${v * 0.03}deg`);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // map cursor across the viewport to a limited horizontal travel
        const offset = (e.clientX / window.innerWidth - 0.5) * 220;
        rawBeam.set(offset);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, [rawBeam]);

  return (
    <section className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-black text-white">
      {/* ── Background photograph (full-bleed, seamless) ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero.jpg"
          alt="Силуэт человека с фонарём под звёздным небом"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_50%]"
          style={{ filter: "grayscale(1) contrast(1.06) brightness(0.78)" }}
        />
      </div>

      {/* ── Extra parallax stars for depth ── */}
      <Starfield className="absolute inset-0 z-[1] opacity-70" />

      {/* ── Interactive light beam + source glow ── */}
      <motion.div className="hero-beam z-[2]" style={{ "--beam-x": beamX, "--beam-rot": beamRot } as never} />
      <motion.div className="hero-beam-source z-[2]" style={{ "--beam-x": beamX } as never} />

      {/* ── Cinematic vignettes for legibility ── */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/55 via-transparent to-black/85" aria-hidden />
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(120%_90%_at_50%_30%,transparent_40%,rgba(0,0,0,0.6)_100%)]" aria-hidden />

      {/* ── Centered content ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="font-sans text-[11px] font-light uppercase tracking-[0.42em] text-white/75 sm:text-xs"
        >
          Мы храним воспоминания
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
          className="text-glow-gold mt-5 font-serif text-6xl font-semibold leading-[0.92] tracking-tight text-gold sm:text-7xl md:text-8xl lg:text-[8.5rem]"
        >
          JANJUREK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-7 max-w-xl text-balance text-sm leading-7 text-white/70 sm:text-base"
        >
          Каждая история — часть нашей вечности. Сохраним память о близких
          и передадим её будущим поколениям.
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={openDialog}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-gold/90 hover:shadow-[0_0_36px_-6px_rgba(227,194,141,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Search className="h-4 w-4" />
            Найти страницу памяти
          </button>
          <Link
            href="/create"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:border-gold/70 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            Создать страницу
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* ── Inline search affordance ── */}
        <motion.button
          type="button"
          onClick={openDialog}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="mt-8 flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-5 py-2.5 text-xs text-white/45 backdrop-blur-md transition hover:border-white/25 hover:text-white/70"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Поиск по имени или фамилии…</span>
          <kbd className="ml-1 rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/40">⌘K</kbd>
        </motion.button>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block text-white/40"
          aria-hidden
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </section>
  );
}
