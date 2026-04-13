"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getStorageSummary } from "@/lib/storage/entries";

export function useStorageSummary() {
  return useLiveQuery(() => getStorageSummary(), [], null);
}
