"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoGallery } from "@/components/photo-gallery";
import type { Person } from "@data/people";
import { listMediaFolders } from "@/lib/media-folders";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Film, Folder, FolderOpen, ImageIcon } from "lucide-react";

type MediaTabsProps = {
  media: NonNullable<Person["media"]>;
};

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

type Media = MediaTabsProps["media"];

const countItems = (media: Media) => media.videos.length + media.photos.length + media.documents.length;

function filterByFolder(media: Media, folder: string | null): Media {
  if (folder === null) return media;
  const inFolder = (item: { folder?: string }) => item.folder?.trim().toLowerCase() === folder.toLowerCase();
  return {
    ...media,
    videos: media.videos.filter(inFolder),
    photos: media.photos.filter(inFolder),
    documents: media.documents.filter(inFolder),
  };
}

export function MediaTabs({ media: allMedia }: MediaTabsProps) {
  // null = «Все»: unfiled items live only there.
  const [folder, setFolder] = useState<string | null>(null);
  const folders = useMemo(() => listMediaFolders(allMedia), [allMedia]);
  const media = useMemo(() => filterByFolder(allMedia, folder), [allMedia, folder]);
  const emptyHint = (what: string) => (folder ? `В папке «${folder}» пока нет ${what}` : null);

  // Open on the first tab that has something in it instead of an empty "Видео".
  const defaultTab =
    allMedia.videos.length > 0 ? "video" : allMedia.photos.length > 0 ? "photo" : allMedia.documents.length > 0 ? "documents" : "video";

  return (
    <div className="space-y-5">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div role="group" aria-label="Папки" className="flex w-max gap-2">
          {[null, ...folders].map((name) => {
            const active = folder === name;
            const Icon = active ? FolderOpen : Folder;
            return (
              <button
                key={name ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setFolder(name)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  active
                    ? "border-gold/40 bg-white/[0.06] text-gold"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {name ?? "Все"}
                <span className="text-xs text-muted-foreground">{countItems(filterByFolder(allMedia, name))}</span>
              </button>
            );
          })}
        </div>
      </div>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-lg border border-white/10 bg-white/[0.02] p-1">
          <TabsTrigger value="video" className="rounded-md text-sm font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-gold">
            Видео
            <span className="ml-1.5 text-xs text-muted-foreground">{media.videos.length}</span>
          </TabsTrigger>
          <TabsTrigger value="photo" className="rounded-md text-sm font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-gold">
            Фото
            <span className="ml-1.5 text-xs text-muted-foreground">{media.photos.length}</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-md text-sm font-medium data-[state=active]:bg-white/[0.06] data-[state=active]:text-gold">
            Документы
            <span className="ml-1.5 text-xs text-muted-foreground">{media.documents.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="video" className="mt-6 focus-visible:outline-none focus-visible:ring-2">
          {media.videos.length === 0 ? (
            <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <Film className="h-5 w-5 text-gold/80" aria-hidden />
                <span>{emptyHint("видео") ?? "Видео пока нет"}</span>
              </CardContent>
            </Card>
          ) : (
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
          )}
        </TabsContent>
        <TabsContent value="photo" className="mt-6 focus-visible:outline-none focus-visible:ring-2">
          {media.photos.length === 0 ? (
            <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <ImageIcon className="h-5 w-5 text-gold/80" aria-hidden />
                <span>{emptyHint("фотографий") ?? "Фотографий пока нет"}</span>
              </CardContent>
            </Card>
          ) : (
            <PhotoGallery key={folder ?? "all"} photos={media.photos.map((p) => ({ src: p.src, alt: p.alt }))} />
          )}
        </TabsContent>
        <TabsContent value="documents" className="mt-6 space-y-3 focus-visible:outline-none focus-visible:ring-2">
          {media.documents.length === 0 ? (
            <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <FileText className="h-5 w-5 text-gold/80" aria-hidden />
                <span>{emptyHint("документов") ?? "Документы пока не загружены"}</span>
              </CardContent>
            </Card>
          ) : (
            media.documents.map((document) => (
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
                {document.note ? (
                  <CardContent className="pt-0 text-sm text-muted-foreground">{document.note}</CardContent>
                ) : null}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
