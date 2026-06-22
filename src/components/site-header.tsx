"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useSearchDialog } from "@/components/search-dialog-context";

const links = [
  { href: "/#about", label: "О нас" },
  { href: "/#examples", label: "Примеры" },
  { href: "/#guide", label: "Инструкция" },
  { href: "/#contacts", label: "Контакты" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Slim sticky header that reveals once the user scrolls past the full-screen hero,
 * so navigation + search stay reachable on the rest of the page.
 */
export function SiteHeader() {
  const { openDialog } = useSearchDialog();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {shown ? (
        <motion.header
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur-xl"
        >
          <div className="container flex items-center justify-between gap-4 py-3.5">
            <Link
              href="/"
              className="font-serif text-xl tracking-[0.14em] text-gold transition hover:text-gold/80"
            >
              JANJUREK
            </Link>
            <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-gold">
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={openDialog}
              aria-label="Открыть поиск"
              className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-white/20 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Поиск</span>
            </button>
          </div>
        </motion.header>
      ) : null}
    </AnimatePresence>
  );
}
