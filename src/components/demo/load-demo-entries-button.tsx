"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useDemoEntriesLoader } from "@/hooks/use-demo-entries-loader";

export function LoadDemoEntriesButton({
  force = false,
  buttonLabel = "Load demo entries",
  loadingLabel = "Loading demo entries…",
  title = "Load demo entries?",
  description = "Load a realistic BragBook demo dataset for a software engineer so you can explore the intended workflow quickly.",
  confirmLabel = "Load demo entries",
  variant = "secondary",
  size = "md",
  disabled = false,
  onLoaded,
}: {
  force?: boolean;
  buttonLabel?: string;
  loadingLabel?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  onLoaded?: (seeded: boolean) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isLoading, loadDemoEntries } = useDemoEntriesLoader({
    force,
    onLoaded: (seeded) => {
      setDialogOpen(false);
      onLoaded?.(seeded);
    },
  });

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        onClick={() => setDialogOpen(true)}
      >
        {isLoading ? loadingLabel : buttonLabel}
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        isBusy={isLoading}
        onConfirm={loadDemoEntries}
      >
        <div className="rounded-[1.5rem] bg-muted/55 px-4 py-4 text-sm leading-6 text-muted-foreground">
          Demo entries include strong examples, weaker examples, and proof-strength variety so
          the dashboard, filters, and generator all feel realistic.
        </div>
      </Dialog>
    </>
  );
}
