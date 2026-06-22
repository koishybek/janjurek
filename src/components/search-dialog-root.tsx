"use client";

import { SearchDialogProvider } from "@/components/search-dialog-context";
import { SearchCommandDialog } from "@/components/search-command";

type SearchDialogRootProps = {
  children: React.ReactNode;
};

export function SearchDialogRoot({ children }: SearchDialogRootProps) {
  return (
    <SearchDialogProvider>
      {children}
      <SearchCommandDialog />
    </SearchDialogProvider>
  );
}
