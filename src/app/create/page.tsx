"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { submitLead, buildWhatsappLink, type Lead } from "@/lib/firestore-leads";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyLead: Lead = {
  contactName: "",
  phone: "",
  deceasedName: "",
  years: "",
  burialPlace: "",
  youtubeUrl: "",
  description: "",
};

const steps = [
  "Оставьте заявку с контактами и краткой информацией",
  "Менеджер свяжется и пришлёт подробную анкету",
  "Вы передаёте фото и видео (через WhatsApp или YouTube)",
  "Мы оформляем страницу памяти и присылаем ссылку",
  "Вы получаете 2 QR-таблички для установки на памятник",
];

export default function CreatePage() {
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof Lead) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLead((l) => ({ ...l, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lead.contactName.trim() || !lead.phone.trim() || !lead.deceasedName.trim()) {
      setError("Заполните имя, телефон и имя человека, о котором память.");
      return;
    }
    if (!consent) {
      setError("Подтвердите согласие на обработку данных.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const cleaned: Lead = {
        ...lead,
        contactName: lead.contactName.trim(),
        phone: lead.phone.trim(),
        deceasedName: lead.deceasedName.trim(),
      };
      await submitLead(cleaned); // saved when backend is configured; never blocks
      const link = buildWhatsappLink(cleaned);
      setSent(true);
      // Hand the request off to WhatsApp prefilled with the whole form.
      window.open(link, "_blank", "noopener,noreferrer");
    } catch {
      setError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
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

      <main className="container max-w-5xl py-14">
        <div className="space-y-3 text-center">
          <p className="text-[13px] uppercase tracking-[0.34em] text-gold/90">Заявка</p>
          <h1 className="font-serif text-4xl text-foreground sm:text-5xl">Создать страницу памяти</h1>
          <p className="mx-auto max-w-xl text-base leading-8 text-muted-foreground">
            Оставьте заявку — менеджер свяжется с вами, поможет собрать материалы и оформит страницу памяти
            с QR-кодом для памятника. Это бесплатно на этапе подачи заявки.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          {/* How it works rail */}
          <aside className="space-y-6 rounded-2xl surface p-8">
            <h2 className="font-serif text-2xl text-foreground">Как это работает</h2>
            <ol className="space-y-5">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-sm font-semibold text-gold">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-7 text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold/80" />
              Видео загружается на YouTube, тяжёлые файлы не хранятся на сайте — страница всегда лёгкая и быстрая.
            </div>
          </aside>

          {/* The single application panel */}
          <div className="rounded-2xl surface p-8 sm:p-10">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10">
                  <Check className="h-7 w-7 text-gold" />
                </div>
                <h2 className="font-serif text-3xl text-foreground">Заявка отправлена</h2>
                <p className="mx-auto max-w-md text-base leading-8 text-muted-foreground">
                  Сейчас откроется WhatsApp с готовым сообщением — просто нажмите «Отправить».
                  Если он не открылся, нажмите кнопку ниже.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="gap-2 rounded-full bg-gold text-black hover:bg-gold/90"
                  >
                    <a href={buildWhatsappLink(lead)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> Открыть WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full border-white/15">
                    <Link href="/">На главную</Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-5">
                  <h3 className="font-serif text-xl text-foreground">Ваши контакты</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ваше имя *">
                      <Input value={lead.contactName} onChange={set("contactName")} placeholder="Айгерим" />
                    </Field>
                    <Field label="Телефон / WhatsApp *">
                      <Input value={lead.phone} onChange={set("phone")} placeholder="+7 ___ ___ __ __" inputMode="tel" />
                    </Field>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="font-serif text-xl text-foreground">О ком память</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="ФИО *">
                      <Input value={lead.deceasedName} onChange={set("deceasedName")} placeholder="Нұрғали Ахметұлы Сейітов" />
                    </Field>
                    <Field label="Годы жизни">
                      <Input value={lead.years} onChange={set("years")} placeholder="1948 — 2021" />
                    </Field>
                    <Field label="Место захоронения">
                      <Input value={lead.burialPlace} onChange={set("burialPlace")} placeholder="Кладбище, город / область" />
                    </Field>
                    <Field label="Ссылка на видео (YouTube)">
                      <Input value={lead.youtubeUrl} onChange={set("youtubeUrl")} placeholder="https://youtu.be/…" inputMode="url" />
                    </Field>
                  </div>
                  <Field label="Кратко о человеке">
                    <Textarea
                      value={lead.description}
                      onChange={set("description")}
                      placeholder="Несколько слов о жизни, профессии, семье — это поможет менеджеру."
                      className="min-h-[110px]"
                    />
                  </Field>
                </div>

                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#e3c28d]"
                  />
                  Я согласен на обработку персональных данных и хочу, чтобы со мной связались.
                </label>

                {error ? <p className="text-sm text-red-400">{error}</p> : null}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="gold-cta w-full gap-2 rounded-full py-6 text-base font-semibold text-black"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Отправить заявку в WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  После нажатия откроется WhatsApp с готовым сообщением на наш номер.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
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
