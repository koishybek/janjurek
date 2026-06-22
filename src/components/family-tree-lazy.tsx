"use client";

import { lazy, Suspense, type ReactNode } from "react";
import type { FamilyTreeProps } from "@/components/family-tree";

const Tree = lazy(() => import("@/components/family-tree").then((mod) => ({ default: mod.FamilyTree })));

type FamilyTreeLazyProps = FamilyTreeProps & {
  fallback?: ReactNode;
};

export function FamilyTreeLazy({ fallback, ...props }: FamilyTreeLazyProps) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border/40 p-12 text-sm text-muted-foreground">
            Загрузка родового древа...
          </div>
        )
      }
    >
      <Tree {...props} />
    </Suspense>
  );
}
