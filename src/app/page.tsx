import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SearchCommandButton } from "@/components/search-command";
import { people, relations } from "@data/people";
import { Button } from "@/components/ui/button";
import { FamilyTreeLazy } from "@/components/family-tree-lazy";
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
} from "lucide-react";

const PANEL = "rounded-xl border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-white/20";

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
      <main id="landing" className="container space-y-28 pb-28 pt-24 lg:space-y-36">
        {/* ── Search + quick actions ── */}
        <section id="search" className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal className="h-full">
            <div className={`${PANEL} flex h-full flex-col p-8`}>
              <SectionHeading eyebrow="Архив памяти" title="Поиск памяти" />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Открывайте истории по имени или фамилии. Используйте горячую клавишу{" "}
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] text-foreground/80">⌘K</kbd>{" "}
                /{" "}
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] text-foreground/80">Ctrl+K</kbd>{" "}
                для мгновенного поиска.
              </p>
              <SearchCommandButton className="mt-6 w-full justify-center" />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className={`${PANEL} flex h-full flex-col p-8`}>
              <SectionHeading title="Быстрые действия" />
              <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                Добавьте историю своего родственника, когда сервис будет доступен. А пока — соберите
                документы, фотографии и видеозаписи.
              </p>
              <Button variant="outline" className="mt-6 w-full rounded-md border-white/15 hover:bg-white/5">
                Подготовить архив
              </Button>
            </div>
          </Reveal>
        </section>

        {/* ── Family tree ── */}
        <section id="family-tree" className="space-y-8">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Родословная" title="Родовое древо JANJUREK" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Предпросмотр выбранной ветви
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className={`${PANEL} overflow-hidden p-2`}>
              <FamilyTreeLazy
                rootId={highlightedPerson?.id ?? ""}
                people={people}
                relations={relations}
                variant="preview"
                fallback={
                  <div className="grid place-items-center rounded-lg border border-dashed border-white/10 p-12 text-sm text-muted-foreground">
                    Загрузка родового древа…
                  </div>
                }
              />
            </div>
          </Reveal>
        </section>

        {/* ── Example memory pages ── */}
        <section id="examples" className="space-y-8">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Истории"
                title="Примеры страниц памяти"
                description="Посмотрите готовые мемориалы JANJUREK. Каждая страница — это уникальная история семьи."
              />
              <Button asChild className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/memory/example-moon">Открыть демо «Лунная история»</Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {exampleCards.map((card, i) => (
              <Reveal key={card.href} delay={i * 0.08}>
                <div className={`${PANEL} group overflow-hidden`}>
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-5 left-6 space-y-1">
                      <p className="font-serif text-2xl text-white">{card.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gold/90">{card.years}</p>
                    </div>
                  </div>
                  <div className="space-y-5 p-6">
                    <p className="text-sm leading-7 text-muted-foreground">{card.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-md border-white/15 hover:bg-white/5"
                    >
                      <Link href={card.href}>Перейти к странице</Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── What's inside a memory page ── */}
        <section id="features" className="space-y-12">
          <Reveal>
            <SectionHeading
              eyebrow="Возможности"
              title="Что внутри страницы памяти"
              description="Каждый мемориал — это целостная история, собранная из живых разделов: от некролога и биографии до родового древа и стены памяти."
              align="center"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {memoryFeatures.map((feature, i) => (
              <Reveal key={feature.title} delay={(i % 4) * 0.06}>
                <div className={`${PANEL} h-full p-6`}>
                  <feature.icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-4 font-serif text-lg text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal className="space-y-5">
            <SectionHeading eyebrow="О проекте" title="JANJUREK — цифровой мемориал" />
            <p className="text-base leading-8 text-muted-foreground">
              JANJUREK — это цифровой мемориал, созданный в память о предках и продолжателях рода. Мы
              помогаем семьям хранить документы, фото, видео и воспоминания в удобном формате, связываем
              поколения через родословные деревья и делимся историями с близкими.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              Каждая страница памяти — это живая история, дополненная свидетельствами родных и друзей.
              Проект развивает культуру бережного отношения к семейным архивам.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${PANEL} p-8`}>
              <h3 className="font-serif text-xl text-foreground">Что мы предлагаем</h3>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                {[
                  "Структурированное хранение семейных архивов",
                  "Интерактивные древа с навигацией по родственникам",
                  "Разделы для фото, видео и документов",
                  "Настраиваемые шаблоны страниц памяти",
                  "Поддержку по сбору и оцифровке материалов",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ── Guide ── */}
        <section id="guide" className="space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow="Как это работает"
              title="Инструкция по запуску страницы"
              description="Следуйте простым шагам, чтобы подготовить материалы и передать их команде JANJUREK."
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {guideSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className={`${PANEL} h-full p-8`}>
                  <span className="font-serif text-4xl text-gold/80">0{step.order}</span>
                  <h3 className="mt-4 font-serif text-xl text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Contacts ── */}
        <section id="contacts" className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="space-y-6">
            <SectionHeading
              eyebrow="Связь"
              title="Контакты команды"
              description="Мы отвечаем на сообщения в рабочие дни с 10:00 до 18:00 по времени Астаны."
            />
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</dt>
                <dd className="mt-1">
                  <a className="text-gold underline-offset-4 hover:underline" href="mailto:memory@janjurek.kz">
                    memory@janjurek.kz
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Телефон</dt>
                <dd className="mt-1">
                  <a className="text-gold underline-offset-4 hover:underline" href="tel:+77000000000">
                    +7 (700) 000-00-00
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Социальные сети</dt>
                <dd className="mt-2 flex gap-4">
                  <a
                    className="text-gold underline-offset-4 hover:underline"
                    href="https://wa.me/77000000000"
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
          <Reveal delay={0.1}>
            <div className={`${PANEL} flex h-full flex-col p-8`}>
              <h3 className="font-serif text-xl text-foreground">Хотите узнать о запуске?</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                Напишите нам с пометкой «Janjurek» и кратко опишите, чью историю хотите сохранить. Мы
                сообщим вам, когда сервис станет доступен.
              </p>
              <Button asChild className="mt-6 w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="mailto:memory@janjurek.kz?subject=Запрос%20на%20старт%20Janjurek">
                  Отправить письмо
                </a>
              </Button>
            </div>
          </Reveal>
        </section>
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

const guideSteps = [
  {
    order: 1,
    title: "Соберите материалы",
    description:
      "Подготовьте фотографии, видеозаписи, документы и устные воспоминания родных. Чем подробнее материалы, тем живее получится история.",
  },
  {
    order: 2,
    title: "Опишите биографию",
    description:
      "Зафиксируйте ключевые даты, места, родовые связи, трудовой путь, награды и семейные традиции. Используйте подсказки нашей анкеты.",
  },
  {
    order: 3,
    title: "Передайте данные команде",
    description:
      "Напишите на memory@janjurek.kz или в мессенджер. Мы поможем структурировать архив и сообщим, когда страница памяти будет опубликована.",
  },
];
