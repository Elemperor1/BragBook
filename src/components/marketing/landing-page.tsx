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

const captureSteps = [
  {
    step: "01",
    title: "Capture the work while it is still easy to recover.",
    description:
      "Save the situation, action, result, metric, and stakeholders before the context diffuses across tools and meetings.",
  },
  {
    step: "02",
    title: "Attach the proof that makes the story defensible.",
    description:
      "Screenshots, praise, before-and-after notes, and artifact links stay with the entry instead of living in separate tabs.",
  },
  {
    step: "03",
    title: "Generate serious drafts from a real source of truth.",
    description:
      "Promotion packets, self-reviews, resume bullets, and STAR interview stories stay specific because they start from structured evidence.",
  },
] as const;

const evidencePacketFields = [
  "Situation and scope",
  "Action you personally drove",
  "Result and measurable outcome",
  "Stakeholders and visibility",
  "Screenshots, praise, and artifacts",
  "Tags that make the work reusable later",
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

type ExampleOutput = {
  label: string;
  eyebrow: string;
  usedFor: string;
  documentLabel: string;
  excerpt: string;
};

const heroEntry = demoEntries.find((entry) => entry.id === "demo-ci-lane") ?? demoEntries[0];
const heroProofItems = heroEntry.proofItems.slice(0, 1);
const heroStakeholders = heroEntry.stakeholders.slice(0, 2);
const careerAssetEntries = demoEntries.slice(0, 3);
const heroEntryDisplayTitle = "Stabilized CI for monorepo builds";

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

function truncateText(content: string, maxLength: number) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 1).trimEnd()}…`
    : normalized;
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
      excerpt: takeDocumentExcerpt(promotionPacket, 10),
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
const heroSelfReviewPreview = supportingOutputPreviews[0];
const heroOutcomeSnapshot = truncateText(
  heroEntry.result ?? "Saved with clear impact, ownership, and visible business value.",
  94,
);
const heroMetricSummary = "18% -> 3% in one sprint";
const heroProofSummary = truncateText(
  heroProofItems[0]?.metric ?? heroProofItems[0]?.summary ?? "",
  54,
);
const heroPromotionSummary = truncateText(
  promotionPacketPreview.excerpt.replace(/\s+/g, " "),
  190,
);
const heroSelfReviewExcerpt = truncateText(
  takeDocumentExcerpt(heroSelfReviewPreview?.excerpt ?? "", 2)
    .replace(/^Self-review\s*/i, "")
    .replace(/\n+/g, " "),
  42,
);
const generatedResumeBullet = truncateText(
  firstBulletLine(supportingOutputPreviews[1]?.excerpt ?? "").replace(/^- /, ""),
  46,
);

function OutputPreviewCard({
  output,
  featured = false,
}: {
  output: ExampleOutput;
  featured?: boolean;
}) {
  return (
    <Card
      variant="document"
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/75",
        featured ? "min-h-[29rem]" : "h-full",
      )}
    >
      <CardHeader className="border-b border-border/80 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardEyebrow>{output.eyebrow}</CardEyebrow>
            <CardTitle className={featured ? "text-[1.95rem]" : "text-[1.55rem]"}>
              {output.label}
            </CardTitle>
          </div>
          <Badge variant={featured ? "accent" : "selected"}>{output.usedFor}</Badge>
        </div>
        <CardDescription className="text-[#5d5144]">
          Generated from saved evidence instead of rebuilt from memory.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>BragBook document</span>
          <span>{output.documentLabel}</span>
        </div>
        <div className="mt-4 h-px bg-border/80" />
        <pre
          className={cn(
            "mt-4 whitespace-pre-wrap font-sans text-[#2d241b]",
            featured ? "document-prose max-h-[19rem] overflow-hidden" : "max-h-[12rem] overflow-hidden text-[0.92rem] leading-7",
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
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-22 lg:pt-8">
        <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(154,103,51,0.18),transparent_26rem),radial-gradient(circle_at_85%_15%,rgba(23,19,16,0.08),transparent_26rem)]" />
        <div className="absolute left-[10%] top-24 h-48 w-48 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute right-[10%] top-12 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:items-start xl:gap-8">
            <div className="space-y-6">
              <Badge variant="selected" className="px-4 py-2">
                Private career evidence vault
              </Badge>

              <div className="space-y-5">
                <h1 className="max-w-[10.5ch] font-display text-[clamp(2.6rem,4vw,3.95rem)] leading-[0.92] tracking-[-0.06em] text-foreground">
                  Keep the proof behind the work that should advance your career.
                </h1>
                <p className="max-w-2xl text-[1.02rem] leading-7 text-[#4e4337] sm:text-[1.08rem]">
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

              <div className="grid max-w-[29rem] gap-x-7 gap-y-2.5 sm:grid-cols-2">
                {heroProofStrip.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card
                variant="elevated"
                className="overflow-hidden rounded-[2.85rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(247,241,232,0.9))]"
              >
                <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 lg:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#d9b48c]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#d7d0c5]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#c4baad]" />
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                      BragBook workspace
                    </p>
                  </div>
                  <Badge variant="selected">Browser-local by default</Badge>
                </div>

                <div className="space-y-3 p-4 lg:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow-label">Capture to career asset</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f5347]">
                        Structured evidence in, promotion-ready draft out.
                      </p>
                    </div>
                    <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:block">
                      Saved evidence to editable draft
                    </p>
                  </div>

                  <div className="grid gap-3 xl:grid-cols-[minmax(0,0.31fr)_minmax(0,0.69fr)] xl:items-stretch">
                    <div className="rounded-[1.7rem] border border-white/75 bg-white/78 px-3.5 py-3.5 shadow-[0_16px_28px_rgba(29,20,13,0.05)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="eyebrow-label">Saved entry</p>
                          <p className="mt-2 max-w-[9ch] font-display text-[1.24rem] leading-[1.02] tracking-[-0.04em] text-foreground">
                            {heroEntryDisplayTitle}
                          </p>
                        </div>
                        <Badge variant="success" className="px-2.5 py-1">
                          Strong proof
                        </Badge>
                      </div>

                      <div className="mt-3 rounded-[1.05rem] border border-white/65 bg-[#fcf8f1] px-3 py-2.5">
                        <p className="eyebrow-label">Outcome snapshot</p>
                        <p className="mt-2 text-sm leading-6 text-[#44392d]">
                          {heroOutcomeSnapshot}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="rounded-full border border-white/65 bg-white/85 px-3 py-1.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Project
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {heroEntry.project}
                          </p>
                        </div>
                        <div className="rounded-full border border-white/65 bg-white/85 px-3 py-1.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Metric
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {heroMetricSummary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-[1rem] border border-border/70 bg-[#f9f3ea] px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="eyebrow-label">Proof attached</p>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {heroProofItems.length} item
                          </p>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {heroProofItems[0]?.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {heroProofSummary}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {heroStakeholders.map((stakeholder) => (
                          <Badge key={stakeholder} variant="subtle" className="px-2.5 py-1">
                            {stakeholder}
                          </Badge>
                        ))}
                        {heroEntry.tags.slice(0, 1).map((tag) => (
                          <Badge key={tag} variant="subtle" className="px-2.5 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Card
                      variant="document"
                      className="overflow-hidden rounded-[2rem] border border-white/75"
                    >
                      <CardHeader className="border-b border-border/80 pb-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="accent" className="px-2.5 py-1">
                              Promotion packet
                            </Badge>
                            <Badge variant="selected" className="px-2.5 py-1">
                              Staff Engineer case
                            </Badge>
                          </div>
                          <Badge variant="subtle" className="px-2.5 py-1">
                            Proof-backed draft
                          </Badge>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                          <div className="space-y-2">
                            <CardEyebrow>Primary output</CardEyebrow>
                            <CardTitle className="text-[1.55rem]">
                              Case for Staff Engineer
                            </CardTitle>
                            <CardDescription className="max-w-[34rem] text-[14px] leading-6 text-[#5d5144]">
                              One promotion-ready narrative built from saved accomplishments, proof, and visible outcomes.
                            </CardDescription>
                          </div>
                          <div className="rounded-full border border-border/70 bg-[#fcf8f1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Editable
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-3.5">
                        <div className="rounded-[1.2rem] border border-border/70 bg-[#fcf8f1] px-4 py-3.5">
                          <p className="eyebrow-label">Draft excerpt</p>
                          <p className="mt-2 text-[0.96rem] leading-7 text-[#2d241b]">
                            {heroPromotionSummary}
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="rounded-[1.05rem] border border-border/70 bg-[#fcf8f1] px-3 py-2.5">
                            <p className="eyebrow-label">Entries used</p>
                            <p className="mt-1.5 text-sm font-semibold text-foreground">
                              3 strong accomplishments
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/70 bg-[#fcf8f1] px-3 py-2.5">
                            <p className="eyebrow-label">Frame</p>
                            <p className="mt-1.5 text-sm font-semibold text-foreground">
                              Competency-based case
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/70 bg-[#fcf8f1] px-3 py-2.5">
                            <p className="eyebrow-label">Use next</p>
                            <p className="mt-1.5 text-sm font-semibold text-foreground">
                              Promotion conversation
                            </p>
                          </div>
                        </div>

                        <div className="rounded-[1.15rem] border border-border/70 bg-white/82 px-3.5 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="eyebrow-label">Also generated</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="selected" className="px-2.5 py-1">
                                Self-review
                              </Badge>
                              <Badge variant="subtle" className="px-2.5 py-1">
                                Resume bullets
                              </Badge>
                              <Badge variant="subtle" className="px-2.5 py-1">
                                STAR stories
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-2.5 grid gap-2.5 md:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
                            <div className="rounded-[1rem] border border-border/70 bg-[#fcf8f1] px-3 py-2.5">
                              <p className="eyebrow-label">Self-review summary</p>
                              <p className="mt-2 text-sm leading-6 text-[#3a3027]">
                                {heroSelfReviewExcerpt}
                              </p>
                            </div>

                            <div className="rounded-[1rem] border border-white/10 bg-[#221b16] px-3 py-2.5 text-[#f7f1e8]">
                              <div className="grid gap-2 sm:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
                                <div>
                                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#cfbea9]">
                                    Before
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-[#f0e6d8]">
                                    Helped stabilize CI and wrote some notes for the team.
                                  </p>
                                </div>
                                <div>
                                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#cfbea9]">
                                    Resume bullet
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-[#f7f1e8]">
                                    {generatedResumeBullet}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
                Why evidence disappears
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
          <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
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

            <div className="grid gap-5 xl:grid-cols-[1.06fr_0.94fr]">
              <OutputPreviewCard output={promotionPacketPreview} featured />
              <div className="grid gap-4">
                {supportingOutputPreviews.map((output) => (
                  <OutputPreviewCard key={output.label} output={output} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
            <Card variant="feature" className="rounded-[2.7rem] border border-white/10">
              <CardHeader className="space-y-4">
                <CardEyebrow className="text-[#cfbea9]">What BragBook captures</CardEyebrow>
                <CardTitle className="text-[2.25rem] text-[#f7f1e8]">
                  Built for the work between delivery and recognition.
                </CardTitle>
                <CardDescription className="text-[#cfbea9]">
                  The point is not to save a vague memory. The point is to keep
                  the evidence base that makes the work reusable later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {captureSteps.map((step) => (
                  <div
                    key={step.step}
                    className="rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-[#f7f1e8]">
                        {step.step}
                      </span>
                      <div className="space-y-2">
                        <h3 className="font-display text-[1.45rem] leading-[1.03] tracking-[-0.04em] text-[#f7f1e8]">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-7 text-[#cfbea9]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="elevated" className="rounded-[2.7rem]">
              <CardHeader className="space-y-4">
                <CardEyebrow>Evidence packet anatomy</CardEyebrow>
                <CardTitle className="text-[2.15rem]">
                  The saved entry should already contain the raw materials.
                </CardTitle>
                <CardDescription>
                  Every strong draft downstream depends on having the right facts,
                  outcomes, and proof stored once.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {evidencePacketFields.map((field, index) => (
                    <div
                      key={field}
                      className={cn(
                        "rounded-[1.3rem] border px-4 py-4",
                        index === 2
                          ? "border-accent/20 bg-accent/8"
                          : "border-border/70 bg-[#faf4eb]",
                      )}
                    >
                      <p className="text-sm font-semibold text-foreground">{field}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.7rem] border border-border/75 bg-[#f8f2e9] px-5 py-5">
                  <p className="text-sm leading-7 text-[#4a4034]">
                    This is what keeps the final output specific, credible, and
                    reusable across review cycles, promotion packets, resumes,
                    and interview prep.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1180px] rounded-[2.7rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,251,246,0.92),rgba(244,236,226,0.88))] shadow-[0_24px_52px_rgba(28,20,13,0.1)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:py-8">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="eyebrow-label">Privacy and ownership</p>
                <h2 className="section-title text-foreground">
                  Clear local ownership, without defensive copy.
                </h2>
                <p className="support-copy">
                  The privacy model is simple: your evidence stays here unless
                  you decide a backup belongs somewhere else.
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
                Final CTA
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
