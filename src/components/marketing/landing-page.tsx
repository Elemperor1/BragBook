import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { demoEntries } from "@/lib/demo-entries";
import { generateOutput } from "@/lib/generator";

const heroPoints = [
  "Capture wins in under 2 minutes",
  "Attach metrics, praise, screenshots, and evidence",
  "Generate polished career documents",
  "Keep everything stored only in this browser",
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
  const highlightEntries = demoEntries.slice(0, 2);

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
        entries: [demoEntries[2]],
        outputType: "starStories",
        tone: "technical",
      }),
    },
  ] as const;
}

const exampleOutputs = buildExampleOutputs();

function marketingButtonStyles(kind: "primary" | "secondary") {
  if (kind === "primary") {
    return buttonStyles({
      size: "lg",
      className: "min-w-40 px-6",
    });
  }

  return buttonStyles({
    variant: "secondary",
    size: "lg",
    className: "min-w-40 px-6",
  });
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
    <Card variant="document" className="h-full rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-border/70 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardEyebrow>{eyebrow}</CardEyebrow>
            <CardTitle className="text-[1.85rem]">{label}</CardTitle>
          </div>
          <Badge variant="accent">Generated draft</Badge>
        </div>
        <CardDescription>
          Realistic product output generated from structured accomplishment entries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <span>BragBook document</span>
          <span>Editable after generation</span>
        </div>
        <pre className="document-prose max-h-[25rem] overflow-hidden whitespace-pre-wrap font-sans text-[#2d241b]">
          {content}
        </pre>
      </CardContent>
    </Card>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pb-28 lg:pt-8">
        <div className="mx-auto max-w-[1260px]">
          <div className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
            <div className="space-y-8">
              <Badge variant="selected" className="px-4 py-2">
                Browser-local career evidence vault
              </Badge>

              <div className="space-y-5">
                <h1 className="display-title max-w-4xl text-foreground">
                  Your career wins are too valuable to forget.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-[1.15rem]">
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
                {heroPoints.map((point, index) => (
                  <Card
                    key={point}
                    variant={index === 1 ? "elevated" : "quiet"}
                    className="rounded-[1.4rem]"
                  >
                    <CardContent className="pt-5">
                      <p className="text-sm font-semibold leading-6 text-foreground">{point}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative lg:pl-6">
              <div className="absolute -left-6 top-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute bottom-8 right-0 h-52 w-52 rounded-full bg-ink/10 blur-3xl" />
              <Card
                variant="elevated"
                className="relative overflow-hidden rounded-[2.4rem] border border-white/85"
              >
                <CardHeader className="border-b border-border/70 pb-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <CardEyebrow>Capture to draft</CardEyebrow>
                      <CardTitle className="max-w-xl text-[2rem]">
                        Save the proof while it is still easy to recover.
                      </CardTitle>
                    </div>
                    <Badge variant="selected">No account needed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                    <Card variant="quiet" className="rounded-[1.6rem]">
                      <CardContent className="space-y-4 pt-5">
                        <p className="eyebrow-label">Entry snapshot</p>
                        <div className="space-y-3">
                          <p className="text-lg font-semibold leading-tight text-foreground">
                            Stabilized the CI lane for monorepo builds
                          </p>
                          <p className="text-sm leading-7 text-muted-foreground">
                            Saved with metric proof, rollout context, stakeholders, and linked
                            artifacts instead of a vague note.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="subtle">reliability</Badge>
                            <Badge variant="subtle">platform</Badge>
                            <Badge variant="success">strong proof</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card variant="feature" className="rounded-[1.6rem]">
                      <CardContent className="space-y-4 pt-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#cfbea9]">
                            Generated from entries
                          </p>
                          <Badge variant="feature">self-review</Badge>
                        </div>
                        <div className="space-y-4 text-sm leading-7 text-[#f7f1e8]">
                          <p>
                            Delivered measurable reliability gains by stabilizing the CI lane,
                            reducing main-branch failure rate from 18% to 3% within one sprint.
                          </p>
                          <p className="text-[#cfbea9]">
                            Supporting proof included platform scorecards, retro notes, and
                            cross-team release coordination details.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Capture the win", "Attach proof", "Generate drafts"].map((step, index) => (
                      <Card
                        key={step}
                        variant={index === 2 ? "default" : "quiet"}
                        className="rounded-[1.35rem]"
                      >
                        <CardContent className="pt-4">
                          <p className="eyebrow-label">Step {index + 1}</p>
                          <p className="mt-2 text-sm font-semibold text-foreground">{step}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow-label">Value proposition</p>
            <h2 className="section-title text-foreground">
              BragBook makes your strongest work reusable.
            </h2>
            <p className="support-copy">
              Instead of rebuilding the same story for reviews, promotions, resumes, and
              interviews, you keep structured proof once and reuse it everywhere.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="quiet" className="rounded-[1.8rem]">
              <CardHeader>
                <CardTitle>Capture quickly</CardTitle>
                <CardDescription>
                  Save the accomplishment close to the work, before names, metrics, and context
                  fade.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="elevated" className="rounded-[1.8rem]">
              <CardHeader>
                <CardTitle>Defend with proof</CardTitle>
                <CardDescription>
                  Add stakeholder praise, screenshots, artifact links, and before/after evidence
                  that travels with the entry.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="quiet" className="rounded-[1.8rem]">
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

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <Card variant="feature" className="rounded-[2rem]">
              <CardHeader>
                <CardEyebrow className="text-[#cfbea9]">Pain point</CardEyebrow>
                <CardTitle className="text-[2rem] text-[#f7f1e8]">
                  Career evidence usually disappears into scattered artifacts.
                </CardTitle>
                <CardDescription className="text-[#cfbea9]">
                  By the time you need a clean story, the proof is fragmented across tools and the
                  strongest details are already gone.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {painPoints.map((point, index) => (
                <Card
                  key={point}
                  variant={index === 0 ? "elevated" : "quiet"}
                  className="rounded-[1.8rem]"
                >
                  <CardContent className="pt-6">
                    <p className="text-base leading-7 text-foreground">{point}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow-label">Feature highlights</p>
            <h2 className="section-title text-foreground">
              Built for the work between delivery and recognition.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featureHighlights.map((feature, index) => (
              <Card
                key={feature.title}
                variant={index % 2 === 0 ? "elevated" : "default"}
                className="rounded-[1.8rem]"
              >
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="example-outputs" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="eyebrow-label">Example outputs</p>
            <h2 className="section-title text-foreground">
              The output should look like real career material, not generic filler.
            </h2>
            <p className="support-copy">
              These previews are generated from structured demo entries that mirror the real app
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

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <Card variant="feature" className="overflow-hidden rounded-[2.4rem] border-white/10">
            <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#cfbea9]">
                  Privacy and trust
                </p>
                <h2 className="section-title text-[#f7f1e8]">
                  Keep your proof stored only in this browser.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[#cfbea9]">
                  BragBook is designed to feel safe enough for raw notes, early evidence, and
                  sensitive praise. The default posture is browser-local storage, clear warnings,
                  and a plain backup story.
                </p>
              </div>

              <div className="space-y-3">
                {trustPoints.map((point) => (
                  <Card key={point} variant="elevated" className="rounded-[1.4rem]">
                    <CardContent className="pt-5">
                      <p className="text-sm font-semibold leading-6 text-foreground">{point}</p>
                    </CardContent>
                  </Card>
                ))}
                <div className="rounded-[1.4rem] border border-warning/25 bg-warning/10 px-4 py-4">
                  <p className="text-sm leading-6 text-[#f7f1e8]">
                    Local-only also means clearing browser storage, switching browsers, or using a
                    fresh device can remove the data unless you export a backup.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-[1180px]">
          <Card variant="elevated" className="rounded-[2.6rem]">
            <CardContent className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-9">
              <div className="max-w-3xl space-y-3">
                <p className="eyebrow-label">Call to action</p>
                <h2 className="section-title text-foreground">
                  Build the proof base before the next review cycle asks for it.
                </h2>
                <p className="support-copy">
                  Open the product, capture one recent win, and see how quickly structured proof
                  turns into reusable career material.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className={marketingButtonStyles("primary")}>
                  Start in the app
                </Link>
                <Link href="/settings" className={marketingButtonStyles("secondary")}>
                  Review backup controls
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
