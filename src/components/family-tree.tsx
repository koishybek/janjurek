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
  /** The person whose page this is — highlighted, and not a link to itself. */
  focusId?: string;
};

export function FamilyTree({ rootId, people, relations, variant = "full", focusId }: FamilyTreeProps) {
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
        <TreeNodeCard
          node={tree}
          depth={0}
          depthLimit={depthLimit}
          focusId={focusId}
          onNavigate={(slug) => router.push(`/memory/${slug}`)}
        />
      </div>
    </div>
  );
}

type TreeNodeCardProps = {
  node: TreeNode;
  depth: number;
  depthLimit: number;
  focusId?: string;
  onNavigate: (slug: string) => void;
};

function TreeNodeCard({ node, depth, depthLimit, focusId, onNavigate }: TreeNodeCardProps) {
  const person = node.person;

  if (!person) {
    return null;
  }

  const showChildren = depth < depthLimit && node.children.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <PersonButton person={person} focusId={focusId} onNavigate={onNavigate} />
        {node.spouse ? (
          <>
            <span className="text-xl text-gold/70" title="в браке">
              ⚭<span className="sr-only">в браке с</span>
            </span>
            <PersonButton person={node.spouse} focusId={focusId} onNavigate={onNavigate} />
          </>
        ) : null}
      </div>
      {showChildren ? (
        <div className="relative flex flex-wrap items-start justify-center gap-8 lg:gap-12">
          <span className="absolute top-[-2rem] left-1/2 h-8 w-px -translate-x-1/2 bg-border/50" aria-hidden />
          {node.children.map((child, index) => (
            <div key={child.person?.id ?? `virtual-${index}`} className="relative flex flex-col items-center">
              <span className="absolute -top-8 h-8 w-px bg-border/50" aria-hidden />
              <TreeNodeCard
                node={child}
                depth={depth + 1}
                depthLimit={depthLimit}
                focusId={focusId}
                onNavigate={onNavigate}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type PersonButtonProps = {
  person: Person;
  focusId?: string;
  onNavigate: (slug: string) => void;
};

function PersonButton({ person, focusId, onNavigate }: PersonButtonProps) {
  const isFocus = Boolean(focusId) && person.id === focusId;
  const canNavigate = Boolean(person.slug) && !isFocus;

  return (
    <button
      type="button"
      onClick={() => canNavigate && onNavigate(person.slug)}
      aria-current={isFocus ? "page" : undefined}
      className={cn(
        "min-w-[220px] rounded-3xl border p-4 text-left shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isFocus
          ? "border-gold/70 bg-gold/[0.07] cursor-default"
          : "border-border/40 bg-secondary/40 hover:border-accent",
        canNavigate ? "cursor-pointer" : "cursor-default"
      )}
      aria-label={
        isFocus
          ? `${person.lastName} ${person.firstName} — эта страница`
          : `Открыть страницу памяти: ${person.lastName} ${person.firstName}`
      }
    >
      <p className={cn("font-serif text-lg", isFocus ? "text-gold" : "text-accent")}>
        {[person.lastName, person.firstName].filter(Boolean).join(" ")}
      </p>
      <p className="text-sm text-muted-foreground">{person.patronymic ?? "—"}</p>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground/80">{person.years ?? "Годы не указаны"}</p>
      {isFocus ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gold/80">Эта страница</p>
      ) : null}
    </button>
  );
}
