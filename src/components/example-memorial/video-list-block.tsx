import { Button } from "@/components/ui/button";
import { ExternalLink, Film } from "lucide-react";

type VideoListBlockProps = {
  videos: { title: string; url: string }[];
};

export function VideoListBlock({ videos }: VideoListBlockProps) {
  if (videos.length === 0) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
            Записи
          </p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">Видео</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {videos.length} видео
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {videos.map((video) => (
          <div
            key={video.url}
            className="flex flex-col justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 lg:flex-row lg:items-center"
          >
            <div className="flex items-start gap-3">
              <Film
                className="mt-0.5 h-5 w-5 shrink-0 text-gold/80"
                aria-hidden
              />
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Воспоминания доступны по внешней ссылке.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-gold/30 text-gold hover:border-gold/50"
            >
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                Открыть
              </a>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
