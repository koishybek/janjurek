"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Person } from "@data/people";
import { fetchPersonBySlug } from "@/lib/firestore-people";
import { isFirebaseConfigured } from "@/lib/firebase";
import { Footer } from "@/components/footer";
import { PersonCard } from "@/components/person-card";
import { PersonTable } from "@/components/person-table";
import { MediaTabs } from "@/components/media-tabs";
import { FamilyTreeLazy } from "@/components/family-tree-lazy";
import { people as seedPeople, relations } from "@data/people";
import { SectionTabs } from "@/components/example-memorial/section-tabs";
import { HeroSection } from "@/components/example-memorial/hero-section";
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
  const [loading, setLoading] = useState(!initialPerson && isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const person = initialPerson ?? remotePerson;
  const shouldFetch = !initialPerson && isFirebaseConfigured;

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setRemotePerson(null);
      setLoading(true);
      setError(null);
    });
    fetchPersonBySlug(slug)
      .then((result) => {
        if (cancelled) return;
        if (result) {
          setRemotePerson(result);
        } else {
          setError("Страница не найдена.");
        }
      })
      .catch((reason) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [shouldFetch, slug]);

  const sections = useMemo(() => {
    const list = [
      { id: "biography", label: "Биография" },
      person?.media ? { id: "media", label: "Медиа" } : null,
      { id: "records", label: "Архив" },
    ].filter((section): section is { id: string; label: string } => Boolean(section));
    const hasRelations =
      person && relations.some((edge) => edge.fromId === person.id || edge.toId === person.id);
    if (hasRelations) {
      list.push({ id: "tree", label: "Родословная" });
    }
    return list;
  }, [person]);

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
    const hasRelations =
      relations.some((edge) => edge.fromId === person.id || edge.toId === person.id) &&
      seedPeople.some((p) => p.id === person.id);

    return (
      <>
        <HeroSection name={fullName} years={person.years ?? "—"} location={person.birthPlace} />
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
            <Card className="rounded-xl border-white/10 bg-white/[0.02] p-8">
              <CardContent className="space-y-6 p-0">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">Архив</p>
                  <h2 className="font-serif text-3xl text-foreground">Биографические данные</h2>
                </div>
                <PersonTable person={person} />
              </CardContent>
            </Card>
          </section>
          {hasRelations ? (
            <section id="tree" className="scroll-mt-32 space-y-8">
              <Separator className="bg-white/10" />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/80">Родословная</p>
                <h2 className="font-serif text-3xl text-foreground">Родовое древо</h2>
                <p className="text-sm text-muted-foreground">
                  Нажмите на родственников, чтобы перейти к их страницам (когда они появятся).
                </p>
              </div>
              <FamilyTreeLazy
                rootId={person.id}
                people={seedPeople}
                relations={relations}
                variant="full"
              />
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
