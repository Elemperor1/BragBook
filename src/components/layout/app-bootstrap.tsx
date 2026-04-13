"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useStorageSummary } from "@/hooks/use-storage-summary";
import { seedDemoData } from "@/lib/storage/entries";

const onboardingDismissedKey = "bragbook-onboarding-dismissed-v1";
const onboardingChoiceKey = "bragbook-onboarding-choice-v1";

export function AppBootstrap() {
  const router = useRouter();
  const summary = useStorageSummary();
  const [hasDismissed, setHasDismissed] = useState<boolean | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    setHasDismissed(window.localStorage.getItem(onboardingDismissedKey) === "true");
  }, []);

  const shouldOpen = useMemo(() => {
    if (hasDismissed === null || summary === null) {
      return false;
    }

    return !hasDismissed && summary.entryCount === 0;
  }, [hasDismissed, summary]);

  function dismiss(choice: "blank" | "sample" | "capture") {
    window.localStorage.setItem(onboardingDismissedKey, "true");
    window.localStorage.setItem(onboardingChoiceKey, choice);
    setHasDismissed(true);
  }

  async function loadSampleEntries() {
    setIsWorking(true);

    try {
      await seedDemoData();
      dismiss("sample");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <Dialog
      open={shouldOpen}
      onClose={() => dismiss("blank")}
      title="Welcome to BragBook"
      description="Capture the proof while it is still easy to recover, then reuse the same evidence across reviews, promotions, resumes, and interview stories."
      footer={
        <>
          <Button variant="ghost" disabled={isWorking} onClick={() => dismiss("blank")}>
            Start blank
          </Button>
          <Button
            variant="secondary"
            disabled={isWorking}
            onClick={() => {
              dismiss("capture");
              router.push("/entries/new");
            }}
          >
            Capture first win
          </Button>
          <Button disabled={isWorking} onClick={loadSampleEntries}>
            {isWorking ? "Loading sample entries…" : "Load sample entries"}
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
            Save the situation, action, result, metrics, and supporting artifacts now so later
            writing becomes synthesis instead of archaeology.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-white/80 px-4 py-4">
          <p className="text-sm font-medium text-foreground">Sample entries are optional.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Load a realistic demo vault to see the intended workflow, or stay blank and start with
            your own first win. You can clear or replace sample data later in Settings.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
