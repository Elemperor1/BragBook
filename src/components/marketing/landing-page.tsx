import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateOutput } from "@/lib/generator";
import { sampleEntries } from "@/lib/sample-entries";

const heroPoints = [
  "Capture wins in under 2 minutes",
  "Attach metrics, praise, screenshots, and evidence",
  "Generate polished career documents",
  "Keep everything private and local-first",
] as const;

const featureHighlights = [
  {
    title: "Structured proof, not vague notes",
    description:
      "Each entry stores situation, action, result, metrics, tags, stakeholders, and proof so future writing starts with signal instead of guesswork.",
  },
  {
    title: "Documents from the same source of truth",
    description:
      "Turn saved entries into self-reviews, resume bullets, promotion packets, and STAR stories without rewriting the same accomplishment from scratch.",
  },
  {
    title: "Evidence that survives review season",
    description:
      "Screenshots, praise, metrics, and linked artifacts travel with the entry so your strongest work is still defensible months later.",
  },
  {
    title: "Private by default",
    description:
      "Data stays in this browser with local backup and restore. No accounts, billing, or sync setup required to start capturing.",
  },
] as const;

const painPoints = [
  "You remember the work, but not the details that make it credible.",
  "Review season becomes archaeology through Slack, docs, and screenshots.",
  "Resume bullets sound generic because the best proof was never saved.",
  "Interview stories weaken when results and evidence are reconstructed from memory.",
] as const;

const trustPoints = [
  "Stored locally in IndexedDB on this device and browser",
  "JSON backup and restore for demos, migrations, and safekeeping",
  "No accounts, billing, cloud sync, or external systems in this product pass",
] as const;

function buildExampleOutputs() {
  const highlightEntries = sampleEntries.slice(0, 2);

  return [
    {
      label: "Self-review",
      eyebrow: "Performance cycle",
      content: generateOutput({
        entries: highlightEntries,
        outputType: "selfReview",
        tone: "confident",
      }),
    },
    {
      label: "Resume bullets",
      eyebrow: "Career narrative",
      content: generateOutput({
        entries: highlightEntries,
        outputType: "resumeBullets",
        tone: "concise",
      }),
    },
    {
      label: "STAR story",
      eyebrow: "Interview prep",
      content: generateOutput({
        entries: [sampleEntries[1]],
        outputType: "starStories",
        tone: "technical",
      }),
    },
  ] as const;
}

const exampleOutputs = buildExampleOutputs();

function marketingButtonStyles(kind: "primary" | "secondary") {
  if (kind === "primary") {
    return "inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[0_20px_40px_rgba(43,34,24,0.18)] transition hover:-translate-y-0.5 hover:bg-[#6f5d49]";
  }

  return "inline-flex items-center justify-center rounded-full border border-border-strong bg-white/82 px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-white";
}

function OutputPreviewCard({
  label,
  eyebrow,
  content,
}: {
  label: string;
  eyebrow: string;
  content: string;
}) {
  return (
    <Card className="h-full rounded-[2rem] border border-white/80 bg-white/88">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {eyebrow}
            </p>
            <CardTitle className="text-xl">{label}</CardTitle>
          </div>
          <Badge variant="subtle">Generated draft</Badge>
        </div>
        <CardDescription>
          Realistic product output generated from structured accomplishment entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[25rem] overflow-hidden rounded-[1.5rem] bg-[#1d1a17] p-5 font-mono text-[12px] leading-6 whitespace-pre-wrap text-[#f7f3ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:text-[13px]">
          {content}
        </pre>
      </CardContent>
    </Card>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-8">
        <div className="mx-auto max-w-[1260px]">
          <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <div className="space-y-7">
              <Badge className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em]">
                Local-first career evidence vault
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-foreground">
                  Your career wins are too valuable to forget.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Capture proof of your work and turn it into promotion packets,
                  self-reviews, resume bullets, and interview stories.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className={marketingButtonStyles("primary")}>
                  Open the app
                </Link>
                <Link href="#example-outputs" className={marketingButtonStyles("secondary")}>
                  See example outputs
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {heroPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.5rem] border border-white/75 bg-white/72 px-4 py-4 shadow-[0_18px_40px_rgba(43,34,24,0.08)] backdrop-blur"
                  >
                    <p className="text-sm font-medium leading-6 text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#c4b5a2]/35 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-accent/15 blur-3xl" />
              <Card className="relative overflow-hidden rounded-[2.4rem] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,244,238,0.84))]">
                <CardHeader className="space-y-4 pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                        Capture to draft
                      </p>
                      <CardTitle className="mt-2 text-2xl">
                        Save the proof while it is still easy to recover.
                      </CardTitle>
                    </div>
                    <Badge variant="subtle">No account needed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[1.75rem] border border-border bg-white/90 p-5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        Entry snapshot
                      </p>
                      <div className="mt-4 space-y-3">
                        <p className="text-lg font-semibold leading-tight text-foreground">
                          Stabilized the CI lane for monorepo builds
                        </p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          Saved with metric proof, rollout context, stakeholders, and linked
                          artifacts instead of a vague note.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="subtle">reliability</Badge>
                          <Badge variant="subtle">platform</Badge>
                          <Badge variant="success">strong proof</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-[#1d1a17] p-5 text-[#f7f3ec]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d6c5ae]">
                          Generated from entries
                        </p>
                        <Badge className="bg-white/10 text-[#f7f3ec]">self-review</Badge>
                      </div>
                      <div className="mt-4 space-y-4 text-sm leading-6">
                        <p>
                          Delivered measurable reliability gains by stabilizing the CI lane,
                          reducing main-branch failure rate from 18% to 3% within one sprint.
                        </p>
                        <p className="text-[#d6c5ae]">
                          Supporting proof included platform scorecards, retro notes, and
                          cross-team release coordination details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] bg-accent-soft px-4 py-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        Step 1
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">Capture the win</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-accent-soft px-4 py-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        Step 2
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">Attach proof</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-accent-soft px-4 py-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        Step 3
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">Generate drafts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              Value proposition
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              BragBook makes your strongest work reusable.
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              Instead of rebuilding the same story for reviews, promotions, resumes, and
              interviews, you keep structured proof once and reuse it everywhere.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-[2rem] bg-white/86">
              <CardHeader>
                <CardTitle>Capture quickly</CardTitle>
                <CardDescription>
                  Save the accomplishment close to the work, before names, metrics, and context
                  fade.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-[2rem] bg-white/86">
              <CardHeader>
                <CardTitle>Defend with proof</CardTitle>
                <CardDescription>
                  Add stakeholder praise, screenshots, artifact links, and before/after evidence
                  that travels with the entry.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-[2rem] bg-white/86">
              <CardHeader>
                <CardTitle>Generate serious drafts</CardTitle>
                <CardDescription>
                  Create polished documents that sound like they came from real work, not a rushed
                  end-of-quarter memory dump.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
            <Card className="rounded-[2rem] bg-[#1d1a17] text-[#f7f3ec]">
              <CardHeader>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#d6c5ae]">
                  Pain point
                </p>
                <CardTitle className="text-2xl text-[#f7f3ec]">
                  Career evidence usually disappears into scattered artifacts.
                </CardTitle>
                <CardDescription className="text-[#d6c5ae]">
                  By the time you need a clean story, the proof is fragmented across tools and the
                  strongest details are already gone.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {painPoints.map((point) => (
                <Card key={point} className="rounded-[2rem] bg-white/86">
                  <CardContent className="pt-6">
                    <p className="text-base leading-7 text-foreground">{point}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              Feature highlights
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for the work between delivery and recognition.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featureHighlights.map((feature) => (
              <Card key={feature.title} className="rounded-[2rem] bg-white/86">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="example-outputs" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              Example outputs
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The output should look like real career material, not generic filler.
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              These previews are generated from structured sample entries that mirror the real app
              workflow and document shapes.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {exampleOutputs.map((example) => (
              <OutputPreviewCard
                key={example.label}
                label={example.label}
                eyebrow={example.eyebrow}
                content={example.content}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <Card className="overflow-hidden rounded-[2.4rem] border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,230,0.88))]">
            <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                  Privacy and trust
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  Keep your proof private and local-first.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  BragBook is designed to feel safe enough for raw notes, early evidence, and
                  sensitive praise. The default posture is local storage, clear warnings, and a
                  plain backup story.
                </p>
              </div>

              <div className="space-y-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.5rem] border border-border bg-white/86 px-4 py-4"
                  >
                    <p className="text-sm font-medium leading-6 text-foreground">{point}</p>
                  </div>
                ))}
                <div className="rounded-[1.5rem] border border-warning/25 bg-warning/10 px-4 py-4">
                  <p className="text-sm leading-6 text-foreground">
                    Local-only also means clearing browser storage, switching browsers, or using a
                    fresh device can remove the vault unless you export a backup.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-[1180px]">
          <Card className="rounded-[2.6rem] border border-white/85 bg-[#1d1a17] text-[#f7f3ec]">
            <CardContent className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-9">
              <div className="max-w-3xl space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#d6c5ae]">
                  Call to action
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Build the proof base before the next review cycle asks for it.
                </h2>
                <p className="text-base leading-7 text-[#d6c5ae] sm:text-lg">
                  Open the product, capture one recent win, and see how quickly structured proof
                  turns into reusable career material.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className={marketingButtonStyles("primary")}>
                  Start in the app
                </Link>
                <Link href="/settings" className={marketingButtonStyles("secondary")}>
                  Review local backup controls
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
