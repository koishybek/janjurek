import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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
 * is not configured, and the wall then renders nothing at all.
 *
 * Read-only by design: there is no public submit path, so a memorial cannot
 * receive an unmoderated note.
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
