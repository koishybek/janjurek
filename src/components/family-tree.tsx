"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Edge, Person } from "@data/people";
import { buildTree, type TreeNode } from "@/lib/family-tree-model";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FamilyTreeProps = {
  rootId: string;
  people: Person[];
  relations: Edge[];
  variant?: "preview" | "full";
};

export function FamilyTree({ rootId, people, relations, variant = "full" }: FamilyTreeProps) {
  const router = useRouter();

  const tree = useMemo<TreeNode | null>(() => buildTree(rootId, people, relations), [rootId, people, relations]);

  if (!tree) {
    return (
      <Card className="rounded-3xl border-dashed border-border/40 bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
        Родовое древо пока не заполнено
      </Card>
    );
  }

  const depthLimit = variant === "preview" ? 1 : Infinity;

  return (
    <div className="relative overflow-x-auto pb-6">
      <div className="mx-auto flex w-max flex-col items-center gap-10">
        <TreeNodeCard node={tree} depth={0} depthLimit={depthLimit} onNavigate={(slug) => router.push(`/memory/${slug}`)} />
      </div>
    </div>
  );
}

type TreeNodeCardProps = {
  node: TreeNode;
  depth: number;
  depthLimit: number;
  onNavigate: (slug: string) => void;
};

function TreeNodeCard({ node, depth, depthLimit, onNavigate }: TreeNodeCardProps) {
  const person = node.person;

  if (!person) {
    return null;
  }

  const showChildren = depth < depthLimit && node.children.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <PersonButton person={person} onNavigate={onNavigate} />
        {node.spouse ? (
          <>
            <span className="text-xl text-gold/70" title="в браке">
              ⚭<span className="sr-only">в браке с</span>
            </span>
            <PersonButton person={node.spouse} onNavigate={onNavigate} />
          </>
        ) : null}
      </div>
      {showChildren ? (
        <div className="relative flex flex-wrap items-start justify-center gap-8 lg:gap-12">
          <span className="absolute top-[-2rem] left-1/2 h-8 w-px -translate-x-1/2 bg-border/50" aria-hidden />
          {node.children.map((child, index) => (
            <div key={child.person?.id ?? `virtual-${index}`} className="relative flex flex-col items-center">
              <span className="absolute -top-8 h-8 w-px bg-border/50" aria-hidden />
              <TreeNodeCard node={child} depth={depth + 1} depthLimit={depthLimit} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type PersonButtonProps = {
  person: Person;
  onNavigate: (slug: string) => void;
};

function PersonButton({ person, onNavigate }: PersonButtonProps) {
  const canNavigate = Boolean(person.slug);

  return (
    <button
      type="button"
      onClick={() => canNavigate && onNavigate(person.slug)}
      className={cn(
        "min-w-[220px] rounded-3xl border border-border/40 bg-secondary/40 p-4 text-left shadow-lg transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        canNavigate ? "cursor-pointer" : "cursor-default"
      )}
      aria-label={`Открыть страницу памяти: ${person.lastName} ${person.firstName}`}
    >
      <p className="font-serif text-lg text-accent">{[person.lastName, person.firstName].filter(Boolean).join(" ")}</p>
      <p className="text-sm text-muted-foreground">{person.patronymic ?? "—"}</p>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground/80">{person.years ?? "Годы не указаны"}</p>
    </button>
  );
}
