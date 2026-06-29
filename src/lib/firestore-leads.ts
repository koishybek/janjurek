import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseCollections, firestore, isFirebaseConfigured, whatsappNumber } from "@/lib/firebase";

export type Lead = {
  contactName: string;
  phone: string;
  deceasedName: string;
  years?: string;
  burialPlace?: string;
  youtubeUrl?: string;
  description?: string;
};

/**
 * Save a memorial request. Persists to Firestore `leads` when configured (free
 * Spark plan is enough); always resolves so the WhatsApp hand-off still happens.
 */
export async function submitLead(lead: Lead): Promise<boolean> {
  if (!isFirebaseConfigured || !firestore) return false;
  try {
    await addDoc(collection(firestore, firebaseCollections.leads), {
      ...lead,
      status: "new",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

/** Build the prefilled WhatsApp deep link that forwards the whole request. */
export function buildWhatsappLink(lead: Lead): string {
  const lines = [
    "Новая заявка — JANJUREK",
    "",
    `Имя: ${lead.contactName}`,
    `Телефон: ${lead.phone}`,
    "",
    `Память о: ${lead.deceasedName}`,
    lead.years ? `Годы жизни: ${lead.years}` : null,
    lead.burialPlace ? `Место захоронения: ${lead.burialPlace}` : null,
    lead.youtubeUrl ? `Видео (YouTube): ${lead.youtubeUrl}` : null,
    lead.description ? `\nОписание:\n${lead.description}` : null,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}
