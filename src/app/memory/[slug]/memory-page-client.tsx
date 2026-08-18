"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Person } from "@data/people";
import { fetchPersonBySlug } from "@/lib/firestore-people";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getLocalPersonBySlug } from "@/lib/local-people";
import { Footer } from "@/components/footer";
import { PersonCard } from "@/components/person-card";
import { PersonTable } from "@/components/person-table";
import { MediaTabs } from "@/components/media-tabs";
import { FamilyTreeLazy } from "@/components/family-tree-lazy";
import { KinshipLinks } from "@/components/kinship-links";
import { MemoryWall } from "@/components/memory-wall";
import { fetchApprovedTributes, type Tribute } from "@/lib/firestore-tributes";
import { ShareQR } from "@/components/share-qr";
import { people as seedPeople, relations } from "@data/people";
import { buildRelationIndex, findRootAncestor, getRelatives } from "@/lib/family-tree-model";
import { SectionTabs } from "@/components/memorial/section-tabs";
import { HeroSection } from "@/components/memorial/hero-section";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

type MemoryPageClientProps = {
  initialPerson: Person | null;
  slug: string;
};

export function MemoryPageClient({ initialPerson, slug }: MemoryPageClientProps) {
  const [remotePerson, setRemotePerson] = useState<Person | null>(null);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(!initialPerson);
  const [error, setError] = useState<string | null>(null);

  const person = initialPerson ?? remotePerson;

  useEffect(() => {
    if (initialPerson) return;
    let cancelled = false;

    const resolve = async (): Promise<Person | null> => {
      if (isFirebaseConfigured) {
        const remote = await fetchPersonBySlug(slug);
        if (remote) return remote;
      }
      // Fallback for pages created via the public constructor (demo store).
      return getLocalPersonBySlug(slug);
    };

    resolve()
      .then((result) => {
        if (cancelled) return;
        if (result) setRemotePerson(result);
        else setError("Страница не найдена.");
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialPerson, slug]);

  // Curated notes only: there is no public submit path, so an empty result simply
  // means this memorial has none and the whole section stays hidden.
  useEffect(() => {
    if (!person) return;
    let cancelled = false;
    fetchApprovedTributes(person.slug)
      .then((list) => {
        if (!cancelled) setTributes(list);
      })
      .catch(() => {
        /* graceful: an unreachable backend just leaves the wall hidden */
      });
    return () => {
      cancelled = true;
    };
  }, [person]);

  const relationIndex = useMemo(() => buildRelationIndex(relations), []);

  const relatives = useMemo(
    () => (person ? getRelatives(person.id, seedPeople, relationIndex) : null),
    [person, relationIndex]
  );

  const sections = useMemo(() => {
    const list = [
      { id: "biography", label: "Биография" },
      person?.media ? { id: "media", label: "Медиа" } : null,
      { id: "records", label: "Архив" },
      { id: "tree", label: "Родословная" },
      tributes.length > 0 ? { id: "tributes", label: "Заметки" } : null,
    ].filter((section): section is { id: string; label: string } => Boolean(section));
    return list;
  }, [person, tributes]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-muted-foreground">
          Загрузка данных из архива JANJUREK…
        </div>
      );
    }

    if (!person) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-muted-foreground">
          {error ?? "Страница не найдена."}
        </div>
      );
    }

    const fullName = [person.lastName, person.firstName, person.patronymic].filter(Boolean).join(" ");
    // Root the tree at the earliest known ancestor so the whole line is visible
    // and reachable, instead of showing this person as an orphan.
    const treeRootId = findRootAncestor(person.id, relationIndex);
    const hasRelations = relations.some((edge) => edge.fromId === person.id || edge.toId === person.id);
    // Name the line by the ancestor's recorded `rod`, not by a surname: someone who
    // married in carries another name, and a wife's surname is not the family's род.
    const lineRod = seedPeople.find((item) => item.id === treeRootId)?.rod;

    return (
      <>
        <HeroSection
          name={fullName}
          years={person.years ?? "—"}
          location={person.birthPlace}
          portrait={person.portrait}
        />
        <SectionTabs sections={sections} />
        <div className="space-y-20">
          <section id="biography" className="scroll-mt-32 space-y-8">
            <Separator className="bg-border/40" />
            <PersonCard person={person} />
          </section>
          {person.media ? (
            <section id="media" className="scroll-mt-32 space-y-8">
              <Separator className="bg-border/40" />
              <MediaTabs media={person.media} />
            </section>
          ) : null}
          <section id="records" className="scroll-mt-32 space-y-8">
            <Separator className="bg-white/10" />
            <Card className="rounded-2xl surface p-8">
              <CardContent className="space-y-6 p-0">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">Архив</p>
                  <h2 className="font-serif text-3xl text-foreground">Биографические данные</h2>
                </div>
                <PersonTable person={person} relatives={relatives ?? undefined} />
              </CardContent>
            </Card>
          </section>
          <section id="tree" className="scroll-mt-32 space-y-8">
            <Separator className="bg-white/10" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">Родословная</p>
              <h2 className="font-serif text-3xl text-foreground">Родовое древо</h2>
              <p className="max-w-2xl text-base text-muted-foreground">
                {lineRod ? `Поколения рода ${lineRod}` : "Связь поколений"} — от самого раннего
                известного предка. Нажмите на родственников, чтобы перейти к их страницам.
              </p>
            </div>
            {relatives ? <KinshipLinks relatives={relatives} /> : null}
            {hasRelations ? (
              <FamilyTreeLazy
                rootId={treeRootId}
                people={seedPeople}
                relations={relations}
                variant="full"
                focusId={person.id}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-muted-foreground">
                Родственные связи для этой страницы пока не добавлены.
              </div>
            )}
          </section>

          {tributes.length > 0 ? (
            <section id="tributes" className="scroll-mt-32 space-y-8">
              <Separator className="bg-white/10" />
              <MemoryWall personName={fullName} tributes={tributes} />
            </section>
          ) : null}
        </div>
        <div className="flex justify-end">
          <ButtonLink href="/" label="Вернуться на главную" />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container space-y-12 pb-24 pt-10 lg:space-y-16">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumb className="text-muted-foreground">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {person ? [person.lastName, person.firstName].filter(Boolean).join(" ") : "Загрузка..."}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {person ? <ShareQR title={[person.lastName, person.firstName].filter(Boolean).join(" ")} fileName={`janjurek-${person.slug}.png`} /> : null}
        </div>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

type ButtonLinkProps = {
  href: string;
  label: string;
};

function ButtonLink({ href, label }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-[hsl(var(--accent-foreground))] transition hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {label}
    </Link>
  );
}
