"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Person } from "@data/people";

type PersonTableProps = {
  person: Person;
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
  | "fatherName"
  | "studyPlace"
  | "mainOccupation"
  | "awards"
  | "extraInfo"
  | "spouse"
  | "children";

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
  { key: "birthPlace", label: "Место рождения" },
  { key: "burialPlace", label: "Место захоронения" },
  { key: "coords", label: "Координаты захоронения (ссылка)" },
  { key: "fatherName", label: "Отец" },
  { key: "studyPlace", label: "Место учёбы" },
  { key: "mainOccupation", label: "Кем работал (в основном)" },
  { key: "awards", label: "Награды" },
  { key: "extraInfo", label: "Доп. информация" },
  { key: "spouse", label: "Жена/Муж" },
  { key: "children", label: "Дети" },
];

export function PersonTable({ person }: PersonTableProps) {
  return (
    <Table className="text-sm leading-6 text-foreground/90">
      <TableBody>
        {fieldLabels.map(({ key, label }) => {
          const value = resolveValue(person, key);
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

function resolveValue(person: Person, key: DisplayKey | "coords"): ReactNode {
  if (key === "coords") {
    return person.burialCoordsUrl ? (
      <Link href={person.burialCoordsUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline-offset-4 hover:underline">
        Открыть в картах
      </Link>
    ) : (
      "—"
    );
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
