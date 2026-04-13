"use client";

import { useEffect, useRef } from "react";
import { seedDemoData } from "@/lib/storage/entries";

export function AppBootstrap() {
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;
    void seedDemoData();
  }, []);

  return null;
}
