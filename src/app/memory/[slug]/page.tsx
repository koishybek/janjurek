import type { Metadata } from "next";
import { people } from "@data/people";
import { MemoryPageClient } from "./memory-page-client";

type MemoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

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
