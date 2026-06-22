import type { Edge, Person } from "./people";
import { people, relations } from "./people";

export type PersonDocument = Person & {
  documentId: string;
  storageFolder: string;
  createdAt: string;
  updatedAt: string;
};

export type MemorialDatabase = {
  collections: {
    people: PersonDocument[];
    relations: Edge[];
  };
};

const defaultTimestamp = "2024-01-01T00:00:00.000Z";

const withDocumentMeta = (person: Person): PersonDocument => ({
  ...person,
  documentId: person.id,
  storageFolder: `people/${person.slug}`,
  createdAt: defaultTimestamp,
  updatedAt: defaultTimestamp,
});

export const seedDatabase: MemorialDatabase = {
  collections: {
    people: people.map(withDocumentMeta),
    relations,
  },
};
