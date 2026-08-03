import Link from "next/link";
import type { Person } from "@data/people";
import type { Relatives } from "@/lib/family-tree-model";

type KinshipLinksProps = {
  relatives: Relatives;
};

/**
 * Direct links to the closest relatives. The family tree below shows the whole
 * line, but this is the one-click path to a parent, spouse or child.
 */
export function KinshipLinks({ relatives }: KinshipLinksProps) {
  const groups: Array<{ label: string; people: Person[] }> = [
    { label: "Отец", people: relatives.father ? [relatives.father] : [] },
    { label: "Мать", people: relatives.mother ? [relatives.mother] : [] },
    { label: "Родители", people: relatives.otherParents },
    { label: "Супруг(а)", people: relatives.spouse ? [relatives.spouse] : [] },
    { label: "Дети", people: relatives.children },
  ].filter((group) => group.people.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          <dt className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {group.label}
          </dt>
          <dd className="flex flex-wrap gap-x-4 gap-y-1">
            {group.people.map((item) => (
              <Link
                key={item.id}
                href={`/memory/${item.slug}`}
                className="font-serif text-lg text-gold underline-offset-4 hover:underline"
              >
                {[item.lastName, item.firstName, item.patronymic].filter(Boolean).join(" ")}
              </Link>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
