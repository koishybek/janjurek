"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Copy, Send, MessageCircle } from "lucide-react";

export function ShareButtons() {
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
    <div className="flex flex-wrap gap-3 md:flex-col">
      <Button onClick={handleCopy} variant="secondary" className="gap-2 rounded-2xl">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
      </Button>
      <Button asChild variant="outline" className="gap-2 rounded-2xl">
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Поделиться через Telegram"
        >
          <Send className="h-4 w-4" />
          Telegram
        </a>
      </Button>
      <Button asChild variant="outline" className="gap-2 rounded-2xl">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Поделиться через WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
    </div>
  );
}
