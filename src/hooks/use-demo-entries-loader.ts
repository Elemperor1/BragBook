"use client";

import { useState } from "react";
import { seedDemoData } from "@/lib/storage/entries";

export function useDemoEntriesLoader({
  force = false,
  onLoaded,
}: {
  force?: boolean;
  onLoaded?: (seeded: boolean) => void;
} = {}) {
  const [isLoading, setIsLoading] = useState(false);

  async function loadDemoEntries() {
    setIsLoading(true);

    try {
      const seeded = await seedDemoData(force);
      onLoaded?.(seeded);
      return seeded;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    loadDemoEntries,
  };
}
