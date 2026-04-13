"use client";

import Image from "next/image";
import type { LocalImage } from "@/lib/schemas/entry";
import { useEntryImageUrl } from "@/hooks/use-entry";

interface ProofImagePreviewProps {
  image: LocalImage | null;
  previewUrl?: string | null;
  title?: string;
}

export function ProofImagePreview({
  image,
  previewUrl,
  title = "Attached evidence",
}: ProofImagePreviewProps) {
  const storedUrl = useEntryImageUrl(previewUrl ? null : image?.id);
  const source = previewUrl ?? storedUrl;

  if (!image && !previewUrl) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border-strong/70 bg-white/50 px-4 py-6 text-sm leading-6 text-muted-foreground">
        No local image attached.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-white/75">
      {source ? (
        <div className="relative h-64 w-full">
          <Image
            src={source}
            alt={title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center bg-muted/70 text-sm text-muted-foreground">
          Loading image…
        </div>
      )}
      <div className="space-y-1 px-4 py-4">
        <p className="text-sm font-medium text-foreground">
          {image?.name ?? "Pending upload"}
        </p>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {image?.mimeType ?? "image"} {image?.width ? `• ${image.width}×${image.height}` : ""}
        </p>
      </div>
    </div>
  );
}
