"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Person } from "@data/people";
import type { Relatives } from "@/lib/family-tree-model";

type PersonTableProps = {
  person: Person;
  /** Relatives resolved from kinship edges. Their names become links. */
  relatives?: Relatives;
};

type DisplayKey =
  | "lastName"
  | "firstName"
  | "patronymic"
  | "zhuz"
  | "rod"
  | "plemya"
  | "rod2"
  | "rod3"
  | "years"
  | "birthPlace"
  | "burialPlace"
  | "causeOfDeath"
  | "fatherName"
  | "studyPlace"
  | "mainOccupation"
  | "awards"
  | "extraInfo"
  | "spouse"
  | "children"
  | "siblings";

const fieldLabels: Array<{ key: DisplayKey | "coords"; label: string }> = [
  { key: "lastName", label: "Фамилия" },
  { key: "firstName", label: "Имя" },
  { key: "patronymic", label: "Отчество" },
  { key: "zhuz", label: "Жуз" },
  { key: "rod", label: "Род" },
  { key: "plemya", label: "Племя" },
  { key: "rod2", label: "Род 2" },
  { key: "rod3", label: "Род 3" },
  { key: "years", label: "Годы жизни" },
  { key: "causeOfDeath", label: "Причина смерти" },
  { key: "birthPlace", label: "Место рождения" },
  { key: "burialPlace", label: "Место захоронения" },
  { key: "coords", label: "Координаты захоронения (ссылка)" },
  { key: "fatherName", label: "Отец" },
  { key: "studyPlace", label: "Место учёбы" },
  { key: "mainOccupation", label: "Кем работал (в основном)" },
  { key: "awards", label: "Награды" },
  { key: "extraInfo", label: "Доп. информация" },
  { key: "spouse", label: "Супруг/супруга" },
  { key: "children", label: "Дети" },
  { key: "siblings", label: "Братья/сёстры" },
];

export function PersonTable({ person, relatives }: PersonTableProps) {
  return (
    <Table className="text-sm leading-6 text-foreground/90">
      <TableBody>
        {fieldLabels.map(({ key, label }) => {
          const value = resolveValue(person, key, relatives);
          return (
            <TableRow key={key as string} className="border-white/10 hover:bg-white/[0.02]">
              <TableCell className="w-1/3 align-top text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </TableCell>
              <TableCell className="w-2/3 align-top">{value ?? "—"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const fullName = (item: Person) =>
  [item.lastName, item.firstName, item.patronymic].filter(Boolean).join(" ");

function PersonLink({ item }: { item: Person }) {
  return (
    <Link
      href={`/memory/${item.slug}`}
      className="text-gold underline-offset-4 hover:underline"
    >
      {fullName(item)}
    </Link>
  );
}

function PersonLinks({ items }: { items: Person[] }) {
  return (
    <span className="flex flex-wrap gap-x-2 gap-y-1">
      {items.map((item, index) => (
        <span key={item.id}>
          <PersonLink item={item} />
          {index < items.length - 1 ? "," : null}
        </span>
      ))}
    </span>
  );
}

function resolveValue(
  person: Person,
  key: DisplayKey | "coords",
  relatives?: Relatives
): ReactNode {
  if (key === "coords") {
    return person.burialCoordsUrl ? (
      <Link href={person.burialCoordsUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline-offset-4 hover:underline">
        Открыть в картах
      </Link>
    ) : (
      "—"
    );
  }

  // Kinship edges win over the free-text label: the text is written in several
  // different name orders, the edge points at an actual page.
  if (key === "fatherName" && relatives?.father) {
    return <PersonLink item={relatives.father} />;
  }

  if (key === "spouse" && relatives?.spouse) {
    return <PersonLink item={relatives.spouse} />;
  }

  if (key === "children" && relatives?.children.length) {
    return <PersonLinks items={relatives.children} />;
  }

  if (key === "siblings" && relatives?.siblings.length) {
    return <PersonLinks items={relatives.siblings} />;
  }

  const rawValue = person[key];

  if (!rawValue) {
    return "—";
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length > 0 ? rawValue.join(", ") : "—";
  }

  return rawValue;
}
