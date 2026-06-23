"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoGallery } from "@/components/photo-gallery";
import type { Person } from "@data/people";
import { ExternalLink, FileText, Film, ImageIcon } from "lucide-react";

type MediaTabsProps = {
  media: NonNullable<Person["media"]>;
};

export function MediaTabs({ media }: MediaTabsProps) {
  return (
    <Tabs defaultValue="video" className="w-full">
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
      <TabsContent value="video" className="mt-6 space-y-3 focus-visible:outline-none focus-visible:ring-2">
        {media.videos.length === 0 ? (
          <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
            <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
              <Film className="h-5 w-5 text-gold/80" aria-hidden />
              <span>Видео пока нет</span>
            </CardContent>
          </Card>
        ) : (
          media.videos.map((video) => (
            <Card key={video.url} className="rounded-xl border-white/10 bg-white/[0.02] shadow-none transition-colors hover:border-white/20">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
                  <Film className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                  {video.title}
                </CardTitle>
                <Link href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gold underline-offset-4 hover:underline">
                  Смотреть
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </CardHeader>
            </Card>
          ))
        )}
      </TabsContent>
      <TabsContent value="photo" className="mt-6 focus-visible:outline-none focus-visible:ring-2">
        {media.photos.length === 0 ? (
          <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
            <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
              <ImageIcon className="h-5 w-5 text-gold/80" aria-hidden />
              <span>Фотографий пока нет</span>
            </CardContent>
          </Card>
        ) : (
          <PhotoGallery photos={media.photos.map((p) => ({ src: p.src, alt: p.alt }))} />
        )}
      </TabsContent>
      <TabsContent value="documents" className="mt-6 space-y-3 focus-visible:outline-none focus-visible:ring-2">
        {media.documents.length === 0 ? (
          <Card className="rounded-xl border-white/10 bg-white/[0.02] shadow-none">
            <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
              <FileText className="h-5 w-5 text-gold/80" aria-hidden />
              <span>Документы пока не загружены</span>
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
  );
}
