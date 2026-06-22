import type { TimelineItem } from "@data/examplePerson";

type TimelineBlockProps = {
  items: TimelineItem[];
};

export function TimelineBlock({ items }: TimelineBlockProps) {
  if (items.length === 0) {
    return null;
  }

  const sorted = [...items].sort((a, b) => a.year - b.year);

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
            Хронология
          </p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">Таймлайн</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {sorted.length} {pluralEvents(sorted.length)}
        </span>
      </div>
      <div className="relative mt-8 pl-8">
        <span
          className="absolute left-2 top-1 h-[calc(100%-0.5rem)] w-px bg-white/10"
          aria-hidden
        />
        <ul className="space-y-8">
          {sorted.map((item) => (
            <li key={`${item.year}-${item.title}`} className="relative">
              <span
                className="absolute left-[-1.6rem] top-1 flex h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-gold bg-background"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-serif text-2xl font-semibold text-gold">
                  {item.year}
                </span>
                {item.date ? (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                ) : null}
                {item.place ? (
                  <span className="text-xs text-muted-foreground/70">
                    {item.place}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function pluralEvents(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "событие";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "события";
  return "событий";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
