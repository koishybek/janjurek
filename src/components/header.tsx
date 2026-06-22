"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchCommandButton } from "@/components/search-command";

const navItems: Array<{ href: string; label: string }> = [
  { href: "/", label: "Главная" },
  { href: "/#about", label: "О нас" },
  { href: "/#guide", label: "Инструкция" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();

  const headerClasses =
    "sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl transition duration-500";

  return (
    <header className={headerClasses}>
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="font-serif text-2xl tracking-[0.4em] text-accent transition hover:text-accent/80">
          JANJUREK
        </Link>
        <nav aria-label="Основное меню" className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition hover:text-accent",
                pathname === item.href ? "text-accent" : undefined
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SearchCommandButton />
        </div>
      </div>
    </header>
  );
}
