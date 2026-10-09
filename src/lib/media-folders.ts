import type { PersonMedia } from "@data/people";

/** Folders every memorial offers, taken from the family questionnaire. */
export const BASE_MEDIA_FOLDERS = ["От родных", "От друзей", "От коллег"] as const;

/**
 * Base folders first, then the person's own, then any folder an item names but
 * nobody declared — so a typo in the data still shows up instead of hiding files.
 */
export function listMediaFolders(media: PersonMedia): string[] {
  const named = [
    ...BASE_MEDIA_FOLDERS,
    ...(media.folders ?? []),
    ...media.videos.map((item) => item.folder),
    ...media.photos.map((item) => item.folder),
    ...media.documents.map((item) => item.folder),
  ];
  const seen = new Set<string>();
  const folders: string[] = [];
  for (const name of named) {
    const folder = name?.trim();
    if (!folder || seen.has(folder.toLowerCase())) continue;
    seen.add(folder.toLowerCase());
    folders.push(folder);
  }
  return folders;
}
