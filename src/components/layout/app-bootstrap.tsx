"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDemoEntriesLoader } from "@/hooks/use-demo-entries-loader";
import { useStorageSummary } from "@/hooks/use-storage-summary";

const onboardingDismissedKey = "bragbook-onboarding-dismissed-v1";
const onboardingChoiceKey = "bragbook-onboarding-choice-v1";

export function AppBootstrap() {
  const router = useRouter();
  const summary = useStorageSummary();
  const [hasDismissed, setHasDismissed] = useState<boolean | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(onboardingDismissedKey) === "true",
  );
  const { isLoading, loadDemoEntries } = useDemoEntriesLoader({
    onLoaded: () => dismiss("demo"),
  });

  const shouldOpen = hasDismissed === false && summary?.entryCount === 0;

  function dismiss(choice: "empty" | "demo" | "capture") {
    window.localStorage.setItem(onboardingDismissedKey, "true");
    window.localStorage.setItem(onboardingChoiceKey, choice);
    setHasDismissed(true);
  }

  return (
    <Dialog
      open={shouldOpen}
      onClose={() => dismiss("empty")}
      title="Welcome to BragBook"
      description="Capture the proof while it is still easy to recover, then reuse it across reviews, promotions, resumes, and interviews."
      footer={
        <>
          <Button variant="ghost" disabled={isLoading} onClick={() => dismiss("empty")}>
            Start empty
          </Button>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => {
              dismiss("capture");
              router.push("/entries/new");
            }}
          >
            Capture first win
          </Button>
          <Button disabled={isLoading} onClick={loadDemoEntries}>
            {isLoading ? "Loading demo entries…" : "Load demo entries"}
          </Button>
        </>
      }
    >
      <div className="grid gap-3">
        <div className="rounded-[1.5rem] bg-muted/60 px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Structured proof matters because memory degrades faster than the work does.
          </p>
        </div>
        <div className="rounded-[1.5rem] bg-muted/60 px-4 py-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Save the situation, action, result, metrics, and supporting proof now so later
            writing becomes synthesis instead of archaeology.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-white/80 px-4 py-4">
          <p className="text-sm font-medium text-foreground">Demo entries are optional.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Load a realistic demo set to explore the product quickly, or start empty and capture
            your own first win. You can clear or replace the demo entries later in Settings.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
