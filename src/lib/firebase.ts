import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "FIREBASE_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "janjurek.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "janjurek-memorial",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "janjurek-memorial.appspot.com",
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== "FIREBASE_API_KEY";

export const firebaseCollections = {
  people: process.env.NEXT_PUBLIC_FIREBASE_PEOPLE_COLLECTION ?? "people",
  relations: process.env.NEXT_PUBLIC_FIREBASE_RELATIONS_COLLECTION ?? "relations",
};

export const mediaRootFolder = process.env.NEXT_PUBLIC_FIREBASE_MEDIA_ROOT ?? "people";

export function buildMediaStoragePath(slug: string, fileName: string) {
  const safeSlug = slug || "new-person";
  return `${mediaRootFolder}/${safeSlug}/media/${fileName}`;
}

export function getAdminAccessCode() {
  return process.env.NEXT_PUBLIC_ADMIN_CODE ?? "JANJUREK";
}

let firebaseAppInstance: FirebaseApp | null = null;

if (isFirebaseConfigured) {
  firebaseAppInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp: FirebaseApp | null = firebaseAppInstance;

export const firestore: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
