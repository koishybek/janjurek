import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/motion-primitives";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-7 bg-gold/50" aria-hidden />
          <p className="text-[13px] font-medium uppercase tracking-[0.32em] text-gold/90">{eyebrow}</p>
        </div>
      ) : null}
      <AnimatedText
        as="h2"
        text={title}
        className="font-serif text-[2rem] leading-[1.12] text-foreground sm:text-[2.75rem] lg:text-[3.25rem]"
      />
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-8 text-muted-foreground sm:text-[1.0625rem]",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
