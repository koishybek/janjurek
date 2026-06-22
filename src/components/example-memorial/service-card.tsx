import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ExampleMemorial } from "@data/examplePerson";
import { Calendar, MapPin, Video } from "lucide-react";

type ServiceCardProps = {
  service?: ExampleMemorial["service"];
};

export function ServiceCard({ service }: ServiceCardProps) {
  if (!service) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">
        Прощание
      </p>
      <h2 className="mt-3 font-serif text-3xl text-foreground">Церемония</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Пожалуйста, поделитесь этой информацией с близкими. Онлайн-формат RSVP
        появится позже.
      </p>
      <div className="mt-6 space-y-6">
        <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-gold" aria-hidden />
            <span>{service.place}</span>
          </div>
          {service.address ? (
            <p className="pl-6 text-sm text-muted-foreground/80">
              {service.address}
            </p>
          ) : null}
          {service.date ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-gold" aria-hidden />
              <span>{formatDate(service.date)}</span>
            </div>
          ) : null}
          {service.virtualUrl ? (
            <a
              href={service.virtualUrl}
              className="inline-flex items-center gap-2 text-sm text-gold underline-offset-4 hover:underline"
            >
              <Video className="h-4 w-4" aria-hidden />
              Виртуальное событие
            </a>
          ) : null}
        </div>
        <form className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Ваше имя"
            disabled
            className="rounded-lg border-dashed border-white/10 bg-white/[0.02]"
          />
          <Input
            placeholder="Email для уведомления"
            type="email"
            disabled
            className="rounded-lg border-dashed border-white/10 bg-white/[0.02]"
          />
          <Textarea
            placeholder="Сообщение для семьи"
            className="rounded-lg border-dashed border-white/10 bg-white/[0.02] md:col-span-2"
            disabled
          />
          <Button
            type="button"
            disabled
            title="Доступно позже"
            className="rounded-lg bg-gold text-background hover:bg-gold/90 md:col-span-2"
          >
            RSVP (скоро)
          </Button>
        </form>
      </div>
    </section>
  );
}

function formatDate(input: string) {
  const [date, time] = input.split(" ");
  const parsed = new Date(`${date}T${time ?? "00:00"}`);
  if (Number.isNaN(parsed.getTime())) return input;
  return parsed.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
