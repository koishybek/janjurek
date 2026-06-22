"use client";

import { useState } from "react";
import type { ExampleMemorial, PersonNode } from "@data/examplePerson";
import { cn } from "@/lib/utils";

type FamilyTreeProps = {
  data: ExampleMemorial["familyTree"];
};

export function FamilyTree({ data }: FamilyTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="relative overflow-x-auto rounded-3xl border border-border/30 bg-secondary/40 p-8">
      <div className="mx-auto max-w-4xl space-y-16">
        <Row title="Родители">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            {data.parents.map((parent) => (
              <TreeCard
                key={parent.id}
                person={parent}
                active={activeId === parent.id}
                onSelect={setActiveId}
              />
            ))}
          </div>
        </Row>

        <div className="relative">
          <div
            className="absolute left-1/2 top-[-3rem] h-12 w-px -translate-x-1/2 bg-border/40"
            aria-hidden
          />
          <Row title="Давид и семья">
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
              <TreeCard
                person={data.self}
                active={activeId === data.self.id}
                onSelect={setActiveId}
                highlighted
              />
              {data.spouse ? (
                <TreeCard
                  person={data.spouse}
                  active={activeId === data.spouse.id}
                  onSelect={setActiveId}
                />
              ) : null}
            </div>
          </Row>
        </div>

        <div className="relative">
          <div
            className="absolute left-1/2 top-[-3rem] h-12 w-px -translate-x-1/2 bg-border/40"
            aria-hidden
          />
          <Row title="Дети">
            <div className="flex flex-wrap justify-center gap-6">
              {data.children.map((child) => (
                <TreeCard
                  key={child.id}
                  person={child}
                  active={activeId === child.id}
                  onSelect={setActiveId}
                />
              ))}
            </div>
          </Row>
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-muted-foreground">
        Нажмите на карточку, чтобы выделить родственника. Переход по ссылкам
        появится позже.
      </p>
    </div>
  );
}

type RowProps = {
  title: string;
  children: React.ReactNode;
};

function Row({ title, children }: RowProps) {
  return (
    <section className="space-y-6 text-center">
      <h3 className="text-xs uppercase tracking-[0.5em] text-accent">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

type TreeCardProps = {
  person: PersonNode;
  highlighted?: boolean;
  active: boolean;
  onSelect: (id: string) => void;
};

function TreeCard({ person, highlighted = false, active, onSelect }: TreeCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group min-w-[180px] rounded-3xl border border-border/30 bg-background/60 p-4 text-left shadow-lg outline-none transition hover:border-accent focus-visible:ring-2 focus-visible:ring-accent",
        highlighted && "border-accent bg-background/80",
        active && "ring-2 ring-accent"
      )}
      onClick={() => onSelect(person.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(person.id);
        }
      }}
    >
      <p className="font-serif text-lg text-foreground">{person.name}</p>
      <p className="text-sm text-muted-foreground">{person.years ?? "—"}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/80">
        {translateRelation(person.relation)}
      </p>
    </div>
  );
}

function translateRelation(relation: PersonNode["relation"]): string {
  switch (relation) {
    case "self":
      return "Наш герой";
    case "spouse":
      return "Супруг(а)";
    case "parent":
      return "Родитель";
    case "child":
      return "Ребёнок";
    default:
      return "Родственник";
  }
}
