import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-background/90">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg text-accent">JANJUREK</p>
          <p className="text-sm text-muted-foreground">
            © {year} Мемориальный проект семьи JANJUREK. Все права защищены.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="#privacy" className="transition hover:text-accent">
            Политика конфиденциальности
          </Link>
          <Link href="#terms" className="transition hover:text-accent">
            Пользовательское соглашение
          </Link>
          <Link href="mailto:memory@janjurek.kz" className="transition hover:text-accent">
            memory@janjurek.kz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
