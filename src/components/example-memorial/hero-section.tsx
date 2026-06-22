"use client";

import Image from "next/image";
import { ShareButtons } from "./share-buttons";

type HeroSectionProps = {
  name: string;
  years: string;
  location?: string;
};

export function HeroSection({ name, years, location }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-xl border border-white/10">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero.jpg"
          alt="Звёздное ночное небо"
          fill
          priority
          sizes="100vw"
          className="photo-bw object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" aria-hidden />
      </div>

      <div className="relative flex min-h-[420px] flex-col justify-end gap-8 p-8 sm:p-12 md:min-h-[480px] md:flex-row md:items-end md:justify-between lg:p-16">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-gold/80">
            Мемориал JANJUREK
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] text-gold sm:text-5xl lg:text-6xl">
            {name}
          </h1>
          <p className="text-base text-white/70 sm:text-lg">
            {years}
            {location ? <span className="text-white/40"> · {location}</span> : null}
          </p>
          <p className="max-w-md text-sm leading-7 text-white/55">
            Светлая память. Поделитесь воспоминаниями и сохраните историю для будущих поколений.
          </p>
        </div>

        <aside className="flex flex-col items-start gap-3 md:items-end">
          <p className="text-xs uppercase tracking-[0.28em] text-gold/80">Поделиться</p>
          <ShareButtons orientation="horizontal" />
        </aside>
      </div>
    </section>
  );
}
