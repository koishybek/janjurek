"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Person } from "@data/people";
import { isFirebaseConfigured } from "@/lib/firebase";
import { savePersonToFirestore } from "@/lib/firestore-people";
import { saveLocalPerson } from "@/lib/local-people";
import { QrImage, downloadQr, useQrDataUrl } from "@/components/share-qr";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Основные данные", hint: "ФИО, даты, место рождения" },
  { title: "Медиа", hint: "Главное фото и галерея" },
  { title: "Биография", hint: "История жизни и достижения" },
  { title: "Родословная", hint: "Жеті ата и семья" },
  { title: "Публикация", hint: "Проверка и ссылка с QR" },
];

const TRANSLIT: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "i", к: "k", қ: "q", л: "l", м: "m", н: "n", ң: "n", о: "o",
  ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ұ: "u", ү: "u", ф: "f", х: "h",
  һ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", і: "i", ь: "", э: "e",
  ю: "yu", я: "ya",
};

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `memory-${Math.random().toString(36).slice(2, 8)}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Draft = {
  firstName: string;
  lastName: string;
  patronymic: string;
  years: string;
  birthPlace: string;
  mainOccupation: string;
  extraInfo: string;
  studyPlace: string;
  awards: string;
  fatherName: string;
  zhuz: string;
  rod: string;
  children: string;
};

const emptyDraft: Draft = {
  firstName: "", lastName: "", patronymic: "", years: "", birthPlace: "",
  mainOccupation: "", extraInfo: "", studyPlace: "", awards: "",
  fatherName: "", zhuz: "", rod: "", children: "",
};

export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<{ slug: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => ({ ...d, [field]: e.target.value }));

  const canNext = useMemo(() => {
    if (step === 0) return draft.firstName.trim() && draft.lastName.trim();
    return true;
  }, [step, draft]);

  const onMainPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMainPhoto(await readFileAsDataUrl(file));
    e.target.value = "";
  };

  const onGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = await Promise.all(files.map(readFileAsDataUrl));
    setGallery((g) => [...g, ...urls]);
    e.target.value = "";
  };

  const parseLines = (value: string) =>
    value.split("\n").map((s) => s.trim()).filter(Boolean);

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      const slug = slugify(`${draft.lastName} ${draft.firstName} ${draft.patronymic}`);
      const fullName = [draft.lastName, draft.firstName].filter(Boolean).join(" ");
      const photos = [
        ...(mainPhoto ? [{ src: mainPhoto, alt: `${fullName} — главное фото` }] : []),
        ...gallery.map((src, i) => ({ src, alt: `${fullName} — фото ${i + 1}` })),
      ];
      const person: Person = {
        id: slug,
        slug,
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        patronymic: draft.patronymic.trim() || undefined,
        years: draft.years.trim() || undefined,
        birthPlace: draft.birthPlace.trim() || undefined,
        mainOccupation: draft.mainOccupation.trim() || undefined,
        extraInfo: draft.extraInfo.trim() || undefined,
        studyPlace: draft.studyPlace.trim() || undefined,
        awards: parseLines(draft.awards),
        fatherName: draft.fatherName.trim() || undefined,
        zhuz: draft.zhuz.trim() || undefined,
        rod: draft.rod.trim() || undefined,
        children: parseLines(draft.children),
        media: photos.length ? { photos, videos: [], documents: [] } : undefined,
      };

      saveLocalPerson(person);
      if (isFirebaseConfigured) {
        await savePersonToFirestore(person);
      }
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      setPublished({ slug, url: `${origin}/memory/${slug}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось опубликовать страницу.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10">
        <div className="container flex items-center justify-between py-5">
          <Link href="/" className="font-serif text-xl tracking-[0.16em] text-gold">JANJUREK</Link>
          <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            На главную
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl py-14">
        {published ? (
          <PublishedScreen published={published} name={[draft.lastName, draft.firstName].filter(Boolean).join(" ")} />
        ) : (
          <>
            <div className="space-y-3 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/80">Конструктор</p>
              <h1 className="font-serif text-4xl text-foreground sm:text-5xl">Создать страницу памяти</h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground">
                Пять простых шагов — и история близкого человека сохранится навсегда, с уникальной ссылкой и QR-кодом.
              </p>
            </div>

            <Stepper current={step} />

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === 0 ? <StepBasic draft={draft} set={set} /> : null}
                  {step === 1 ? (
                    <StepMedia
                      mainPhoto={mainPhoto}
                      gallery={gallery}
                      onMainPhoto={onMainPhoto}
                      onGallery={onGallery}
                      removeMain={() => setMainPhoto(null)}
                      removeGalleryAt={(i) => setGallery((g) => g.filter((_, idx) => idx !== i))}
                    />
                  ) : null}
                  {step === 2 ? <StepBio draft={draft} set={set} /> : null}
                  {step === 3 ? <StepRoots draft={draft} set={set} /> : null}
                  {step === 4 ? <StepReview draft={draft} mainPhoto={mainPhoto} galleryCount={gallery.length} /> : null}
                </motion.div>
              </AnimatePresence>

              {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}

              <div className="mt-9 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-white/15"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  <ArrowLeft className="h-4 w-4" /> Назад
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    className="gap-2 rounded-full bg-gold text-black hover:bg-gold/90 disabled:opacity-50"
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    disabled={!canNext}
                  >
                    Далее <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="gap-2 rounded-full bg-gold text-black hover:bg-gold/90"
                    onClick={handlePublish}
                    disabled={publishing}
                  >
                    {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Опубликовать
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="mt-12 flex items-center justify-between gap-1">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.title} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition-colors",
                  done && "border-gold bg-gold text-black",
                  active && "border-gold text-gold",
                  !done && !active && "border-white/15 text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-[11px] leading-tight sm:block", active ? "text-foreground" : "text-muted-foreground")}>
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <div className={cn("mx-1 h-px flex-1 transition-colors", i < current ? "bg-gold/60" : "bg-white/10")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm font-medium text-foreground">
      {label}
      {children}
    </label>
  );
}

function StepBasic({ draft, set }: { draft: Draft; set: (f: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-foreground">Основные данные</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Фамилия *"><Input value={draft.lastName} onChange={set("lastName")} placeholder="Сейітов" /></Field>
        <Field label="Имя *"><Input value={draft.firstName} onChange={set("firstName")} placeholder="Нұрғали" /></Field>
        <Field label="Отчество"><Input value={draft.patronymic} onChange={set("patronymic")} placeholder="Ахметұлы" /></Field>
        <Field label="Годы жизни"><Input value={draft.years} onChange={set("years")} placeholder="1948 — 2021" /></Field>
        <Field label="Место рождения"><Input value={draft.birthPlace} onChange={set("birthPlace")} placeholder="Жамбылская область" /></Field>
        <Field label="Профессия"><Input value={draft.mainOccupation} onChange={set("mainOccupation")} placeholder="Учитель истории" /></Field>
      </div>
    </div>
  );
}

function StepMedia({
  mainPhoto, gallery, onMainPhoto, onGallery, removeMain, removeGalleryAt,
}: {
  mainPhoto: string | null;
  gallery: string[];
  onMainPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGallery: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMain: () => void;
  removeGalleryAt: (i: number) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Фотографии</h2>
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Главное фото</p>
        {mainPhoto ? (
          <div className="relative h-56 w-full max-w-xs overflow-hidden rounded-xl border border-white/10">
            <Image src={mainPhoto} alt="Главное фото" fill className="object-cover" unoptimized />
            <button onClick={removeMain} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white/80 transition hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-40 max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-sm text-muted-foreground transition hover:border-gold/50 hover:text-foreground">
            <ImagePlus className="h-6 w-6 text-gold/70" />
            Загрузить фото
            <input type="file" accept="image/*" className="hidden" onChange={onMainPhoto} />
          </label>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Галерея</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {gallery.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
              <Image src={src} alt={`Фото ${i + 1}`} fill className="object-cover" unoptimized />
              <button onClick={() => removeGalleryAt(i)} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white/80 opacity-0 transition group-hover:opacity-100 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/20 text-xs text-muted-foreground transition hover:border-gold/50 hover:text-foreground">
            <ImagePlus className="h-5 w-5 text-gold/70" />
            Добавить
            <input type="file" accept="image/*" multiple className="hidden" onChange={onGallery} />
          </label>
        </div>
      </div>
    </div>
  );
}

function StepBio({ draft, set }: { draft: Draft; set: (f: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-foreground">Биография</h2>
      <Field label="История жизни">
        <Textarea value={draft.extraInfo} onChange={set("extraInfo")} placeholder="Расскажите о жизненном пути, ценностях, любимых словах…" className="min-h-[160px]" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Образование"><Input value={draft.studyPlace} onChange={set("studyPlace")} placeholder="КазНУ им. аль-Фараби" /></Field>
        <Field label="Награды (по строке на каждую)"><Textarea value={draft.awards} onChange={set("awards")} placeholder={"Медаль «За трудовую доблесть»\nПочётная грамота"} className="min-h-[64px]" /></Field>
      </div>
    </div>
  );
}

function StepRoots({ draft, set }: { draft: Draft; set: (f: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-foreground">Родословная — Жеті ата</h2>
      <p className="text-sm text-muted-foreground">Эти данные оживят цепочку поколений на странице памяти.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Имя отца (1-ата)"><Input value={draft.fatherName} onChange={set("fatherName")} placeholder="Ахмет Нұрғалиұлы" /></Field>
        <Field label="Жуз"><Input value={draft.zhuz} onChange={set("zhuz")} placeholder="Ұлы жүз" /></Field>
        <Field label="Род"><Input value={draft.rod} onChange={set("rod")} placeholder="Дулат" /></Field>
        <Field label="Дети (по строке на каждого)"><Textarea value={draft.children} onChange={set("children")} placeholder={"Айдос\nМадина"} className="min-h-[64px]" /></Field>
      </div>
    </div>
  );
}

function StepReview({ draft, mainPhoto, galleryCount }: { draft: Draft; mainPhoto: string | null; galleryCount: number }) {
  const fullName = [draft.lastName, draft.firstName, draft.patronymic].filter(Boolean).join(" ") || "—";
  const rows: Array<[string, string]> = [
    ["Имя", fullName],
    ["Годы жизни", draft.years || "—"],
    ["Место рождения", draft.birthPlace || "—"],
    ["Профессия", draft.mainOccupation || "—"],
    ["Фотографии", `${(mainPhoto ? 1 : 0) + galleryCount} шт.`],
    ["Отец", draft.fatherName || "—"],
  ];
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-foreground">Проверьте перед публикацией</h2>
      <div className="overflow-hidden rounded-xl border border-white/10">
        {rows.map(([label, value], i) => (
          <div key={label} className={cn("flex justify-between gap-4 px-5 py-3 text-sm", i % 2 === 0 ? "bg-white/[0.015]" : "")}>
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        После публикации вы получите уникальную ссылку и QR-код, который можно разместить на памятнике.
      </p>
    </div>
  );
}

function PublishedScreen({ published, name }: { published: { slug: string; url: string }; name: string }) {
  const [copied, setCopied] = useState(false);
  const dataUrl = useQrDataUrl(published.url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(published.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-xl space-y-8 text-center"
    >
      <div className="space-y-3">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10">
          <Check className="h-7 w-7 text-gold" />
        </div>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Страница памяти создана</h1>
        <p className="text-sm text-muted-foreground">
          {name ? `Память о ${name} теперь сохранена.` : "Страница готова."} Поделитесь ссылкой или QR-кодом с близкими.
        </p>
      </div>

      <div className="flex justify-center">
        <QrImage value={published.url} size={224} />
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
        <span className="flex-1 truncate text-left text-xs text-muted-foreground">{published.url}</span>
        <button onClick={copy} className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-gold transition hover:bg-gold/10">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild className="gap-2 rounded-full bg-gold text-black hover:bg-gold/90">
          <Link href={`/memory/${published.slug}`}>
            Открыть страницу <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-white/15"
          onClick={() => dataUrl && downloadQr(dataUrl, `janjurek-${published.slug}.png`)}
          disabled={!dataUrl}
        >
          <Download className="h-4 w-4" /> Скачать QR
        </Button>
      </div>
    </motion.div>
  );
}
