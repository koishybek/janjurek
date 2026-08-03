"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Edge, Person } from "@data/people";
import {
  buildTree,
  toGenerations,
  type GenerationRow,
  type TreeNode,
} from "@/lib/family-tree-model";
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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const roman = (n: number) => ROMAN[n - 1] ?? `${n}-е`;

const ANCESTOR_TIERS = [
  "поколение родителей",
  "поколение дедов и бабушек",
  "поколение прадедов",
  "поколение прапрадедов",
];
const DESCENDANT_TIERS = [
  "поколение детей",
  "поколение внуков",
  "поколение правнуков",
  "поколение праправнуков",
];

/**
 * Name the generation *tier* relative to the focused person, never the kinship of
 * the people standing in it. A row holds everyone at that depth of the clan —
 * uncles, cousins, in-laws — so "Родители" would be a false claim about most of
 * them. "Поколение родителей" is true of the tier and of everyone in it.
 */
function tierLabel(offset: number): string {
  if (offset === 0) return "это поколение";
  if (offset < 0) {
    const step = Math.abs(offset);
    return ANCESTOR_TIERS[step - 1] ?? `${step} поколений выше`;
  }
  return DESCENDANT_TIERS[offset - 1] ?? `${offset} поколений ниже`;
}

export function FamilyTree({ rootId, people, relations, variant = "full", focusId }: FamilyTreeProps) {
  const router = useRouter();

  const rows = useMemo<GenerationRow[]>(
    () => toGenerations(buildTree(rootId, people, relations)),
    [rootId, people, relations]
  );

  const focusDepth = useMemo(() => {
    if (!focusId) return null;
    for (const row of rows) {
      for (const group of row.groups) {
        for (const node of group.nodes) {
          if (node.person?.id === focusId || node.spouse?.id === focusId) {
            return row.depth;
          }
        }
      }
    }
    return null;
  }, [rows, focusId]);

  if (rows.length === 0) {
    return (
      <Card className="rounded-3xl border-dashed border-border/40 bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
        Родовое древо пока не заполнено
      </Card>
    );
  }

  const visibleRows = variant === "preview" ? rows.slice(0, 2) : rows;
  const navigate = (slug: string) => router.push(`/memory/${slug}`);

  return (
    <div className="relative overflow-x-auto pb-4">
      <div className="mx-auto flex w-full min-w-max flex-col items-stretch">
        {visibleRows.map((row, rowIndex) => {
          // Parentage is ambiguous when the generation above held several couples;
          // that is what the caption resolves, so it is what decides showing it.
          const parentsAbove =
            rowIndex > 0
              ? visibleRows[rowIndex - 1].groups.reduce((sum, g) => sum + g.nodes.length, 0)
              : 0;
          const showParentLabels = row.groups.length > 1 || parentsAbove > 1;

          return (
            <div key={row.depth}>
              {rowIndex > 0 ? <Connector /> : null}

              <div className="flex items-center gap-4">
                <span className="h-px w-6 shrink-0 bg-gold/30" aria-hidden />
                <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.24em] text-gold/70">
                  {roman(row.depth + 1)} поколение
                  {focusDepth !== null ? (
                    <span className="text-muted-foreground"> · {tierLabel(row.depth - focusDepth)}</span>
                  ) : null}
                </p>
                <span className="h-px flex-1 bg-gold/15" aria-hidden />
              </div>

              <div className="mt-5 flex flex-wrap items-start justify-center gap-x-12 gap-y-8">
                {row.groups.map((group, groupIndex) => (
                  // Index, not parentLabel: two couples in one row can share a name.
                  <div key={groupIndex} className="space-y-3">
                    {showParentLabels && group.parentLabel ? (
                      <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                        дети · {group.parentLabel}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-start justify-center gap-6">
                      {group.nodes
                        .filter((node) => node.person)
                        .map((node) => (
                          <CoupleCard
                            key={node.person!.id}
                            node={node}
                            focusId={focusId}
                            onNavigate={navigate}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {variant === "full" && focusDepth !== null && focusDepth === rows.length - 1 ? (
          <p className="mx-auto mt-10 max-w-md text-center text-xs leading-6 text-muted-foreground/70">
            Следующее поколение пока не записано. Если у вас есть сведения о детях —
            передайте их менеджеру, и линия продолжится.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Connector() {
  return <span className="mx-auto my-6 block h-10 w-px bg-gold/25" aria-hidden />;
}

type CoupleCardProps = {
  node: TreeNode;
  focusId?: string;
  onNavigate: (slug: string) => void;
};

function CoupleCard({ node, focusId, onNavigate }: CoupleCardProps) {
  if (!node.person) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <PersonButton person={node.person} focusId={focusId} onNavigate={onNavigate} />
      {node.spouse ? (
        <>
          <span className="flex items-center text-xl text-gold/70">
            <span aria-hidden>⚭</span>
            <span className="sr-only">в браке с</span>
          </span>
          <PersonButton person={node.spouse} focusId={focusId} onNavigate={onNavigate} />
        </>
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
          ? "border-gold/70 bg-gold/[0.07] ring-1 ring-gold/40 cursor-default"
          : "border-border/40 bg-secondary/40 hover:border-accent/70",
        canNavigate ? "cursor-pointer" : "cursor-default"
      )}
      aria-label={
        isFocus
          ? `${person.lastName} ${person.firstName} — эта страница`
          : canNavigate
            ? `Открыть страницу памяти: ${person.lastName} ${person.firstName}`
            : `${person.lastName} ${person.firstName} — страницы памяти пока нет`
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
