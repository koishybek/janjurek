import { collection, doc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import type { Person } from "@data/people";
import { firebaseCollections, firestore, isFirebaseConfigured } from "@/lib/firebase";

const ensureFirestore = () => {
  if (!isFirebaseConfigured || !firestore) {
    throw new Error("Firebase не сконфигурирован. Укажите переменные окружения.");
  }
  return firestore;
};

export async function fetchPeopleFromFirestore(): Promise<Person[]> {
  const db = ensureFirestore();
  const snapshot = await getDocs(collection(db, firebaseCollections.people));
  return snapshot.docs.map((item) => {
    const data = item.data() as Person;
    return {
      ...data,
      id: data.id || item.id,
      slug: data.slug || item.id,
    };
  });
}

export async function savePersonToFirestore(person: Person) {
  const db = ensureFirestore();
  const ref = doc(collection(db, firebaseCollections.people), person.id);
  await setDoc(
    ref,
    {
      ...person,
      updatedAt: serverTimestamp(),
      createdAt: person["createdAt"] ?? serverTimestamp(),
    },
    { merge: true }
  );
}

export async function fetchPersonBySlug(slug: string): Promise<Person | null> {
  const db = ensureFirestore();
  const peopleRef = collection(db, firebaseCollections.people);
  const q = query(peopleRef, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const personDoc = snapshot.docs[0];
  const data = personDoc.data() as Person;
  return {
    ...data,
    id: data.id || personDoc.id,
    slug: data.slug || personDoc.id,
  };
}
