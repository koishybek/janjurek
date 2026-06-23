"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Instagram, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchDialog } from "@/components/search-dialog-context";

const links = [
  { href: "/#about", label: "О проекте" },
  { href: "/#jeti-ata", label: "Жеті ата" },
  { href: "/#guide", label: "Инструкция" },
  { href: "/#contacts", label: "Контакты" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.51 5.26l-.999 3.648 3.477-.815zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

/**
 * Persistent top navigation. Transparent while it floats over the hero,
 * then fades to a solid blurred bar once the user scrolls past the fold.
 */
export function SiteHeader() {
  const { openDialog } = useSearchDialog();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-white/10 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.16em] text-gold transition hover:text-gold/80"
        >
          JANJUREK
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-gold",
                scrolled ? "text-muted-foreground" : "text-white/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDialog}
            aria-label="Открыть поиск"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border transition",
              scrolled
                ? "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
                : "border-white/20 text-white/75 hover:border-gold hover:text-gold"
            )}
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="https://wa.me/77000000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className={cn(
              "hidden h-9 w-9 place-items-center rounded-full border transition sm:grid",
              scrolled
                ? "border-white/10 text-muted-foreground hover:border-gold hover:text-gold"
                : "border-white/20 text-white/75 hover:border-gold hover:text-gold"
            )}
          >
            <WhatsAppIcon className="h-[17px] w-[17px]" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={cn(
              "hidden h-9 w-9 place-items-center rounded-full border transition sm:grid",
              scrolled
                ? "border-white/10 text-muted-foreground hover:border-gold hover:text-gold"
                : "border-white/20 text-white/75 hover:border-gold hover:text-gold"
            )}
          >
            <Instagram className="h-[17px] w-[17px]" />
          </Link>
          <Link
            href="/create"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold/90 hover:shadow-[0_0_28px_-8px_rgba(227,194,141,0.8)]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Создать</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
