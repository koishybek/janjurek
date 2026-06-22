"use client";

import { lazy, Suspense, type ReactNode } from "react";
import type { ExampleMemorial } from "@data/examplePerson";

const Tree = lazy(() =>
  import("./family-tree").then((mod) => ({ default: mod.FamilyTree }))
);

type FamilyTreeLazyProps = {
  data: ExampleMemorial["familyTree"];
  fallback?: ReactNode;
};

export function FamilyTreeLazy({ data, fallback }: FamilyTreeLazyProps) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border/30 p-12 text-sm text-muted-foreground">
            Загрузка родового древа...
          </div>
        )
      }
    >
      <Tree data={data} />
    </Suspense>
  );
}
