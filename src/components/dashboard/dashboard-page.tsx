"use client";

import Link from "next/link";
import { EntryCard } from "@/components/entries/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { proofTypeLabels, proofTypeOptions } from "@/lib/schemas/entry";

export function DashboardPage() {
  const stats = useDashboardStats();

  if (stats === null) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Loading your local accomplishment vault."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="See your evidence pipeline at a glance, then jump into the entries that deserve cleanup before review season sneaks up again."
        action={
          <Link href="/entries/new" className={buttonStyles({ size: "lg" })}>
            Capture a new win
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Make your future self’s job easier</CardTitle>
            <CardDescription>
              BragBook is tuned for the awkward gap between doing strong work and needing crisp evidence months later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <StatTile
              label="Total entries"
              value={stats.totalEntries}
              helper="Moments with enough evidence to reuse."
            />
            <StatTile
              label="Captured this quarter"
              value={stats.entriesThisQuarter}
              helper="Fresh material for reviews and checkpoints."
              accent="Current quarter"
            />
            <StatTile
              label="Recent updates"
              value={stats.recentlyUpdated.length}
              helper="Entries touched most recently."
            />
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Proof mix</CardTitle>
            <CardDescription>
              A balanced vault is easier to trust than a pile of anecdotes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proofTypeOptions.map((proofType) => {
              const count = stats.proofTypeCounts[proofType];
              const width =
                stats.totalEntries === 0 ? 0 : (count / stats.totalEntries) * 100;

              return (
                <div key={proofType} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {proofTypeLabels[proofType]}
                    </span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/80">
                    <div
                      className="h-2 rounded-full bg-accent transition-[width]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Recent evidence"
          title="Recently updated entries"
          description="These are the freshest items in your vault and the easiest wins to refine next."
        />
        {stats.recentlyUpdated.length === 0 ? (
          <EmptyState
            title="No entries yet"
            description="Start with one accomplishment while the context is still vivid."
            ctaHref="/entries/new"
            ctaLabel="Create your first entry"
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {stats.recentlyUpdated.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
