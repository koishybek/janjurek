import type { PersonMedia } from "@data/people";

/** Folders every memorial offers, taken from the family questionnaire. */
export const BASE_MEDIA_FOLDERS = ["От родных", "От друзей", "От коллег"] as const;

/** Nested folders are paths: "От родных/Диас" is «Диас» inside «От родных». */
export const FOLDER_SEPARATOR = "/";

export function normalizeFolderPath(path: string | undefined): string {
  return (path ?? "")
    .split(FOLDER_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(FOLDER_SEPARATOR);
}

const key = (path: string) => normalizeFolderPath(path).toLowerCase();

export const sameFolder = (a: string | undefined, b: string) => key(a ?? "") === key(b);

/** True for the folder itself and anything nested below it. */
export const isWithinFolder = (itemFolder: string | undefined, path: string) => {
  const item = key(itemFolder ?? "");
  const folder = key(path);
  return item === folder || item.startsWith(folder + FOLDER_SEPARATOR);
};

export const folderName = (path: string) => path.split(FOLDER_SEPARATOR).at(-1) ?? path;

export const parentFolder = (path: string): string | null => {
  const parts = path.split(FOLDER_SEPARATOR);
  return parts.length > 1 ? parts.slice(0, -1).join(FOLDER_SEPARATOR) : null;
};

/** Every ancestor path, outermost first, ending with the path itself. */
export const folderTrail = (path: string): string[] =>
  path.split(FOLDER_SEPARATOR).map((_, index, parts) => parts.slice(0, index + 1).join(FOLDER_SEPARATOR));

/** "От родных / Диас" — for selects and badges. */
export const folderLabel = (path: string) => path.split(FOLDER_SEPARATOR).join(" / ");

/** Folders directly inside `parent` (null = top level), in the given order. */
export const childFolders = (folders: string[], parent: string | null) =>
  folders.filter((path) => {
    const up = parentFolder(path);
    return parent === null ? up === null : up !== null && sameFolder(up, parent);
  });

/**
 * Every folder path: base folders first, then the person's own, then any folder
 * an item names but nobody declared — so a typo in the data still shows up
 * instead of hiding files. Parents of nested folders are always included.
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
    for (const path of folderTrail(normalizeFolderPath(name))) {
      if (!path || seen.has(key(path))) continue;
      seen.add(key(path));
      folders.push(path);
    }
  }
  return folders;
}
