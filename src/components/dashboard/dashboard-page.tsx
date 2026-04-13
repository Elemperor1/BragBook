"use client";

import Link from "next/link";
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
          description="Loading your local accomplishment vault."
        />
      </div>
    );
  }

  if (stats.totalEntries === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Capture now, sort signal later, and avoid review-season archaeology."
          action={
            <Link href="/entries/new" className={buttonStyles({ size: "lg" })}>
              Capture a new win
            </Link>
          }
        />
        <EmptyState
          title="Nothing in the vault yet"
          description="BragBook works best when you save evidence close to the work itself. Start with one recent accomplishment or load demo data to see how the system is meant to feel."
          ctaHref="/entries/new"
          ctaLabel="Create an entry"
          secondaryCtaHref="/settings"
          secondaryCtaLabel="Load demo entries"
        />
      </div>
    );
  }

  const maxQuarterCount = Math.max(
    ...stats.entriesByQuarter.map((quarter) => quarter.count),
    1,
  );

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
          helper="Entries with concrete evidence attached."
        />
        <StatTile
          label="Strongest proof"
          value={stats.proofStrengthCounts.strongest}
          helper="Metric plus quote, screenshot, or artifact."
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
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {stats.recentlyUpdated.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Best backed-up work"
          title="Strongest proof entries"
          description="These entries already have the clearest proof posture and will travel best into reviews or promotion cases."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {stats.strongestProofEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
