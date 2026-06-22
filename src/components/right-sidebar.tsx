"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type RightSidebarProps = {
  onFocusSearch: () => void;
  onSkip: () => void;
};

const navLinks = [
  { href: "/#about", label: "О нас" },
  { href: "/#guide", label: "Инструкция" },
  { href: "/#contacts", label: "Контакты" },
];

export function RightSidebar({ onFocusSearch, onSkip }: RightSidebarProps) {
  return (
    <aside className="pointer-events-auto fixed right-6 top-1/2 z-[120] w-[260px] -translate-y-1/2 rounded-3xl border border-white/20 bg-black/55 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="space-y-5">
        <div>
          <p className="font-serif text-3xl tracking-[0.4em] text-accent">JANJUREK</p>
          <p className="mt-3 text-sm text-white/70">
            Мемориальный сайт семьи. Найдите историю, чтобы зажечь звезду и перейти на страницу памяти.
          </p>
        </div>
        <nav className="space-y-3 text-base">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className="w-full justify-start rounded-2xl bg-white/5 text-white transition hover:bg-white/10"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="space-y-3">
          <Button
            type="button"
            onClick={onFocusSearch}
            variant="secondary"
            className="w-full justify-center gap-2 rounded-2xl border border-white/20 bg-white/15 text-sm text-white transition hover:bg-white/25"
          >
            Открыть поиск
          </Button>
          <Button
            type="button"
            onClick={onSkip}
            variant="outline"
            className="w-full justify-center rounded-2xl border-white/40 text-sm text-white transition hover:bg-white/10"
          >
            Пропустить анимацию
          </Button>
        </div>
      </div>
    </aside>
  );
}
