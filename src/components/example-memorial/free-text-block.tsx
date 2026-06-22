type FreeTextBlockProps = {
  text?: string;
};

export function FreeTextBlock({ text }: FreeTextBlockProps) {
  if (!text) return null;

  const paragraphs = text
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
        О жизни
      </p>
      <h2 className="mt-3 font-serif text-3xl text-foreground">История</h2>
      <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))
        ) : (
          <p className="text-muted-foreground/70">Пока нет записей</p>
        )}
      </div>
    </section>
  );
}
