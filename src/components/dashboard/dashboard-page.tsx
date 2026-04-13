"use client";

import Link from "next/link";
import { LoadDemoEntriesButton } from "@/components/demo/load-demo-entries-button";
import { EntryCard } from "@/components/entries/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function DashboardPage() {
  const stats = useDashboardStats();

  if (stats === null) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Loading your browser-local evidence."
        />
        <section className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-[2rem]">
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="rounded-[2rem]">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <div key={rowIndex} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    );
  }

  if (stats.totalEntries === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Capture the work while it is fresh, then reuse the proof when review season shows up."
          action={
            <Link href="/entries/new" className={buttonStyles({ size: "lg" })}>
              Capture a new win
            </Link>
          }
        />
        <EmptyState
          eyebrow="First launch"
          title="Nothing saved yet"
          description="BragBook works best when you save evidence close to the work itself. Start with one recent accomplishment or load demo entries to see the intended workflow."
          supportingPoints={[
            "Capture the situation, action, result, and proof while details are still fresh.",
            "Attach metrics, praise, screenshots, and artifacts so future drafts are easier to trust.",
          ]}
          note="Structured proof now makes self-reviews, promotion cases, and interview stories dramatically easier later."
          actions={
            <>
              <Link href="/entries/new" className={buttonStyles()}>
                Create an entry
              </Link>
              <LoadDemoEntriesButton />
            </>
          }
        />
      </div>
    );
  }

  const maxQuarterCount = Math.max(
    ...stats.entriesByQuarter.map((quarter) => quarter.count),
    1,
  );
  const recentTeasers = stats.recentlyUpdated.slice(0, 3);
  const strongestTeasers = stats.strongestProofEntries
    .filter((entry) => !recentTeasers.some((recent) => recent.id === entry.id))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="See your evidence pipeline at a glance, then tighten the entries that will matter most when review season shows up."
        action={
          <Link href="/entries/new" className={buttonStyles({ size: "lg" })}>
            Capture a new win
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <StatTile
          label="Total entries"
          value={stats.totalEntries}
          helper="Wins with reusable context and proof."
        />
        <StatTile
          label="Captured this quarter"
          value={stats.entriesThisQuarter}
          helper="Fresh material for check-ins and reviews."
          accent="Current quarter"
        />
        <StatTile
          label="Strong proof"
          value={stats.proofStrengthCounts.strong + stats.proofStrengthCounts.strongest}
          helper="Entries with a metric or concrete saved proof."
        />
        <StatTile
          label="Strongest proof"
          value={stats.proofStrengthCounts.strongest}
          helper="Metric plus a concrete quote, artifact, or screenshot."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Entries by quarter</CardTitle>
            <CardDescription>
              A compact view of when your strongest body of work is accumulating.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.entriesByQuarter.map((quarter) => {
              const width = (quarter.count / maxQuarterCount) * 100;

              return (
                <div key={quarter.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{quarter.label}</span>
                    <span className="text-muted-foreground">{quarter.count}</span>
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

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Common tags</CardTitle>
            <CardDescription>
              The themes that are showing up repeatedly in your saved accomplishments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.commonTags.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add primary tags to unlock tag trends here.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stats.commonTags.map(({ tag, count }) => (
                  <Badge key={tag} variant="subtle">
                    {tag} ({count})
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Recent work"
          title="Recently updated entries"
          description="These are the easiest wins to finish polishing while the details are still easy to recover."
          action={
            <Link href="/entries" className={buttonStyles({ variant: "secondary", size: "sm" })}>
              View all entries
            </Link>
          }
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {recentTeasers.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Best backed-up work"
          title="Strongest proof entries"
          description="These entries already have the clearest proof strength and will travel best into reviews or promotion cases."
          action={
            <Link
              href="/generator"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Open generator
            </Link>
          }
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {strongestTeasers.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
