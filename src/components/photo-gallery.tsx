"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryPhoto = { src: string; alt: string };

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
  className?: string;
};

export function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const go = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + dir + photos.length) % photos.length;
      });
    },
    [photos.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", className)}>
        {photos.map((photo, i) => (
          <button
            key={`${photo.src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="glow-card group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.05] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 focus:outline-none sm:p-10">
            <Dialog.Title className="sr-only">Просмотр фотографии</Dialog.Title>
            <Dialog.Description className="sr-only">
              {current?.alt ?? "Фотография из галереи памяти"}
            </Dialog.Description>

            <Dialog.Close
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            {photos.length > 1 ? (
              <button
                type="button"
                aria-label="Предыдущее фото"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-gold sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            ) : null}

            <div className="relative flex h-[70vh] w-full max-w-5xl items-center justify-center">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.div
                    key={openIndex}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {photos.length > 1 ? (
              <button
                type="button"
                aria-label="Следующее фото"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-gold sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            ) : null}

            <div className="mt-5 flex items-center gap-4 text-center">
              <p className="max-w-xl text-sm text-white/70">{current?.alt}</p>
            </div>
            {photos.length > 1 ? (
              <p className="mt-1 text-xs tracking-[0.2em] text-white/40">
                {(openIndex ?? 0) + 1} / {photos.length}
              </p>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
