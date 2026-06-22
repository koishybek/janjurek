"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

type GalleryBlockProps = {
  items: { src: string; alt: string }[];
};

export function GalleryBlock({ items }: GalleryBlockProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const next = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <>
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
              Архив
            </p>
            <h2 className="mt-3 font-serif text-3xl text-foreground">Галерея</h2>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {items.length} фото
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-lg border-gold/30 text-gold hover:border-gold/50"
            onClick={() => setOpen(true)}
          >
            <Images className="mr-2 h-4 w-4" aria-hidden />
            Слайд-шоу
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <figure
              key={item.src}
              className="group relative overflow-hidden rounded-xl border border-white/10"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={400}
                className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-xs text-white">
                {item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl rounded-xl border-white/10 bg-background/95 p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              Слайд-шоу
            </DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              className="absolute left-4 z-10 rounded-full border border-white/10 bg-white/[0.04] p-2 text-foreground transition hover:border-white/20 hover:bg-white/[0.08]"
              onClick={prev}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-white/10">
              <Image
                src={items[activeIndex].src}
                alt={items[activeIndex].alt}
                fill
                sizes="(min-width: 1024px) 720px, 90vw"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute right-4 z-10 rounded-full border border-white/10 bg-white/[0.04] p-2 text-foreground transition hover:border-white/20 hover:bg-white/[0.08]"
              onClick={next}
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">{items[activeIndex].alt}</p>
            <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
              {activeIndex + 1} / {items.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
