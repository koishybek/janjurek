import type { ExampleMemorial } from "@data/examplePerson";

type FavoritesBlockProps = {
  favorites: ExampleMemorial["favorites"];
};

export function FavoritesBlock({ favorites }: FavoritesBlockProps) {
  const entries = [
    { label: "Любимая цитата", value: favorites.saying },
    { label: "Любимая книга", value: favorites.book },
    { label: "Любимый фильм", value: favorites.movie },
    { label: "Любимое путешествие", value: favorites.travel },
    { label: "Любимый цвет", value: favorites.color },
    { label: "Факт о Давиде", value: favorites.fact },
  ].filter((item) => Boolean(item.value));

  if (entries.length === 0) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
        Личное
      </p>
      <h2 className="mt-3 font-serif text-3xl text-foreground">Избранное</h2>
      <dl className="mt-6 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <div
            key={entry.label}
            className="rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20"
          >
            <dt className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-gold/80">
              {entry.label}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-muted-foreground">
              {entry.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
