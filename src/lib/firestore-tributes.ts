import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firebaseCollections, firestore, isFirebaseConfigured } from "@/lib/firebase";

export type Tribute = {
  id: string;
  slug: string;
  author: string;
  relation?: string;
  message: string;
  approved: boolean;
  createdAt?: string;
};

/**
 * Fetch approved tributes for a memory page. Returns an empty list when Firebase
 * is not configured (local/dev) so the UI can fall back to seed content.
 */
export async function fetchApprovedTributes(slug: string): Promise<Tribute[]> {
  if (!isFirebaseConfigured || !firestore) return [];
  const ref = collection(firestore, firebaseCollections.tributes);
  const q = query(
    ref,
    where("slug", "==", slug),
    where("approved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      slug: data.slug,
      author: data.author,
      relation: data.relation,
      message: data.message,
      approved: Boolean(data.approved),
      createdAt:
        typeof data.createdAt?.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : undefined,
    } satisfies Tribute;
  });
}

export type NewTribute = {
  slug: string;
  author: string;
  relation?: string;
  message: string;
};

/**
 * Submit a tribute for moderation. Returns true when it was persisted to
 * Firestore; false when running without a backend (the UI then shows it
 * optimistically as "pending moderation").
 */
export async function submitTribute(input: NewTribute): Promise<boolean> {
  if (!isFirebaseConfigured || !firestore) return false;
  const ref = collection(firestore, firebaseCollections.tributes);
  await addDoc(ref, {
    slug: input.slug,
    author: input.author,
    relation: input.relation ?? "",
    message: input.message,
    approved: false,
    createdAt: serverTimestamp(),
  });
  return true;
}
