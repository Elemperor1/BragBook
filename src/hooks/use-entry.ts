"use client";

import { useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { getEntry, getEntryAssetBlob, listEntries } from "@/lib/storage/entries";

export function useEntries() {
  return useLiveQuery(() => listEntries(), [], undefined);
}

export function useEntry(id: string) {
  return useLiveQuery(() => getEntry(id), [id], null);
}

export function useEntryImageUrl(assetId: string | null | undefined) {
  const blob = useLiveQuery(
    () => (assetId ? getEntryAssetBlob(assetId) : Promise.resolve(null)),
    [assetId],
    null,
  );
  const objectUrl = useMemo(
    () => (blob ? URL.createObjectURL(blob) : null),
    [blob],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return objectUrl;
}
