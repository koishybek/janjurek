"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Instagram, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchDialog } from "@/components/search-dialog-context";

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#guide", label: "Инструкция" },
  { href: "#contacts", label: "Контакты" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.51 5.26l-.999 3.648 3.477-.815zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

export function Hero() {
  const { openDialog } = useSearchDialog();

  return (
    <section className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-[hsl(var(--panel))] text-white">
      {/* ── Background photograph ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero.jpg"
          alt="Силуэт человека с фонарём под звёздным небом"
          fill
          priority
          sizes="100vw"
          className="photo-bw object-cover object-[44%_50%]"
        />
        {/* top + bottom vignette for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75"
          aria-hidden
        />
        {/* right-edge fade so the photo melts seamlessly into the black panel */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black lg:via-transparent"
          aria-hidden
        />
      </div>

      {/* ── Mobile top bar (panel is desktop-only) ── */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 lg:hidden">
        <span className="font-serif text-xl tracking-[0.12em] text-gold">JANJUREK</span>
        <nav className="flex items-center gap-4 text-sm text-white/70">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Layout: photo zone (title) + black side panel ── */}
      <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-[1fr_clamp(300px,31%,440px)]">
        {/* LEFT — centered wordmark above the beam */}
        <div className="relative flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="-mt-32 text-center sm:-mt-40"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
              className="font-sans text-xs font-light tracking-[0.2em] text-white/85 sm:text-sm"
            >
              Мы храним воспоминания
            </motion.p>
            <h1 className="mt-3 font-serif text-6xl font-semibold leading-[0.92] tracking-tight text-gold drop-shadow-[0_6px_44px_rgba(227,194,141,0.28)] sm:text-7xl md:text-8xl">
              JANJUREK
            </h1>
          </motion.div>
        </div>

        {/* RIGHT — solid black panel */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="relative z-10 hidden flex-col bg-[hsl(var(--panel))] px-10 pb-12 pt-9 lg:flex"
        >
          <div className="text-right">
            <span className="font-serif text-2xl tracking-[0.14em] text-gold">JANJUREK</span>
          </div>

          <nav className="mt-16 flex flex-col items-end gap-5">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-sans text-base transition-colors duration-200 hover:text-gold",
                  i === 0 ? "font-semibold text-white" : "text-white/55"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="https://wa.me/77000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-gold hover:text-gold"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти в Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-gold hover:text-gold"
            >
              <Instagram className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </motion.aside>
      </div>

      {/* ── Floating search pill (bottom-right, overlapping the panel edge) ── */}
      <button
        type="button"
        onClick={openDialog}
        aria-label="Открыть поиск"
        className="group absolute bottom-6 right-6 z-30 flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/55 backdrop-blur-md transition hover:bg-white/15 hover:text-white/85 lg:right-8"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Поиск...</span>
      </button>
    </section>
  );
}
