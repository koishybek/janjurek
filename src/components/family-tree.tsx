"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Edge, Person } from "@data/people";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FamilyTreeProps = {
  rootId: string;
  people: Person[];
  relations: Edge[];
  variant?: "preview" | "full";
};

type TreeNode = {
  person: Person | undefined;
  children: TreeNode[];
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

  const canNavigate = Boolean(person.slug);
  const showChildren = depth < depthLimit && node.children.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
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

function buildTree(rootId: string, people: Person[], relations: Edge[]): TreeNode | null {
  const personMap = new Map(people.map((item) => [item.id, item]));
  const childrenMap = new Map<string, string[]>();

  relations.forEach((relation) => {
    if (relation.relation === "parent") {
      const existing = childrenMap.get(relation.fromId) ?? [];
      childrenMap.set(relation.fromId, [...existing, relation.toId]);
    }
  });

  if (!personMap.has(rootId)) {
    return null;
  }

  const build = (id: string): TreeNode => {
    const person = personMap.get(id);
    const childrenIds = childrenMap.get(id) ?? [];
    return {
      person,
      children: childrenIds.map((childId) => build(childId)),
    };
  };

  return build(rootId);
}
