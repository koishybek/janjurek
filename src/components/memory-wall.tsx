"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Loader2, MessageSquarePlus, Send } from "lucide-react";
import { fetchApprovedTributes, submitTribute, type Tribute } from "@/lib/firestore-tributes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const seedTributes: Omit<Tribute, "slug">[] = [
  {
    id: "seed-1",
    author: "Сауле",
    relation: "дочь",
    message:
      "Папа всегда говорил: «Дерево держится корнями, а человек — родом». Мы помним каждое его слово и стараемся жить по совести, как он учил.",
    approved: true,
  },
  {
    id: "seed-2",
    author: "Болат",
    relation: "ученик",
    message:
      "Благодаря ему я полюбил лес и выбрал свою профессию. Светлая память настоящему наставнику.",
    approved: true,
  },
];

type PendingTribute = Tribute & { pending?: boolean };

type MemoryWallProps = {
  slug: string;
  personName: string;
};

export function MemoryWall({ slug, personName }: MemoryWallProps) {
  const [tributes, setTributes] = useState<PendingTribute[]>(
    seedTributes.map((t) => ({ ...t, slug }))
  );
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchApprovedTributes(slug)
      .then((remote) => {
        if (cancelled || remote.length === 0) return;
        setTributes((current) => {
          const seedOnly = current.filter((t) => t.id.startsWith("seed-"));
          return [...remote, ...seedOnly];
        });
      })
      .catch(() => {
        /* graceful: keep seed tributes */
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!author.trim() || !message.trim()) {
      setNotice("Пожалуйста, укажите имя и текст воспоминания.");
      return;
    }
    setSubmitting(true);
    setNotice(null);
    try {
      await submitTribute({ slug, author: author.trim(), relation: relation.trim(), message: message.trim() });
      const optimistic: PendingTribute = {
        id: `local-${Date.now()}`,
        slug,
        author: author.trim(),
        relation: relation.trim() || undefined,
        message: message.trim(),
        approved: false,
        pending: true,
      };
      setTributes((current) => [optimistic, ...current]);
      setAuthor("");
      setRelation("");
      setMessage("");
      setOpen(false);
      setNotice("Спасибо! Ваше воспоминание отправлено на модерацию и появится после проверки.");
    } catch {
      setNotice("Не удалось отправить воспоминание. Попробуйте ещё раз позже.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">Стена памяти</p>
          <h2 className="font-serif text-3xl text-foreground">Заметки и воспоминания</h2>
          <p className="max-w-xl text-base text-muted-foreground">
            Тёплые слова родных, друзей и учеников о {personName.split(" ")[0] || "герое"}. Оставьте свою заметку — после модерации она появится здесь.
          </p>
        </div>
        <Button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 gap-2 gold-cta rounded-full text-black"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Оставить заметку
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="space-y-4 rounded-2xl border border-gold/20 bg-white/[0.02] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-foreground">
                  Ваше имя
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Например: Айгерим" />
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  Кем приходитесь (необязательно)
                  <Input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="дочь, коллега, друг…" />
                </label>
              </div>
              <label className="space-y-2 text-sm text-foreground">
                Воспоминание
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Расскажите тёплую историю или поделитесь словами памяти…"
                  className="min-h-[120px]"
                />
              </label>
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" className="rounded-full border-white/15" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2 gold-cta rounded-full text-black">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Отправить
                </Button>
              </div>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      {notice ? (
        <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold/90">{notice}</p>
      ) : null}

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
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {tribute.author}
                {tribute.relation ? <span className="text-muted-foreground">, {tribute.relation}</span> : null}
              </p>
              {tribute.pending ? (
                <span className="rounded-full border border-gold/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-gold/80">
                  на модерации
                </span>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
