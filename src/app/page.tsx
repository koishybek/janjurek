import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { Reveal, Counter, Parallax, Magnetic } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { SearchCommandButton } from "@/components/search-command";
import { people, relations } from "@data/people";
import { Button } from "@/components/ui/button";
import { FamilyTreeLazy } from "@/components/family-tree-lazy";
import { CtaBand } from "@/components/cta-band";
import { exampleMemorial } from "@data/examplePerson";
import {
  ScrollText,
  CalendarClock,
  Images,
  Video,
  MessagesSquare,
  Network,
  Star,
  BookText,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";

const PANEL = "rounded-2xl surface";

export default function HomePage() {
  const highlightedPerson = people[0];

  const exampleCards = [
    {
      title: `${people[0].lastName} ${people[0].firstName}`,
      years: people[0].years ?? "—",
      description: "Первый мемориал проекта JANJUREK с родовым древом и медиатекой.",
      href: `/memory/${people[0].slug}`,
      image: people[0].media?.photos?.[0]?.src ?? "/images/sample-photo.jpg",
    },
    {
      title: exampleMemorial.name,
      years: exampleMemorial.years,
      description: "Демонстрационная страница в тематике «Лунная ночь» с развёрнутыми разделами.",
      href: `/memory/${exampleMemorial.slug}`,
      image: exampleMemorial.gallery[0]?.src ?? "/images/hero-stars.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <main id="landing" className="container space-y-32 pb-32 pt-24 lg:space-y-44">
        {/* ── Stats strip ── */}
        <section className="-mt-8">
          <Reveal>
            <div className={`${PANEL} grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0`}>
              {[
                { value: <Counter to={7} />, label: "колен рода — Жеті ата" },
                { value: <Counter to={8} />, label: "живых разделов памяти" },
                { value: <span>∞</span>, label: "срок бережного хранения" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 px-8 py-10 text-center">
                  <span className="nums font-serif text-5xl text-gold lg:text-6xl">{stat.value}</span>
                  <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Search + quick actions ── */}
        <section id="search" className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal className="h-full">
            <div className={`${PANEL} surface-hover flex h-full flex-col p-10`}>
              <SectionHeading eyebrow="Архив памяти" title="Поиск памяти" />
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                Открывайте истории по имени или фамилии. Используйте горячую клавишу{" "}
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[12px] text-foreground/80">⌘K</kbd>{" "}
                /{" "}
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[12px] text-foreground/80">Ctrl+K</kbd>{" "}
                для мгновенного поиска.
              </p>
              <SearchCommandButton className="mt-8 w-full justify-center py-6 text-base" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <div className={`${PANEL} surface-hover flex h-full flex-col p-10`}>
              <SectionHeading title="Оставить заявку" />
              <p className="mt-5 flex-1 text-base leading-8 text-muted-foreground">
                Оставьте заявку — менеджер свяжется, поможет собрать материалы и оформит страницу памяти с QR-кодом.
              </p>
              <Magnetic className="mt-8 w-full">
                <Button asChild className="w-full gap-2 gold-cta rounded-full py-6 text-base font-semibold text-black">
                  <Link href="/create">
                    Оставить заявку <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </section>

        {/* ── Family tree ── */}
        <section id="family-tree" className="space-y-10">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Родословная" title="Родовое древо JANJUREK" />
              <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Предпросмотр выбранной ветви
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${PANEL} overflow-hidden p-2`}>
              <FamilyTreeLazy
                rootId={highlightedPerson?.id ?? ""}
                people={people}
                relations={relations}
                variant="preview"
                fallback={
                  <div className="grid place-items-center rounded-xl border border-dashed border-white/10 p-16 text-base text-muted-foreground">
                    Загрузка родового древа…
                  </div>
                }
              />
            </div>
          </Reveal>
        </section>

        {/* ── Example memory pages ── */}
        <section id="examples" className="space-y-10">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Истории"
                title="Примеры страниц памяти"
                description="Посмотрите готовые мемориалы JANJUREK. Каждая страница — это уникальная история семьи."
              />
              <Magnetic className="shrink-0">
                <Button asChild className="gap-2 rounded-full bg-primary px-7 py-6 text-base text-primary-foreground hover:bg-primary/90">
                  <a href="/memory/example-moon" target="_blank" rel="noopener noreferrer">Открыть демо «Лунная история»</a>
                </Button>
              </Magnetic>
            </div>
          </Reveal>
          <div className="grid gap-7 lg:grid-cols-2">
            {exampleCards.map((card, i) => (
              <Reveal key={card.href} delay={i * 0.1}>
                <a href={card.href} target="_blank" rel="noopener noreferrer" className={`${PANEL} surface-hover group block overflow-hidden`}>
                  <div className="relative h-72 w-full overflow-hidden">
                    <Parallax amount={28} className="absolute inset-0">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="scale-110 object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                      />
                    </Parallax>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-7 space-y-1.5">
                      <p className="font-serif text-3xl text-white">{card.title}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-gold/90">{card.years}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-7">
                    <p className="text-base leading-8 text-muted-foreground">{card.description}</p>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-gold transition group-hover:border-gold group-hover:bg-gold/10">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── What's inside a memory page ── */}
        <section id="features" className="space-y-14">
          <Reveal>
            <SectionHeading
              eyebrow="Возможности"
              title="Что внутри страницы памяти"
              description="Каждый мемориал — это целостная история, собранная из живых разделов: от некролога и биографии до родового древа и стены памяти."
              align="center"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {memoryFeatures.map((feature, i) => (
              <Reveal key={feature.title} delay={(i % 4) * 0.08}>
                <div className={`${PANEL} surface-hover h-full p-8`}>
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5">
                    <feature.icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-6 font-serif text-xl text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal className="space-y-6">
            <SectionHeading eyebrow="О проекте" title="JANJUREK — цифровой мемориал" />
            <p className="text-lg leading-9 text-muted-foreground">
              JANJUREK — это цифровой мемориал, созданный в память о предках и продолжателях рода. Мы
              помогаем семьям хранить документы, фото, видео и воспоминания в удобном формате, связываем
              поколения через родословные деревья и делимся историями с близкими.
            </p>
            <p className="text-lg leading-9 text-muted-foreground">
              Каждая страница памяти — это живая история, дополненная свидетельствами родных и друзей.
              Проект развивает культуру бережного отношения к семейным архивам.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className={`${PANEL} surface-hover p-10`}>
              <h3 className="font-serif text-2xl text-foreground">Что мы предлагаем</h3>
              <ul className="mt-7 space-y-5 text-base text-muted-foreground">
                {[
                  "Структурированное хранение семейных архивов",
                  "Интерактивные древа с навигацией по родственникам",
                  "Разделы для фото, видео и документов",
                  "Настраиваемые шаблоны страниц памяти",
                  "Поддержку по сбору и оцифровке материалов",
                ].map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span className="leading-8">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ── How it works (5 steps) ── */}
        <section id="how" className="space-y-12">
          <Reveal>
            <SectionHeading
              eyebrow="Как это работает"
              title="Пять шагов до страницы памяти"
              description="Вам не нужно ничего настраивать — оставьте заявку, а мы возьмём оформление на себя и привезём готовые QR-таблички."
              align="center"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {howSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className={`${PANEL} surface-hover flex h-full flex-col p-7`}>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 font-serif text-lg text-gold">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-serif text-lg leading-tight text-foreground">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Pricing / QR tablets ── */}
        <section id="pricing" className="space-y-12">
          <Reveal>
            <SectionHeading
              eyebrow="Стоимость"
              title="Страница памяти с QR-табличками"
              description="Один тариф — всё включено. Мы оформляем страницу и изготавливаем две прочные QR-таблички для установки на памятник."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]">
              <div className={`${PANEL} surface-hover flex flex-col justify-between p-10`}>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Мемориал «под ключ»</p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="nums font-serif text-6xl text-gold">19 900</span>
                    <span className="mb-2 text-lg text-muted-foreground">₸</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Единоразово. Стоимость уточняется менеджером.</p>
                </div>
                <Magnetic className="mt-8 w-full">
                  <Button asChild className="w-full gap-2 gold-cta rounded-full py-6 text-base font-semibold text-black">
                    <Link href="/create">Оставить заявку <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </Magnetic>
              </div>
              <div className={`${PANEL} p-10`}>
                <h3 className="font-serif text-2xl text-foreground">Что входит</h3>
                <ul className="mt-6 space-y-4 text-base text-muted-foreground">
                  {pricingIncludes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-gold" />
                      <span className="leading-7">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Contacts ── */}
        <section id="contacts" className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="space-y-8">
            <SectionHeading
              eyebrow="Связь"
              title="Контакты команды"
              description="Мы отвечаем на сообщения в рабочие дни с 10:00 до 18:00 по времени Астаны."
            />
            <dl className="space-y-6 text-base">
              <div>
                <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Email</dt>
                <dd className="mt-1.5">
                  <a className="text-lg text-gold underline-offset-4 hover:underline" href="mailto:memory@janjurek.kz">
                    memory@janjurek.kz
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Телефон</dt>
                <dd className="mt-1.5">
                  <a className="text-lg text-gold underline-offset-4 hover:underline" href="tel:+77776291638">
                    +7 777 629 16 38
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Социальные сети</dt>
                <dd className="mt-2.5 flex gap-5 text-lg">
                  <a
                    className="text-gold underline-offset-4 hover:underline"
                    href="https://wa.me/77776291638"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                  <a
                    className="text-gold underline-offset-4 hover:underline"
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.12}>
            <div className={`${PANEL} surface-hover flex h-full flex-col p-10`}>
              <h3 className="font-serif text-2xl text-foreground">Остались вопросы?</h3>
              <p className="mt-5 flex-1 text-base leading-8 text-muted-foreground">
                Напишите нам в WhatsApp — поможем оформить страницу памяти, подскажем по материалам и
                срокам изготовления QR-табличек.
              </p>
              <Magnetic className="mt-8 w-full">
                <Button asChild className="w-full rounded-full bg-primary py-6 text-base text-primary-foreground hover:bg-primary/90">
                  <a href="https://wa.me/77776291638" target="_blank" rel="noopener noreferrer">
                    Написать в WhatsApp
                  </a>
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </section>

        {/* ── Final CTA band ── */}
        <Reveal>
          <CtaBand />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}

const memoryFeatures = [
  { icon: ScrollText, title: "Некролог", description: "Тёплые слова прощания и главные черты человека." },
  { icon: BookText, title: "Биография и архив", description: "Жизненный путь, происхождение рода, документы и факты." },
  { icon: CalendarClock, title: "Таймлайн жизни", description: "Ключевые события по годам — от рождения до наследия." },
  { icon: Images, title: "Галерея", description: "Фотографии, бережно собранные в одном месте." },
  { icon: Video, title: "Видео", description: "Записи голоса, праздников и важных моментов." },
  { icon: MessagesSquare, title: "Стена памяти", description: "Близкие оставляют воспоминания и тёплые слова." },
  { icon: Network, title: "Родовое древо", description: "Интерактивные связи между поколениями семьи." },
  { icon: Star, title: "Избранное", description: "Любимые фразы, книги, места и привычки человека." },
];

const howSteps = [
  { title: "Оставьте заявку", description: "Имя, телефон и пара слов о человеке — это всё, что нужно для старта." },
  { title: "Менеджер свяжется", description: "Мы перезвоним, ответим на вопросы и пришлём удобную анкету." },
  { title: "Передаёте материалы", description: "Фотографии и видео (через YouTube) — без тяжёлых загрузок на сайт." },
  { title: "Оформляем страницу", description: "Собираем биографию, галерею, видео и родословную в единую историю." },
  { title: "Получаете QR-таблички", description: "Две прочные таблички с QR-кодом для установки на памятник." },
];

const pricingIncludes = [
  "Персональная страница памяти с уникальной ссылкой",
  "Биография, галерея фотографий и видео с YouTube",
  "Родословное древо и заметки близких",
  "Две QR-таблички для памятника",
  "Поиск страницы по имени и фамилии",
  "Помощь менеджера в оформлении",
];
