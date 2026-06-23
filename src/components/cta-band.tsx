"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AnimatedText, Magnetic } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";

/**
 * Cinematic final call-to-action band with a slowly drifting aurora of warm
 * gold light. Built with framer-motion; falls still under reduced-motion.
 */
export function CtaBand() {
  const reduce = useReducedMotion();

  const blobs = [
    { className: "left-[8%] top-[12%] h-[28rem] w-[28rem] bg-[#e3c28d]/20", dx: 60, dy: 30, dur: 16 },
    { className: "right-[6%] top-[30%] h-[24rem] w-[24rem] bg-[#c89b5a]/15", dx: -50, dy: -25, dur: 19 },
    { className: "left-[35%] bottom-[5%] h-[22rem] w-[22rem] bg-[#fff0d0]/10", dx: 35, dy: -40, dur: 22 },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808]">
      {/* aurora */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[90px] ${b.className}`}
            animate={
              reduce
                ? undefined
                : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.12, 1] }
            }
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_30%,#080808_85%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 py-24 text-center sm:py-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.34em] text-gold/90"
        >
          <span className="h-px w-7 bg-gold/50" />
          Память — это свет
          <span className="h-px w-7 bg-gold/50" />
        </motion.p>

        <AnimatedText
          as="h2"
          text="Сохраните память навсегда"
          className="font-serif text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-xl text-lg leading-9 text-muted-foreground"
        >
          Создайте страницу памяти о близком человеке — с историей жизни, фотографиями,
          родословной и QR-кодом для родных. Это займёт несколько минут, а останется навсегда.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-2 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Magnetic>
            <Button
              asChild
              className="gap-2 rounded-full bg-gold px-8 py-6 text-base font-semibold text-black hover:bg-gold/90 hover:shadow-[0_0_44px_-8px_rgba(227,194,141,0.75)]"
            >
              <Link href="/create">
                Создать страницу памяти <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Magnetic>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/20 px-8 py-6 text-base text-foreground/90 hover:border-gold/60 hover:text-gold"
          >
            <Link href="/memory/example-moon">Посмотреть пример</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
