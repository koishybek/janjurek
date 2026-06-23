"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import QRCode from "qrcode";
import { Check, Copy, Download, QrCode, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Generate a gold-on-dark QR data URL for a value. Returns null until ready. */
export function useQrDataUrl(value: string | null) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (value) {
      QRCode.toDataURL(value, {
        width: 520,
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#e3c28d", light: "#0a0a0aff" },
      })
        .then((url) => {
          if (!cancelled) setDataUrl(url);
        })
        .catch(() => {
          if (!cancelled) setDataUrl(null);
        });
    } else {
      queueMicrotask(() => {
        if (!cancelled) setDataUrl(null);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [value]);
  return dataUrl;
}

/** Renders the QR image (gold on graphite) for a value. */
export function QrImage({ value, size = 200, className }: { value: string | null; size?: number; className?: string }) {
  const dataUrl = useQrDataUrl(value);
  return (
    <div
      className={cn(
        "grid place-items-center overflow-hidden rounded-2xl border border-gold/25 bg-[#0a0a0a] p-3",
        className
      )}
      style={{ width: size + 24, height: size + 24 }}
    >
      {dataUrl ? (
        <Image src={dataUrl} alt="QR-код страницы памяти" width={size} height={size} unoptimized />
      ) : (
        <QrCode className="h-10 w-10 animate-pulse text-gold/40" />
      )}
    </div>
  );
}

export function downloadQr(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

type ShareQRProps = {
  /** Absolute or relative URL. Falls back to the current page on the client. */
  url?: string;
  title?: string;
  fileName?: string;
};

export function ShareQR({ url, title = "Страница памяти", fileName = "janjurek-qr.png" }: ShareQRProps) {
  const [open, setOpen] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(url ?? null);
  const [copied, setCopied] = useState(false);
  const dataUrl = useQrDataUrl(open ? resolvedUrl : null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (url) setResolvedUrl(url);
      else if (typeof window !== "undefined") setResolvedUrl(window.location.href);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const copy = async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked */
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-foreground/90 transition hover:border-gold/60 hover:text-gold"
        >
          <Share2 className="h-4 w-4" />
          Поделиться
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-card p-8 focus:outline-none">
          <Dialog.Close
            aria-label="Закрыть"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted-foreground transition hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>
          <Dialog.Title className="text-center font-serif text-2xl text-foreground">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-center text-sm text-muted-foreground">
            Отсканируйте QR-код или поделитесь ссылкой. Этот код можно разместить на памятнике.
          </Dialog.Description>

          <div className="mt-6 flex justify-center">
            <QrImage value={open ? resolvedUrl : null} size={208} />
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 bg-background/60 px-3 py-2">
            <span className="flex-1 truncate text-xs text-muted-foreground">{resolvedUrl}</span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-gold transition hover:bg-gold/10"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Скопировано" : "Копировать"}
            </button>
          </div>

          <button
            type="button"
            disabled={!dataUrl}
            onClick={() => dataUrl && downloadQr(dataUrl, fileName)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gold/90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Скачать QR-код
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
