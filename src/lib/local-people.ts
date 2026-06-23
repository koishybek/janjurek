import type { Person } from "@data/people";

/**
 * Lightweight localStorage store for pages created via the public constructor.
 * Lets the demo work end-to-end (create → open link/QR) even without a backend.
 * When Firebase is configured the Firestore copy is the source of truth.
 */
const KEY = "janjurek:createdPeople";

export function getLocalPeople(): Person[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Person[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalPerson(person: Person): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalPeople().filter((p) => p.slug !== person.slug);
    window.localStorage.setItem(KEY, JSON.stringify([person, ...existing]));
  } catch {
    /* storage may be unavailable (private mode / quota) */
  }
}

export function getLocalPersonBySlug(slug: string): Person | null {
  return getLocalPeople().find((p) => p.slug === slug) ?? null;
}
