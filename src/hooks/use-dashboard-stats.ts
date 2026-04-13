"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getDashboardStats } from "@/lib/storage/entries";

export function useDashboardStats() {
  return useLiveQuery(() => getDashboardStats(), [], null);
}
