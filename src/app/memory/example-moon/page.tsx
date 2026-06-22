import Link from "next/link";
import { exampleMemorial } from "@data/examplePerson";
import { HeroSection } from "@/components/example-memorial/hero-section";
import { SectionTabs } from "@/components/example-memorial/section-tabs";
import { ObituaryBlock } from "@/components/example-memorial/obituary-block";
import { FreeTextBlock } from "@/components/example-memorial/free-text-block";
import { TimelineBlock } from "@/components/example-memorial/timeline-block";
import { GalleryBlock } from "@/components/example-memorial/gallery-block";
import { VideoListBlock } from "@/components/example-memorial/video-list-block";
import { MemoryWallBlock } from "@/components/example-memorial/memory-wall-block";
import { FamilyTreeLazy } from "@/components/example-memorial/family-tree-lazy";
import { FavoritesBlock } from "@/components/example-memorial/favorites-block";
import { Separator } from "@/components/ui/separator";

const sections = [
  { id: "obituary", label: "Некролог" },
  { id: "story", label: "Текст" },
  { id: "timeline", label: "Таймлайн" },
  { id: "gallery", label: "Галерея" },
  { id: "videos", label: "Видео" },
  { id: "memory", label: "Стена памяти" },
  { id: "tree", label: "Семейное древо" },
  { id: "favorites", label: "Избранное" },
] as const;

export default function ExampleMoonPage() {
  const memorial = exampleMemorial;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container space-y-16 pb-24 pt-10 md:space-y-20">
        <HeroSection
          name={memorial.name}
          years={memorial.years}
          location={memorial.location}
        />
        <SectionTabs sections={sections.map((item) => ({ ...item }))} />

        <div className="space-y-20">
          <section id="obituary" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <ObituaryBlock text={memorial.obituary} />
          </section>

          <section id="story" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <FreeTextBlock text={memorial.freeText} />
          </section>

          <section id="timeline" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <TimelineBlock items={memorial.timeline} />
          </section>

          <section id="gallery" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <GalleryBlock items={memorial.gallery} />
          </section>

          <section id="videos" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <VideoListBlock videos={memorial.videos} />
          </section>

          <section id="memory" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <MemoryWallBlock posts={memorial.memoryWall} />
          </section>

          <section id="tree" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <h2 className="text-3xl text-foreground">Семейное древо</h2>
            <FamilyTreeLazy data={memorial.familyTree} />
          </section>

          <section id="favorites" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <FavoritesBlock favorites={memorial.favorites} />
          </section>

        </div>
      </main>
      <footer className="border-t border-border/30">
        <div className="container flex flex-col gap-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} JANJUREK</p>
          <nav className="flex flex-wrap gap-4">
            <Link className="hover:text-accent" href="/#about">
              О нас
            </Link>
            <Link className="hover:text-accent" href="/#guide">
              Инструкция
            </Link>
            <Link className="hover:text-accent" href="/#contacts">
              Контакты
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
