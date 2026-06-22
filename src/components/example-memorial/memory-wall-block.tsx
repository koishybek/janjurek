import type { MemoryPost } from "@data/examplePerson";
import { Heart, MessageCircle } from "lucide-react";

type MemoryWallBlockProps = {
  posts: MemoryPost[];
};

export function MemoryWallBlock({ posts }: MemoryWallBlockProps) {
  if (posts.length === 0) return null;

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
            Воспоминания
          </p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">
            Стена памяти
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Сообщения оставлены близкими и друзьями. Добавление новых записей
            откроется позже.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {sorted.length} {pluralPosts(sorted.length)}
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {sorted.map((post) => (
          <article
            key={post.id}
            className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20"
          >
            <header className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {post.author}
                </h3>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              </div>
              {typeof post.likes === "number" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                  <Heart className="h-3.5 w-3.5 text-gold" aria-hidden />
                  {post.likes}
                </span>
              ) : (
                <span className="text-xs uppercase tracking-wide text-muted-foreground/70">
                  Воспоминание
                </span>
              )}
            </header>
            <p className="text-sm leading-6 text-muted-foreground">
              {post.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function pluralPosts(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "запись";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "записи";
  return "записей";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
