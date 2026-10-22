"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoGallery } from "@/components/photo-gallery";
import type { Person } from "@data/people";
import {
  childFolders,
  folderName,
  folderTrail,
  isWithinFolder,
  listMediaFolders,
  normalizeFolderPath,
  parentFolder,
  sameFolder,
} from "@/lib/media-folders";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronRight, ChevronsUpDown, ExternalLink, FileText, Film, Folder, FolderOpen, House } from "lucide-react";

type MediaTabsProps = {
  media: NonNullable<Person["media"]>;
};

type Media = MediaTabsProps["media"];

/** Extract a YouTube video id from common URL shapes (watch, youtu.be, embed, shorts). */
function youtubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

const countItems = (media: Media) => media.videos.length + media.photos.length + media.documents.length;

function selectItems(media: Media, keep: (item: { folder?: string }) => boolean): Media {
  return {
    ...media,
    videos: media.videos.filter(keep),
    photos: media.photos.filter(keep),
    documents: media.documents.filter(keep),
  };
}

const plural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

/** "1 папка · 18 фото" — what is inside, so a visitor knows before opening. */
function describe(media: Media, subfolders = 0): string {
  const parts = [
    subfolders > 0 ? `${subfolders} ${plural(subfolders, "папка", "папки", "папок")}` : null,
    media.videos.length > 0 ? `${media.videos.length} видео` : null,
    media.photos.length > 0 ? `${media.photos.length} фото` : null,
    media.documents.length > 0
      ? `${media.documents.length} ${plural(media.documents.length, "документ", "документа", "документов")}`
      : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Пусто";
}

type SortKey = "name" | "size";

type FolderEntry = {
  path: string;
  name: string;
  /** Everything inside, nested folders included — drives the counts. */
  content: Media;
  size: number;
  subfolders: number;
};

/**
 * The media section works like a file browser: «Все» lists the top folders,
 * opening one shows its subfolders and its own videos, photos and documents.
 */
export function MediaTabs({ media }: MediaTabsProps) {
  // null = «Все», the top-level folder list; otherwise a path like "От родных/Диас".
  const [path, setPath] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean } | null>(null);

  const allFolders = useMemo(() => listMediaFolders(media), [media]);

  const entry = (folderPath: string): FolderEntry => {
    const content = selectItems(media, (item) => isWithinFolder(item.folder, folderPath));
    return {
      path: folderPath,
      name: folderName(folderPath),
      content,
      size: countItems(content),
      subfolders: childFolders(allFolders, folderPath).length,
    };
  };

  const listed = childFolders(allFolders, path).map(entry);
  const sortedFolders = sort
    ? [...listed].sort((a, b) =>
        (sort.desc ? -1 : 1) * (sort.key === "name" ? a.name.localeCompare(b.name, "ru") : a.size - b.size)
      )
    : listed;

  // Files filed exactly here; at the top level that means files with no folder.
  const ownFiles = selectItems(media, (item) =>
    path === null ? !normalizeFolderPath(item.folder) : sameFolder(item.folder, path)
  );
  const current = path ? entry(path) : null;
  const topLevel = childFolders(allFolders, null);
  const activeTop = path ? folderTrail(path)[0] : null;

  const toggleSort = (key: SortKey) =>
    setSort((value) => (value?.key === key ? { key, desc: !value.desc } : { key, desc: false }));

  return (
    <div className="space-y-5">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div role="group" aria-label="Папки" className="flex w-max gap-2">
          {[null, ...topLevel].map((top) => {
            const active = activeTop === top;
            const Icon = top === null ? House : active ? FolderOpen : Folder;
            return (
              <button
                key={top ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setPath(top)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  active
                    ? "border-gold/50 bg-white/[0.06] text-gold"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {top ?? "Все"}
                <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>

      {current ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPath(parentFolder(current.path))}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Назад
          </button>
          <nav aria-label="Путь к папке" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <button type="button" onClick={() => setPath(null)} className="transition-colors hover:text-foreground">
              Все
            </button>
            {folderTrail(current.path).map((step) => (
              <span key={step} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                {sameFolder(step, current.path) ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <FolderOpen className="h-4 w-4 text-gold/80" aria-hidden />
                    {folderName(step)}
                  </span>
                ) : (
                  <button type="button" onClick={() => setPath(step)} className="transition-colors hover:text-foreground">
                    {folderName(step)}
                  </button>
                )}
              </span>
            ))}
            <span>· {describe(current.content, current.subfolders)}</span>
          </nav>
        </div>
      ) : null}

      <div className="space-y-8">
        {sortedFolders.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 px-5 py-3 text-sm text-muted-foreground sm:grid-cols-[1fr_12rem_10rem]">
              <SortHeader label="Имя" active={sort?.key === "name"} onClick={() => toggleSort("name")} />
              <SortHeader label="Содержимое" active={sort?.key === "size"} onClick={() => toggleSort("size")} />
              <span className="hidden sm:block">Тип</span>
            </div>
            <ul>
              {sortedFolders.map((item) => (
                <li key={item.path} className="border-b border-white/5 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setPath(item.path)}
                    className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none sm:grid-cols-[1fr_12rem_10rem]"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <Folder
                        className={cn("h-8 w-8 shrink-0", item.size > 0 ? "fill-gold/80 text-gold" : "text-gold/50")}
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      <span className="truncate font-medium text-foreground">{item.name}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">{describe(item.content, item.subfolders)}</span>
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {item.size > 0 ? "Папка с файлами" : "Пустая папка"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {countItems(ownFiles) > 0 ? (
          <div className="space-y-4">
            {path === null ? (
              <p className="text-sm font-medium text-muted-foreground">Без папки · {describe(ownFiles)}</p>
            ) : null}
            <FolderContents key={path ?? "root"} media={ownFiles} />
          </div>
        ) : null}

        {current && current.size === 0 && sortedFolders.length === 0 ? (
          <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
            <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
              <Folder className="h-5 w-5 text-gold/80" aria-hidden />
              <span>В папке «{current.name}» пока ничего нет</span>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

type SortHeaderProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function SortHeader({ label, active, onClick }: SortHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center gap-1.5 text-left transition-colors hover:text-foreground", active && "text-foreground")}
    >
      {label}
      <ChevronsUpDown className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

/** One folder's files, split by kind; only kinds that have something get a tab. */
function FolderContents({ media }: { media: Media }) {
  const kinds = [
    { value: "photo", label: "Фото", count: media.photos.length },
    { value: "video", label: "Видео", count: media.videos.length },
    { value: "documents", label: "Документы", count: media.documents.length },
  ].filter((kind) => kind.count > 0);

  return (
    <Tabs defaultValue={kinds[0]?.value} className="w-full">
      {kinds.length > 1 ? (
        <TabsList
          className="grid w-full rounded-lg border border-white/10 bg-white/[0.02] p-1"
          style={{ gridTemplateColumns: `repeat(${kinds.length}, minmax(0, 1fr))` }}
        >
          {kinds.map((kind) => (
            <TabsTrigger
              key={kind.value}
              value={kind.value}
              className="rounded-md text-sm font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-gold"
            >
              {kind.label}
              <span className="ml-1.5 text-xs text-muted-foreground">{kind.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      ) : null}
      <TabsContent value="video" className="mt-6 focus-visible:outline-none focus-visible:ring-2">
        <div className="grid gap-5 sm:grid-cols-2">
          {media.videos.map((video) => {
            const id = youtubeId(video.url);
            return (
              <div key={video.url} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                {id ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-black/40">
                    <Link
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gold underline-offset-4 hover:underline"
                    >
                      <Film className="h-4 w-4" /> Смотреть видео
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground">
                  <Film className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                  {video.title}
                </div>
              </div>
            );
          })}
        </div>
      </TabsContent>
      <TabsContent value="photo" className="mt-6 focus-visible:outline-none focus-visible:ring-2">
        <PhotoGallery photos={media.photos.map((p) => ({ src: p.src, alt: p.alt }))} />
      </TabsContent>
      <TabsContent value="documents" className="mt-6 space-y-3 focus-visible:outline-none focus-visible:ring-2">
        {media.documents.map((document) => (
          <Card key={document.title} className="rounded-xl border-white/10 bg-white/[0.02] shadow-none transition-colors hover:border-white/20">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
                <FileText className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                {document.title}
              </CardTitle>
              {document.url ? (
                <Link href={document.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gold underline-offset-4 hover:underline">
                  Открыть
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
            </CardHeader>
            {document.note ? <CardContent className="pt-0 text-sm text-muted-foreground">{document.note}</CardContent> : null}
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}
