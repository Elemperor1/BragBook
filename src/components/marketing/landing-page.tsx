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
import { cn } from "@/lib/utils/cn";

const heroProofStrip = [
  "Capture in minutes",
  "Proof-backed outputs",
  "Browser-local by default",
  "No account required",
] as const;

const evidenceLossRows = [
  "You remember the project, but not the details that make the work promotable.",
  "Review season becomes archaeology through Slack threads, docs, screenshots, and old dashboards.",
  "Resume bullets weaken when the strongest proof was never saved in one place.",
  "Interview stories lose credibility when outcomes and evidence are reconstructed from memory.",
] as const;

const captureFields = [
  "Situation and scope",
  "Action you personally drove",
  "Result and measurable outcome",
  "Stakeholders and visibility",
  "Screenshots, praise, and artifacts",
  "Tags that make the work reusable later",
] as const;

const captureSteps = [
  {
    step: "01",
    title: "Capture the work while the proof is still easy to recover",
    description:
      "Save the situation, action, result, metric, and stakeholders before the context diffuses across tools and meetings.",
  },
  {
    step: "02",
    title: "Attach the evidence that makes the story defensible",
    description:
      "Screenshots, praise, before-and-after notes, and artifact links travel with the entry instead of living in separate tabs.",
  },
  {
    step: "03",
    title: "Generate serious drafts from a real source of truth",
    description:
      "Promotion packets, self-reviews, resume bullets, and STAR stories stay specific because they start from structured proof.",
  },
] as const;

const trustStatements = [
  {
    title: "Stored in this browser",
    description:
      "Entries and saved proof stay in local browser storage on this device unless you choose to export them.",
  },
  {
    title: "You keep the backup",
    description:
      "Export and restore a JSON backup when you want safekeeping, migration, or a clean handoff between devices.",
  },
  {
    title: "No accounts or sync required",
    description:
      "No billing, no logins, and no cloud setup between you and the first entry that matters.",
  },
] as const;

const heroEntry = demoEntries.find((entry) => entry.id === "demo-ci-lane") ?? demoEntries[0];
const careerAssetEntries = demoEntries.slice(0, 3);

type ExampleOutput = {
  label: string;
  eyebrow: string;
  usedFor: string;
  documentLabel: string;
  excerpt: string;
};

function marketingButtonStyles(kind: "primary" | "secondary") {
  if (kind === "primary") {
    return buttonStyles({
      size: "lg",
      className: "min-w-44 px-6",
    });
  }

  return buttonStyles({
    variant: "secondary",
    size: "lg",
    className: "min-w-44 px-6",
  });
}

function takeDocumentExcerpt(content: string, maxNonEmptyLines: number) {
  const lines = content.split("\n");
  const excerptLines: string[] = [];
  let seenNonEmptyLines = 0;

  for (const line of lines) {
    excerptLines.push(line);

    if (line.trim().length > 0) {
      seenNonEmptyLines += 1;
    }

    if (seenNonEmptyLines >= maxNonEmptyLines) {
      break;
    }
  }

  const trimmed = excerptLines.join("\n").trimEnd();
  return excerptLines.length < lines.length ? `${trimmed}\n...` : trimmed;
}

function firstBulletLine(content: string) {
  return (
    content
      .split("\n")
      .find((line) => line.trim().startsWith("- ")) ??
    "Saved the win with a real outcome instead of a vague reminder."
  );
}

function buildExampleOutputs() {
  const promotionPacket = generateOutput({
    entries: careerAssetEntries,
    outputType: "promotionCase",
    tone: "executive",
    targetLevel: "Staff Engineer",
  });
  const selfReview = generateOutput({
    entries: careerAssetEntries.slice(0, 2),
    outputType: "selfReview",
    tone: "confident",
  });
  const resumeBullets = generateOutput({
    entries: careerAssetEntries.slice(0, 2),
    outputType: "resumeBullets",
    tone: "concise",
  });
  const starStories = generateOutput({
    entries: [demoEntries[2]],
    outputType: "starStories",
    tone: "technical",
  });

  return [
    {
      label: "Promotion packet",
      eyebrow: "Promotion conversation",
      usedFor: "Staff Engineer case",
      documentLabel: "Leadership narrative",
      excerpt: takeDocumentExcerpt(promotionPacket, 11),
    },
    {
      label: "Self-review",
      eyebrow: "Performance cycle",
      usedFor: "Manager-ready draft",
      documentLabel: "Review summary",
      excerpt: takeDocumentExcerpt(selfReview, 6),
    },
    {
      label: "Resume bullets",
      eyebrow: "Career narrative",
      usedFor: "External story",
      documentLabel: "Resume-ready bullets",
      excerpt: takeDocumentExcerpt(resumeBullets, 5),
    },
    {
      label: "STAR interview stories",
      eyebrow: "Interview prep",
      usedFor: "Prepared answers",
      documentLabel: "Structured examples",
      excerpt: takeDocumentExcerpt(starStories, 6),
    },
  ] as const satisfies readonly ExampleOutput[];
}

const exampleOutputs = buildExampleOutputs();
const promotionPacketPreview = exampleOutputs[0];
const supportingOutputPreviews = exampleOutputs.slice(1);
const generatedResumeBullet = firstBulletLine(supportingOutputPreviews[1]?.excerpt ?? "");
const heroSelfReviewPreview = supportingOutputPreviews[0];

function DocumentPreviewCard({
  output,
  variant = "compact",
}: {
  output: ExampleOutput;
  variant?: "feature" | "compact";
}) {
  const compact = variant === "compact";

  return (
    <Card
      variant="document"
      className={cn(
        "overflow-hidden rounded-[2.1rem] border border-white/70",
        compact ? "h-full" : "min-h-[31rem]",
      )}
    >
      <CardHeader className={cn("border-b border-border/80", compact ? "pb-4" : "pb-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardEyebrow>{output.eyebrow}</CardEyebrow>
            <CardTitle className={compact ? "text-[1.6rem]" : "text-[2rem]"}>
              {output.label}
            </CardTitle>
          </div>
          <Badge variant="selected" className="shrink-0">
            {output.usedFor}
          </Badge>
        </div>
        <CardDescription className="text-[#5d5144]">
          Generated from the same evidence packet instead of rewritten from scratch.
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? "pt-4" : "pt-5"}>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <span>BragBook document</span>
          <span>{output.documentLabel}</span>
        </div>
        <div className="mt-4 h-px bg-border/80" />
        <pre
          className={cn(
            "mt-4 whitespace-pre-wrap font-sans text-[#2d241b]",
            compact ? "text-[0.92rem] leading-7" : "document-prose",
          )}
        >
          {output.excerpt}
        </pre>
      </CardContent>
    </Card>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden pb-8">
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28 lg:pt-10">
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_top_left,rgba(154,103,51,0.22),transparent_28rem),radial-gradient(circle_at_85%_15%,rgba(23,19,16,0.12),transparent_24rem)]" />
        <div className="absolute left-[10%] top-24 h-48 w-48 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute right-[8%] top-12 h-64 w-64 rounded-full bg-accent/14 blur-3xl" />

        <div className="relative mx-auto max-w-[1260px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start xl:gap-12">
            <div className="space-y-8">
              <Badge variant="selected" className="px-4 py-2">
                Private career evidence vault
              </Badge>

              <div className="space-y-5">
                <h1 className="max-w-[9.4ch] font-display text-[clamp(3rem,5vw,4.65rem)] leading-[0.9] tracking-[-0.06em] text-foreground">
                  Keep the proof behind the work that should advance your career.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#4e4337] sm:text-[1.16rem]">
                  Capture wins while the details are fresh, then turn them into
                  promotion packets, self-reviews, resume bullets, and interview
                  stories.
                </p>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Built for ambitious professionals who want stronger evidence,
                  cleaner narratives, and less end-of-cycle reconstruction.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className={marketingButtonStyles("primary")}>
                  Open the app
                </Link>
                <Link
                  href="#proof-to-draft"
                  className={marketingButtonStyles("secondary")}
                >
                  See proof-to-draft examples
                </Link>
              </div>

              <div className="rounded-[1.75rem] border border-white/65 bg-white/58 px-5 py-5 shadow-[0_18px_34px_rgba(35,24,15,0.07)] backdrop-blur-md">
                <div className="grid gap-3 sm:grid-cols-2">
                  {heroProofStrip.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 rounded-[1.1rem] border border-white/55 bg-white/65 px-4 py-3"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                      <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative lg:pl-2 xl:pl-4">
              <Card
                variant="elevated"
                className="relative overflow-hidden rounded-[2.8rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(247,241,232,0.88))]"
              >
                <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(154,103,51,0.1),transparent)]" />
                <CardHeader className="relative border-b border-border/70 pb-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <CardEyebrow>Capture to career asset</CardEyebrow>
                      <CardTitle className="max-w-[22rem] text-[1.72rem] leading-[1.06]">
                        One evidence packet. Multiple career assets.
                      </CardTitle>
                    </div>
                    <Badge variant="selected">Browser-local by default</Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-5 pt-6">
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:items-start">
                    <div className="space-y-4">
                      <div className="rounded-[2rem] border border-white/75 bg-white/72 px-5 py-5 shadow-[0_18px_34px_rgba(29,20,13,0.06)]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="eyebrow-label">Saved entry</p>
                            <p className="mt-2 max-w-[12ch] font-display text-[1.5rem] leading-[1.02] tracking-[-0.04em] text-foreground">
                              {heroEntry.title}
                            </p>
                          </div>
                          <Badge variant="success">Strong proof</Badge>
                        </div>

                        <div className="mt-4 rounded-[1.25rem] border border-white/65 bg-[#fcf8f1] px-4 py-4">
                          <p className="eyebrow-label">Outcome snapshot</p>
                          <p className="mt-2 text-sm leading-7 text-[#44392d]">
                            {heroEntry.result}
                          </p>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[1.15rem] border border-white/65 bg-white/80 px-4 py-3">
                            <p className="eyebrow-label">Project</p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {heroEntry.project}
                            </p>
                          </div>
                          <div className="rounded-[1.15rem] border border-white/65 bg-white/80 px-4 py-3">
                            <p className="eyebrow-label">Metric</p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {heroEntry.metric}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[2rem] border border-white/75 bg-white/72 px-5 py-5 shadow-[0_18px_34px_rgba(29,20,13,0.06)]">
                        <div className="flex items-center justify-between gap-3">
                          <p className="eyebrow-label">Supporting proof</p>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {heroEntry.proofItems.length} items
                          </p>
                        </div>
                        <div className="mt-3 space-y-2">
                          {heroEntry.proofItems.map((proofItem) => (
                            <div
                              key={proofItem.id}
                              className="rounded-[1.1rem] border border-border/70 bg-[#f9f3ea] px-3 py-3"
                            >
                              <p className="text-sm font-semibold text-foreground">
                                {proofItem.title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {proofItem.metric ?? proofItem.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {heroEntry.tags.map((tag) => (
                            <Badge key={tag} variant="subtle">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[2rem] border border-white/75 bg-white/78 px-5 py-5 shadow-[0_18px_34px_rgba(29,20,13,0.06)]">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="accent">Promotion packet</Badge>
                          <Badge variant="selected">Self-review</Badge>
                          <Badge variant="subtle">Resume bullet</Badge>
                        </div>

                        <div className="mt-4 flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <p className="eyebrow-label">Primary output</p>
                            <p className="font-display text-[1.75rem] leading-[1.02] tracking-[-0.04em] text-foreground">
                              Case for Staff Engineer
                            </p>
                          </div>
                          <div className="text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            <p>Proof-backed draft</p>
                            <p className="mt-1">Editable</p>
                          </div>
                        </div>

                        <pre className="mt-4 max-h-[16rem] overflow-hidden whitespace-pre-wrap font-sans text-[0.93rem] leading-7 text-[#2d241b]">
                          {takeDocumentExcerpt(promotionPacketPreview.excerpt, 8)}
                        </pre>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-[1.15rem] border border-border/70 bg-[#fcf8f1] px-3 py-3">
                            <p className="eyebrow-label">Entries used</p>
                            <p className="mt-2 text-sm font-semibold text-foreground">3 strong accomplishments</p>
                          </div>
                          <div className="rounded-[1.15rem] border border-border/70 bg-[#fcf8f1] px-3 py-3">
                            <p className="eyebrow-label">Frame</p>
                            <p className="mt-2 text-sm font-semibold text-foreground">Competency-based case</p>
                          </div>
                          <div className="rounded-[1.15rem] border border-border/70 bg-[#fcf8f1] px-3 py-3">
                            <p className="eyebrow-label">Use next</p>
                            <p className="mt-2 text-sm font-semibold text-foreground">Promotion conversation</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <Card
                          variant="document"
                          className="rounded-[1.8rem] border border-white/75"
                        >
                          <CardContent className="space-y-3 pt-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="eyebrow-label">Supporting draft</p>
                              <Badge variant="accent">Generated</Badge>
                            </div>
                            <p className="font-display text-[1.35rem] leading-none tracking-[-0.04em] text-foreground">
                              {heroSelfReviewPreview?.label ?? "Self-review"}
                            </p>
                            <pre className="max-h-[8.5rem] overflow-hidden whitespace-pre-wrap font-sans text-[0.87rem] leading-6 text-[#2d241b]">
                              {takeDocumentExcerpt(heroSelfReviewPreview?.excerpt ?? "", 4)}
                            </pre>
                          </CardContent>
                        </Card>

                        <Card
                          variant="feature"
                          className="rounded-[1.8rem] border border-white/10"
                        >
                          <CardContent className="space-y-4 pt-4">
                            <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
                              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#cfbea9]">
                                Before
                              </p>
                              <p className="mt-2 text-sm leading-6 text-[#f0e6d8]">
                                Helped stabilize CI and wrote some notes for the team.
                              </p>
                            </div>
                            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 px-4 py-3">
                              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#cfbea9]">
                                After
                              </p>
                              <p className="mt-2 text-sm leading-6 text-[#f7f1e8]">
                                {generatedResumeBullet}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[2.9rem] bg-[#171310] shadow-[0_36px_80px_rgba(17,13,10,0.22)]">
          <div className="grid gap-10 px-6 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-9">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#cfbea9]">
                Cost of waiting
              </p>
              <h2 className="section-title text-[#f7f1e8]">
                Career evidence disappears into scattered artifacts.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[#cfbea9]">
                By the time you need a clean promotion or review narrative, the
                strongest details are fragmented across tools, timelines, and
                half-remembered context.
              </p>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/4">
              {evidenceLossRows.map((point, index) => (
                <div
                  key={point}
                  className={cn(
                    "grid gap-3 px-5 py-5 md:grid-cols-[auto_1fr] md:items-start",
                    index > 0 ? "border-t border-white/10" : "",
                  )}
                >
                  <span className="font-display text-[1.55rem] leading-none tracking-[-0.04em] text-[#f7f1e8]">
                    0{index + 1}
                  </span>
                  <p className="text-base leading-7 text-[#f0e6d8]">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="proof-to-draft"
        className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-[1240px] space-y-8">
          <div className="grid gap-8 xl:grid-cols-[0.74fr_1.26fr] xl:items-start">
            <div className="space-y-4">
              <p className="eyebrow-label">Proof to draft examples</p>
              <h2 className="section-title text-foreground">
                One evidence packet can become four serious career assets.
              </h2>
              <p className="support-copy max-w-xl">
                BragBook keeps a single source of truth for the accomplishment,
                then reshapes it for the document you need next.
              </p>
              <div className="rounded-[1.75rem] border border-border/80 bg-white/60 px-5 py-5">
                <p className="text-sm font-semibold text-foreground">
                  Structured proof becomes promotion packets, self-reviews,
                  resume bullets, and interview stories without turning vague or
                  repetitive.
                </p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
              <DocumentPreviewCard output={promotionPacketPreview} variant="feature" />
              <div className="grid gap-4">
                {supportingOutputPreviews.map((output) => (
                  <DocumentPreviewCard
                    key={output.label}
                    output={output}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
            <Card variant="elevated" className="rounded-[2.7rem]">
              <CardHeader className="space-y-4">
                <CardEyebrow>What BragBook captures</CardEyebrow>
                <CardTitle className="text-[2.3rem]">
                  Built for the work between delivery and recognition.
                </CardTitle>
                <CardDescription>
                  The point is not to save a vague memory. The point is to keep
                  the structured evidence that makes the work reusable later.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-[2rem] border border-white/70 bg-white/74 px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow-label">Evidence packet anatomy</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Every entry can hold the context, outcome, and proof you
                        need later.
                      </p>
                    </div>
                    <Badge variant="accent">Structured source</Badge>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {captureFields.map((field, index) => (
                      <div
                        key={field}
                        className={cn(
                          "rounded-[1.3rem] border px-4 py-4",
                          index === 2
                            ? "border-accent/20 bg-accent/8"
                            : "border-border/70 bg-[#faf4eb]",
                        )}
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {field}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.85rem] border border-border/75 bg-[#f8f2e9] px-5 py-5">
                  <p className="text-sm leading-7 text-[#4a4034]">
                    This is what keeps the final output specific, credible, and
                    reusable across multiple career moments.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {captureSteps.map((step, index) => (
                <Card
                  key={step.step}
                  variant={index === 1 ? "feature" : index === 2 ? "default" : "quiet"}
                  className="rounded-[2rem]"
                >
                  <CardContent className="grid gap-4 pt-5 md:grid-cols-[auto_1fr] md:items-start">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold",
                        index === 1
                          ? "border-white/10 bg-white/10 text-[#f7f1e8]"
                          : "border-accent/20 bg-accent/8 text-foreground",
                      )}
                    >
                      {step.step}
                    </div>
                    <div className="space-y-2">
                      <h3
                        className={cn(
                          "font-display text-[1.6rem] leading-[1.03] tracking-[-0.04em]",
                          index === 1 ? "text-[#f7f1e8]" : "text-foreground",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm leading-7",
                          index === 1 ? "text-[#cfbea9]" : "text-muted-foreground",
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="rounded-[1.9rem] border border-dashed border-border-strong/70 bg-white/52 px-5 py-5">
                <p className="text-sm font-semibold leading-7 text-foreground">
                  The result is a calmer review cycle and stronger career
                  materials because the evidence base already exists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1180px] rounded-[2.7rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,251,246,0.92),rgba(244,236,226,0.88))] shadow-[0_24px_52px_rgba(28,20,13,0.1)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 lg:py-8">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="eyebrow-label">Privacy and ownership</p>
                <h2 className="section-title text-foreground">
                  Clear local ownership, without defensive language.
                </h2>
                <p className="support-copy">
                  The privacy model is simple: your evidence stays here unless
                  you choose to export it.
                </p>
              </div>

              <div className="space-y-3">
                {trustStatements.map((statement) => (
                  <div
                    key={statement.title}
                    className="rounded-[1.5rem] border border-white/70 bg-white/72 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {statement.title}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">
                      {statement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Card variant="document" className="rounded-[2.1rem] border border-white/75">
              <CardHeader>
                <CardEyebrow>Backup caveat</CardEyebrow>
                <CardTitle className="text-[2rem]">
                  Local-only works best when the backup story is explicit.
                </CardTitle>
                <CardDescription className="text-[#5d5144]">
                  Export a JSON backup before browser cleanup, device changes, or
                  switching browsers. Local browser storage is deliberate, but it
                  is still local storage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.4rem] border border-border/70 bg-white/72 px-4 py-4">
                  <p className="eyebrow-label">Practical default</p>
                  <p className="mt-2 text-sm leading-7 text-[#4a4034]">
                    Raw notes, screenshots, and praise stay on this device until
                    you decide a backup belongs somewhere else.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-warning/25 bg-warning/10 px-4 py-4">
                  <p className="text-sm leading-7 text-[#4a4034]">
                    If the stored proof matters, export the backup before doing
                    anything that clears local browser data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[2.9rem] bg-[#171310] shadow-[0_36px_80px_rgba(17,13,10,0.24)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:py-9">
            <div className="max-w-3xl space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#cfbea9]">
                Capture before it fades
              </p>
              <h2 className="section-title text-[#f7f1e8]">
                The evidence is strongest now, not at review time.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[#cfbea9]">
                Open BragBook, capture one recent win, and leave with material
                you can reuse in the next review, promotion conversation, or
                interview loop.
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/dashboard" className={marketingButtonStyles("primary")}>
                Open the app
              </Link>
              <Link
                href="/settings"
                className="block text-sm font-semibold text-[#cfbea9] underline-offset-4 transition hover:text-[#f7f1e8] hover:underline"
              >
                Review privacy and backup controls
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
