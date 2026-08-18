"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { Tribute } from "@/lib/firestore-tributes";

type MemoryWallProps = {
  personName: string;
  tributes: Tribute[];
};

/**
 * Read-only wall of remembrances. Visitors cannot post here — notes are curated
 * and published by the JANJUREK team, so nothing unmoderated reaches a memorial.
 */
export function MemoryWall({ personName, tributes }: MemoryWallProps) {
  if (tributes.length === 0) {
    return null;
  }

  const firstName = personName.split(" ")[0] || "герое";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">Стена памяти</p>
        <h2 className="font-serif text-3xl text-foreground">Заметки и воспоминания</h2>
        <p className="max-w-xl text-base text-muted-foreground">
          Тёплые слова родных, друзей и учеников о {firstName}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tributes.map((tribute, i) => (
          <motion.article
            key={tribute.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
            className="glow-card relative rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <Heart className="h-5 w-5 text-gold/70" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 text-sm leading-7 text-foreground/90">«{tribute.message}»</p>
            <p className="mt-5 text-sm font-medium text-foreground">
              {tribute.author}
              {tribute.relation ? <span className="text-muted-foreground">, {tribute.relation}</span> : null}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
