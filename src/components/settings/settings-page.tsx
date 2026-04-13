"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useStorageSummary } from "@/hooks/use-storage-summary";
import { clearAllData, seedDemoData } from "@/lib/storage/entries";
import { formatRelativeTime } from "@/lib/utils/date";

export function SettingsPage() {
  const summary = useStorageSummary();
  const [clearOpen, setClearOpen] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Local controls only. No accounts, sync, billing, or external systems are involved in this MVP."
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>Total accomplishment records stored locally.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {summary?.entryCount ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local images</CardTitle>
            <CardDescription>Attached screenshots or visual artifacts in IndexedDB.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {summary?.imageCount ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last updated</CardTitle>
            <CardDescription>Most recent evidence activity in this browser.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {summary?.lastUpdatedAt
                ? formatRelativeTime(summary.lastUpdatedAt)
                : "No activity yet"}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Local data controls</CardTitle>
            <CardDescription>
              Demo data is opt-in now. Use these actions when you want a walkthrough dataset or need to reset the browser-local vault.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              disabled={isWorking}
              onClick={() => setSeedOpen(true)}
            >
              Load demo entries
            </Button>
            <Button
              variant="ghost"
              disabled={isWorking}
              onClick={() => setClearOpen(true)}
            >
              Clear all local data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About this MVP</CardTitle>
            <CardDescription>
              The generator now produces local-first self-reviews, promotion cases, resume bullets, and STAR stories from saved entries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Everything lives in IndexedDB on this device.</p>
            <p>No backend, auth, billing, sync, or third-party integrations are included.</p>
            <p>Current focus is clean capture, editability, and serious presentation quality.</p>
          </CardContent>
        </Card>
      </section>

      <Dialog
        open={seedOpen}
        onClose={() => setSeedOpen(false)}
        title="Reseed demo data?"
        description="This replaces the current local vault with a realistic BragBook demo dataset for a software engineer."
        confirmLabel="Load demo entries"
        onConfirm={async () => {
          setIsWorking(true);
          await seedDemoData(true);
          setIsWorking(false);
          setSeedOpen(false);
        }}
      />

      <Dialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear all local data?"
        description="This permanently removes all entries and local images stored in this browser."
        confirmLabel="Clear data"
        confirmVariant="danger"
        onConfirm={async () => {
          setIsWorking(true);
          await clearAllData();
          setIsWorking(false);
          setClearOpen(false);
        }}
      />
    </div>
  );
}
