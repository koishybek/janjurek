import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { ExampleMemorial } from "@data/examplePerson";

type DonateBlockProps = {
  blurb?: ExampleMemorial["donateBlurb"];
};

export function DonateBlock({ blurb }: DonateBlockProps) {
  if (!blurb) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
        Поддержка
      </p>
      <h2 className="mt-3 font-serif text-3xl text-foreground">Пожертвовать</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Онлайн-пожертвования временно недоступны. Пожалуйста, свяжитесь с семьёй
        напрямую.
      </p>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">{blurb}</p>
      <div className="mt-6 flex items-center gap-3">
        <Button disabled className="rounded-lg bg-gold text-background hover:bg-gold/90">
          <Heart className="mr-2 h-4 w-4" aria-hidden />
          Пожертвовать
        </Button>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Доступно позже
        </span>
      </div>
    </section>
  );
}
