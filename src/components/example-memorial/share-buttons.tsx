"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Copy, Send, Share2 } from "lucide-react";

type ShareButtonsProps = {
  orientation?: "horizontal" | "vertical";
};

export function ShareButtons({ orientation = "vertical" }: ShareButtonsProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    const next = `${window.location.origin}${pathname}`;
    const frame = window.requestAnimationFrame(() => {
      setShareUrl(next);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  if (!shareUrl) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Не удалось скопировать ссылку", error);
    }
  };

  return (
    <div
      className={
        orientation === "vertical"
          ? "flex flex-col gap-3"
          : "flex flex-row flex-wrap gap-3 md:flex-col"
      }
    >
      <Button
        variant="outline"
        className="rounded-lg border-white/10 bg-white/[0.02] text-sm hover:border-white/20"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-gold" aria-hidden />
            Ссылка скопирована
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" aria-hidden />
            Скопировать ссылку
          </>
        )}
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-lg border-gold/30 text-sm text-gold hover:border-gold/50"
      >
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send className="mr-2 h-4 w-4" aria-hidden />
          Telegram
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-lg border-gold/30 text-sm text-gold hover:border-gold/50"
      >
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Share2 className="mr-2 h-4 w-4" aria-hidden />
          WhatsApp
        </a>
      </Button>
    </div>
  );
}
