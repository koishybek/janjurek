"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

type SearchDialogContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
};

const SearchDialogContext = createContext<SearchDialogContextValue | null>(null);

export function SearchDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<SearchDialogContextValue>(
    () => ({
      open,
      setOpen,
      openDialog: () => setOpen(true),
      closeDialog: () => setOpen(false),
      toggleDialog: () => setOpen((prev) => !prev),
    }),
    [open]
  );

  return <SearchDialogContext.Provider value={value}>{children}</SearchDialogContext.Provider>;
}

export function useSearchDialog() {
  const context = useContext(SearchDialogContext);
  if (!context) {
    throw new Error("useSearchDialog должен использоваться внутри SearchDialogProvider");
  }
  return context;
}
