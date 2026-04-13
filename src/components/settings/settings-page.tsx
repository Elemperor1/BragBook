"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useStorageSummary } from "@/hooks/use-storage-summary";
import {
  createBackup,
  getBackupFilename,
  parseBackupJson,
  restoreBackup,
  type BragBookBackupV1,
} from "@/lib/storage/backup";
import { clearAllData, seedDemoData } from "@/lib/storage/entries";
import { formatRelativeTime } from "@/lib/utils/date";

type StatusMessage =
  | {
      kind: "success" | "error";
      message: string;
    }
  | null;

export function SettingsPage() {
  const summary = useStorageSummary();
  const [clearOpen, setClearOpen] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<BragBookBackupV1 | null>(null);
  const [pendingImportName, setPendingImportName] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statValueStyles =
    "text-3xl font-semibold tracking-tight text-foreground";

  async function handleExportBackup() {
    setIsWorking(true);
    setStatus(null);

    try {
      const backup = await createBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = getBackupFilename(backup.exportedAt);
      anchor.click();
      URL.revokeObjectURL(url);

      setStatus({
        kind: "success",
        message: `Downloaded a local backup with ${backup.entries.length} entries and ${backup.imageAssets.length} image assets.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Backup export failed. Try again from this browser.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleImportSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsWorking(true);
    setStatus(null);

    try {
      const backup = parseBackupJson(await file.text());
      setPendingImport(backup);
      setPendingImportName(file.name);
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? `Import failed: ${error.message}`
            : "Import failed. Choose a valid BragBook backup JSON file.",
      });
    } finally {
      setIsWorking(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Trustworthy local controls for backups, sample data, and a clear explanation of how this browser-local vault behaves."
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>Total accomplishment records stored locally.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className={statValueStyles}>{summary.entryCount}</p>
            ) : (
              <div className="h-9 w-20 animate-pulse rounded-full bg-muted/80" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local images</CardTitle>
            <CardDescription>Attached screenshots or visual artifacts in IndexedDB.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className={statValueStyles}>{summary.imageCount}</p>
            ) : (
              <div className="h-9 w-20 animate-pulse rounded-full bg-muted/80" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last updated</CardTitle>
            <CardDescription>Most recent evidence activity in this browser.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {summary.lastUpdatedAt
                  ? formatRelativeTime(summary.lastUpdatedAt)
                  : "No activity yet"}
              </p>
            ) : (
              <div className="h-8 w-40 animate-pulse rounded-full bg-muted/80" />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <CardTitle>Local data and backups</CardTitle>
                <CardDescription>
                  Export a full JSON backup, restore from a prior backup, load sample entries, or
                  reset the local vault on this device.
                </CardDescription>
              </div>
              <Badge variant="subtle">Local only</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                disabled={isWorking}
                onClick={handleExportBackup}
              >
                Export JSON backup
              </Button>
              <Button
                variant="secondary"
                disabled={isWorking}
                onClick={() => fileInputRef.current?.click()}
              >
                Import JSON backup
              </Button>
              <Button
                variant="ghost"
                disabled={isWorking}
                onClick={() => setSeedOpen(true)}
              >
                Load sample entries
              </Button>
              <Button
                variant="ghost"
                disabled={isWorking}
                onClick={() => setClearOpen(true)}
              >
                Clear all local data
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-muted/55 px-4 py-4">
                <p className="text-sm font-medium text-foreground">Backup scope</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Exports include entries, metrics, proof metadata, and locally stored screenshot
                  images in one JSON file.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-muted/55 px-4 py-4">
                <p className="text-sm font-medium text-foreground">Restore behavior</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Import replaces the current local vault. It does not merge with existing data.
                </p>
              </div>
            </div>

            {status ? (
              <div
                className={`rounded-[1.5rem] px-4 py-4 text-sm leading-6 ${
                  status.kind === "success"
                    ? "bg-success/12 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How local storage works</CardTitle>
            <CardDescription>
              This product pass stores data in IndexedDB in this browser. There is no account,
              sync, billing, or backend fallback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Your entries stay on this device and inside this browser profile by default.</p>
            <p>
              Clearing site data, reinstalling the browser, switching browsers, or using a fresh
              device can remove the vault unless you exported a backup first.
            </p>
            <p>
              Sample entries are optional and meant for walkthroughs or demos. They can be loaded
              now and removed later.
            </p>
            <div className="rounded-[1.5rem] border border-warning/30 bg-warning/10 px-4 py-4 text-foreground">
              Export a backup before demos, browser cleanup, or device changes if the stored proof
              matters.
            </div>
          </CardContent>
        </Card>
      </section>

      <Dialog
        open={seedOpen}
        onClose={() => setSeedOpen(false)}
        title="Reseed demo data?"
        description="This replaces the current local vault with a realistic BragBook demo dataset for a software engineer."
        confirmLabel="Load demo entries"
        isBusy={isWorking}
        onConfirm={async () => {
          setIsWorking(true);
          setStatus(null);

          try {
            await seedDemoData(true);
            setStatus({
              kind: "success",
              message: "Sample entries are loaded locally for this browser.",
            });
            setSeedOpen(false);
          } finally {
            setIsWorking(false);
          }
        }}
      />

      <Dialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear all local data?"
        description="This permanently removes all entries and local images stored in this browser."
        confirmLabel="Clear data"
        confirmVariant="danger"
        isBusy={isWorking}
        onConfirm={async () => {
          setIsWorking(true);

          try {
            await clearAllData();
            setStatus({
              kind: "success",
              message: "Local data cleared for this browser.",
            });
            setClearOpen(false);
          } finally {
            setIsWorking(false);
          }
        }}
      />

      <Dialog
        open={pendingImport !== null}
        onClose={() => {
          setPendingImport(null);
          setPendingImportName(null);
        }}
        title="Replace local vault from backup?"
        description="Import restores the selected backup and replaces the current entries and local screenshot assets in this browser."
        confirmLabel="Import backup"
        isBusy={isWorking}
        onConfirm={async () => {
          if (!pendingImport) {
            return;
          }

          setIsWorking(true);
          setStatus(null);

          try {
            const imported = await restoreBackup(pendingImport);
            setStatus({
              kind: "success",
              message: `Imported ${imported.entryCount} entries and ${imported.imageCount} image assets from backup.`,
            });
            setPendingImport(null);
            setPendingImportName(null);
          } catch (error) {
            setStatus({
              kind: "error",
              message:
                error instanceof Error
                  ? `Import failed: ${error.message}`
                  : "Import failed. Try another backup file.",
            });
          } finally {
            setIsWorking(false);
          }
        }}
      >
        {pendingImport ? (
          <div className="space-y-3">
            <div className="rounded-[1.5rem] bg-muted/55 px-4 py-4">
              <p className="text-sm font-medium text-foreground">
                {pendingImportName ?? "Selected backup"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Exported {formatRelativeTime(pendingImport.exportedAt)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-muted/55 px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {pendingImport.entries.length} entries
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Structured wins, tags, metrics, and proof metadata
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-muted/55 px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {pendingImport.imageAssets.length} image assets
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Screenshot proof saved inline inside the backup JSON
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
