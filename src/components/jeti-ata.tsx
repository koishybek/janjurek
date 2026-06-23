"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type AtaNode = {
  /** Short Kazakh kinship term, e.g. "Әке", "Ата", or "Сіз" for the self node. */
  term: string;
  /** Optional real name to show under the term. */
  name?: string;
  /** Ordinal caption, e.g. "1-ата". Omitted for the self node. */
  ordinal?: string;
  self?: boolean;
};

/**
 * The canonical "remember seven generations" chain, centred on the living person.
 * Used both as a landing teaser and on memory pages.
 */
export const defaultJetiAta: AtaNode[] = [
  { ordinal: "7-ата", term: "Түп ата" },
  { ordinal: "6-ата", term: "Тек ата" },
  { ordinal: "5-ата", term: "Баба" },
  { ordinal: "4-ата", term: "Арғы ата" },
  { ordinal: "3-ата", term: "Баба" },
  { ordinal: "2-ата", term: "Ата" },
  { ordinal: "1-ата", term: "Әке" },
  { term: "Сіз", self: true },
];

type JetiAtaChainProps = {
  nodes?: AtaNode[];
  className?: string;
};

export function JetiAtaChain({ nodes = defaultJetiAta, className }: JetiAtaChainProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={cn("relative overflow-x-auto pb-2", className)}>
      <div className="flex min-w-max items-stretch gap-0">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center">
            <motion.button
              type="button"
              onHoverStart={() => setActive(i)}
              onHoverEnd={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative flex h-[104px] w-[108px] shrink-0 flex-col items-center justify-center rounded-2xl border px-3 text-center transition-colors duration-300 focus:outline-none",
                node.self
                  ? "border-gold/70 bg-gold/10 shadow-[0_0_38px_-10px_rgba(227,194,141,0.7)]"
                  : "border-white/10 bg-white/[0.02] hover:border-gold/50",
                active === i && !node.self && "border-gold/50 bg-white/[0.04]"
              )}
            >
              {node.ordinal ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold/70">{node.ordinal}</span>
              ) : (
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold">Бүгін</span>
              )}
              <span
                className={cn(
                  "mt-1 font-serif text-lg leading-tight",
                  node.self ? "text-gold" : "text-foreground"
                )}
              >
                {node.term}
              </span>
              {node.name ? (
                <span className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{node.name}</span>
              ) : null}
            </motion.button>

            {i < nodes.length - 1 ? (
              <div className="relative h-px w-7 shrink-0 sm:w-10">
                <div className="hairline-gold absolute inset-0 opacity-60" aria-hidden />
                <motion.div
                  className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-gold"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
                  aria-hidden
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
