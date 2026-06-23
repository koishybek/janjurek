"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SectionTabsProps = {
  sections: Array<{ id: string; label: string }>;
};

export function SectionTabs({ sections }: SectionTabsProps) {
  const [value, setValue] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 160;
      let active = sections[0]?.id ?? "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.offsetTop <= scrollY) {
          active = section.id;
        }
      }
      setValue(active);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [sections]);

  const handleSelect = (id: string) => {
    setValue(id);
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-30 -mx-4 bg-background/85 px-4 pb-3 pt-4 backdrop-blur-xl">
      <Tabs value={value} onValueChange={handleSelect} className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="flex min-w-full flex-nowrap items-center justify-start gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 sm:justify-center">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex-1 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-gold data-[state=active]:text-[hsl(var(--accent-foreground))] sm:flex-none"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
