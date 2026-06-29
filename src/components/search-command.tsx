"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePeopleData } from "@/hooks/use-people-data";
import { useSearchDialog } from "@/components/search-dialog-context";

type SearchCommandButtonProps = {
  label?: string;
  className?: string;
};

export function SearchCommandButton({ label = "Поиск памяти", className }: SearchCommandButtonProps) {
  const { openDialog } = useSearchDialog();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={openDialog}
      className={cn(
        "gap-2 rounded-2xl border-muted/60 bg-secondary/30 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground",
        className
      )}
    >
      <Search className="h-4 w-4" />
      <span>{label}</span>
      <kbd className="ml-auto hidden rounded-md border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground/80 sm:inline">
        ⌘K
      </kbd>
    </Button>
  );
}

export function SearchCommandDialog() {
  const { open, setOpen } = useSearchDialog();
  const { people, loading } = usePeopleData();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => setQuery(""));
    }
  }, [open]);

  const commandItems = useMemo(
    () =>
      people.map((person) => ({
        id: person.id,
        slug: person.slug,
        name: [person.lastName, person.firstName, person.patronymic].filter(Boolean).join(" "),
        description: person.mainOccupation ?? "Без описания",
      })),
    [people]
  );

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery("");
    window.open(`/memory/${slug}`, "_blank", "noopener,noreferrer");
  };

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length >= 3;
  const emptyText = showResults
    ? loading
      ? "Загрузка данных..."
      : "Совпадений не найдено"
    : "Введите минимум 3 символа.";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange} title="Поиск страницы памяти">
      <CommandInput
        autoFocus
        value={query}
        onValueChange={(value) => setQuery(value)}
        placeholder="Введите имя или фамилию..."
        aria-label="Поиск по базе памяти"
      />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        {showResults ? (
          <CommandGroup heading="Доступные страницы памяти">
            {commandItems.map((item) => (
              <CommandItem key={item.id} value={item.name} onSelect={() => handleSelect(item.slug)}>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
