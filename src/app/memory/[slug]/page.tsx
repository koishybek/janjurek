import type { Metadata } from "next";
import { people } from "@data/people";
import { MemoryPageClient } from "./memory-page-client";

type MemoryPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Only the memorials in `people` exist. Anything else — including the removed demo
 * page — must answer a real 404, otherwise deleted URLs keep returning HTTP 200
 * and stay indexed. Flip back to `true` once a backend can serve pages that are
 * not in the static list.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: MemoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = people.find((item) => item.slug === slug);

  if (!person) {
    return {
      title: "Страница памяти — JANJUREK",
      description: "Просмотр индивидуальной страницы памяти на JANJUREK.",
    };
  }

  const fullName = [person.lastName, person.firstName, person.patronymic]
    .filter(Boolean)
    .join(" ");

  return {
    title: `${fullName} — страница памяти JANJUREK`,
    description: `Страница памяти ${fullName}. Архив, фотографии, документы и родовое древо.`,
  };
}

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { slug } = await params;
  const person = people.find((item) => item.slug === slug) ?? null;

  return <MemoryPageClient initialPerson={person} slug={slug} />;
}
