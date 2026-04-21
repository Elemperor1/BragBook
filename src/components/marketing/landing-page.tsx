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

const heroSignals = [
  "Promotion-ready proof",
  "Review season without archaeology",
  "Browser-local by default",
  "No account required",
] as const;

const painPoints = [
  "The project was important, but the details that made it promotable were never captured.",
  "Review season turns into reconstructing proof from Slack threads, docs, dashboards, and memory.",
  "Resume bullets flatten when the measurable outcome and personal ownership are missing.",
  "Interview stories lose credibility when proof and context are rebuilt months later.",
] as const;

const workflowSteps = [
  {
    step: "01",
    title: "Capture the win while the evidence is still fresh.",
    description:
      "Save the situation, action, result, metric, stakeholders, and proof before the work diffuses across tools and meetings.",
  },
  {
    step: "02",
    title: "Keep the source material structured.",
    description:
      "Screenshots, praise, artifacts, before-and-after notes, and tags stay attached to the accomplishment instead of scattered across tabs.",
  },
  {
    step: "03",
    title: "Turn proof into serious career documents.",
    description:
      "Promotion packets, self-reviews, resume bullets, and STAR stories stay specific because they start from a saved evidence base.",
  },
] as const;

const trustLedger = [
  {
    label: "Storage",
    value: "This browser",
    description:
      "Entries and saved proof stay in local browser storage on this device unless you export them.",
  },
  {
    label: "Backup",
    value: "Your JSON file",
    description:
      "Export a portable backup for safekeeping, browser cleanup, or moving to another device.",
  },
  {
    label: "Access",
    value: "No account",
    description:
      "No login, billing, team workspace, or cloud setup is required to capture the first useful entry.",
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
const heroProofItems = heroEntry.proofItems.slice(0, 2);
const careerAssetEntries = demoEntries.slice(0, 3);

function marketingButtonStyles(
  kind: "primary" | "secondary",
  className?: string,
) {
  if (kind === "primary") {
    return buttonStyles({
      size: "lg",
      className: cn("w-full px-5 tracking-normal sm:w-auto sm:min-w-44 sm:px-6", className),
    });
  }

  return buttonStyles({
    variant: "secondary",
    size: "lg",
    className: cn("w-full px-5 tracking-normal sm:w-auto sm:min-w-44 sm:px-6", className),
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
    "Saved the win with a measurable outcome, clear ownership, and proof attached."
  );
}

function truncateText(content: string | null | undefined, maxLength: number) {
  const normalized = content?.replace(/\s+/g, " ").trim() ?? "";
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 1).trimEnd()}...`
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
const resumeBullet = truncateText(
  firstBulletLine(supportingOutputPreviews[1]?.excerpt ?? "").replace(/^- /, ""),
  118,
);
const heroPromotionSummary = truncateText(
  promotionPacketPreview.excerpt.replace(/\s+/g, " "),
  330,
);

function DocumentPreview({
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
        "overflow-hidden rounded-[1.45rem] border border-white/80",
        featured ? "self-start" : "h-full",
      )}
    >
      <CardHeader
        className={cn("border-b border-border/75 pb-4", featured ? "" : "p-5")}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardEyebrow>{output.eyebrow}</CardEyebrow>
            <CardTitle
              className={cn(
                "tracking-normal",
                featured ? "text-[2.05rem]" : "text-[1.45rem]",
              )}
            >
              {output.label}
            </CardTitle>
          </div>
          <Badge variant={featured ? "accent" : "selected"}>{output.usedFor}</Badge>
        </div>
        <CardDescription className="text-[#5d5144]">
          Generated from saved evidence, not rebuilt from memory.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn("pt-4", featured ? "" : "px-5 pb-5 md:px-5 md:pb-5")}
      >
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>BragBook document</span>
          <span>{output.documentLabel}</span>
        </div>
        <div className="mt-4 h-px bg-border/75" />
        <pre
          className={cn(
            "mt-4 whitespace-pre-wrap font-sans text-[#2d241b]",
            featured
              ? "document-prose max-h-[19.5rem] overflow-hidden"
              : "max-h-[9.5rem] overflow-hidden text-[0.92rem] leading-7",
          )}
        >
          {output.excerpt}
        </pre>
      </CardContent>
    </Card>
  );
}

function EvidencePacketPanel() {
  return (
    <div className="self-start overflow-hidden rounded-[1.45rem] bg-[#15110e] text-[#f8efe3] shadow-[0_24px_52px_rgba(21,17,14,0.18)]">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#cdbda9]">
          Source evidence packet
        </p>
        <h3 className="mt-3 font-display text-[2rem] leading-[0.96] tracking-normal text-[#fff7ed]">
          One saved win, structured enough to reuse.
        </h3>
      </div>
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-1">
        <div className="border-b border-white/10 px-6 py-4 sm:border-b-0 sm:border-r lg:border-b lg:border-r-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#cdbda9]">
            Accomplishment
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#fff7ed]">
            Stabilized CI for monorepo builds
          </p>
        </div>
        <div className="border-b border-white/10 px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#cdbda9]">
            Measurable outcome
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#fff7ed]">
            Failure rate dropped from 18% to 3% within one sprint.
          </p>
        </div>
        <div className="px-6 py-4 sm:col-span-2 lg:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#cdbda9]">
            Becomes
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {exampleOutputs.map((output) => (
              <Badge key={output.label} variant="feature">
                {output.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceField({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-t border-[#ded0bf] py-3 first:border-t-0",
        emphasis ? "text-[#15110e]" : "text-[#4d4237]",
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8c7a68]">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-6">{value}</p>
    </div>
  );
}

function TrustLedgerItem({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="grid gap-3 border-t border-border/75 py-5 first:border-t-0 md:grid-cols-[0.32fr_0.3fr_1fr] md:items-start">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-[1.45rem] leading-none tracking-normal text-foreground">
        {value}
      </p>
      <p className="text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#f3ece2] pb-8">
      <section className="relative isolate overflow-hidden bg-[#15110e] px-4 py-6 text-[#f7f1e8] sm:px-6 lg:min-h-[92svh] lg:px-8 lg:py-8">
        <div className="absolute inset-y-0 right-0 hidden w-[55vw] bg-[#eadfce] lg:block" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#15110e_0%,#15110e_48%,rgba(21,17,14,0.52)_62%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid w-full min-w-0 max-w-[1280px] gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="w-[min(100%,358px)] min-w-0 max-w-2xl space-y-6 py-7 sm:w-auto lg:space-y-7 lg:py-12">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#cdbda9]">
                BragBook
              </p>
              <Badge variant="feature" className="px-4 py-2">
                Private career evidence vault
              </Badge>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-full text-balance font-display text-[3.35rem] leading-[0.84] tracking-normal text-[#fff7ed] sm:max-w-[9.6ch] sm:text-[5.3rem] lg:text-[6.15rem] xl:text-[7rem]">
                Turn your best work into career leverage.
              </h1>
              <p className="w-full max-w-full text-[1.04rem] leading-8 text-[#eadccb] sm:max-w-[39rem] sm:text-[1.22rem]">
                Capture proof while the details are fresh, then turn it into
                promotion packets, self-reviews, resume bullets, and interview
                stories from evidence you own.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-3 sm:w-fit">
              <Link
                href="/dashboard"
                className={marketingButtonStyles(
                  "primary",
                  "bg-[#fff7ed] text-[#15110e] hover:bg-white focus-visible:ring-white/30",
                )}
              >
                Open BragBook
              </Link>
              <Link
                href="#proof-to-output"
                className={marketingButtonStyles(
                  "secondary",
                  "bg-transparent text-[#fff7ed] ring-1 ring-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-white/30",
                )}
              >
                See proof-to-output examples
              </Link>
            </div>

            <div className="grid max-w-[36rem] grid-cols-1 gap-x-5 gap-y-3 border-t border-white/10 pt-5 sm:grid-cols-2 sm:gap-x-7">
              {heroSignals.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#c9975c]" />
                  <p className="text-sm font-semibold tracking-normal text-[#f7f1e8]">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 pb-4 lg:pb-0">
            <div className="mx-auto w-[min(100%,358px)] min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-[#fff5e6]/80 bg-[#f8efe3] text-[#1f1914] shadow-[0_36px_90px_rgba(0,0,0,0.32)] sm:w-full sm:max-w-[760px] lg:translate-x-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9c9b8] bg-[#fff8ee] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c98d58]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d7c7b7]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8f7e6c]" />
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#766655]">
                    BragBook workspace
                  </p>
                </div>
                <Badge variant="selected">Evidence to output</Badge>
              </div>

              <div className="grid gap-0 lg:grid-cols-[0.43fr_0.57fr]">
                <div className="border-b border-[#dccdba] bg-[#f2e6d7] p-5 lg:border-b-0 lg:border-r">
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#806f5e]">
                      Saved accomplishment
                    </p>
                    <h2 className="font-display text-[2rem] leading-[0.96] tracking-normal text-[#171310]">
                      Stabilized CI for monorepo builds
                    </h2>
                    <p className="text-sm leading-6 text-[#5a4b3f]">
                      The raw material behind a stronger promotion case.
                    </p>
                  </div>

                  <div className="mt-5 rounded-[1.25rem] border border-[#dac9b5] bg-[#fff9ef] px-4 py-3">
                    <EvidenceField
                      label="Situation"
                      value={truncateText(heroEntry.situation, 126)}
                    />
                    <EvidenceField
                      label="Action"
                      value={truncateText(heroEntry.action, 126)}
                    />
                    <EvidenceField
                      label="Result"
                      value={truncateText(heroEntry.result, 116)}
                    />
                    <EvidenceField
                      label="Metric"
                      value={heroEntry.metric ?? "Measurable outcome attached."}
                      emphasis
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="success">Strong proof</Badge>
                    {heroEntry.stakeholders.slice(0, 2).map((stakeholder) => (
                      <Badge key={stakeholder} variant="subtle">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-[#fbf5ec] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#806f5e]">
                        Generated draft
                      </p>
                      <h2 className="mt-2 font-display text-[2.25rem] leading-[0.93] tracking-normal text-[#171310]">
                        Promotion packet
                      </h2>
                    </div>
                    <Badge variant="accent">Editable</Badge>
                  </div>

                  <div className="mt-5 rounded-[1.35rem] border border-[#ded0bf] bg-[#fffbf5] px-5 py-4 shadow-[0_18px_36px_rgba(38,27,17,0.08)]">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#8c7a68]">
                      <span>Staff Engineer case</span>
                      <span>3 entries used</span>
                    </div>
                    <div className="mt-3 h-px bg-[#e2d5c5]" />
                    <p className="mt-4 text-[0.98rem] leading-7 text-[#30261f]">
                      {heroPromotionSummary}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[0.42fr_0.58fr]">
                    <div className="rounded-[1.1rem] border border-[#ded0bf] bg-[#f4eadc] px-4 py-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#806f5e]">
                        Proof attached
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#171310]">
                        {heroProofItems.length} evidence items
                      </p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[#2b211b] bg-[#18130f] px-4 py-3 text-[#f8efe3]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4bfa8]">
                        Before
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#eadccb]">
                        Helped stabilize CI and wrote notes for the team.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[1.1rem] border border-[#d7c5af] bg-[#fff9ef] px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#806f5e]">
                      Resume bullet
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#171310]">
                      {resumeBullet}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#15110e] px-4 py-16 text-[#f7f1e8] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#cdbda9]">
              Why it matters
            </p>
            <h2 className="section-title tracking-normal text-[#fff7ed]">
              Career evidence disappears before you need it.
            </h2>
            <p className="max-w-xl text-base leading-7 text-[#cdbda9]">
              The best work often happens in the messy middle: incidents,
              migrations, escalations, launches, and quiet fixes. BragBook keeps
              those details from becoming vague memories.
            </p>
          </div>

          <div className="border-y border-white/10">
            {painPoints.map((point, index) => (
              <div
                key={point}
                className="grid gap-4 border-t border-white/10 py-5 first:border-t-0 md:grid-cols-[auto_1fr] md:items-start"
              >
                <span className="font-display text-[2rem] leading-none tracking-normal text-[#c9975c]">
                  0{index + 1}
                </span>
                <p className="max-w-3xl text-[1.05rem] leading-8 text-[#f1e5d6]">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="proof-to-output"
        className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-[1240px] space-y-8">
          <div className="grid gap-6 lg:grid-cols-[0.74fr_0.56fr] lg:items-end">
            <div className="space-y-4">
              <p className="eyebrow-label">Proof to output examples</p>
              <h2 className="section-title max-w-3xl tracking-normal text-foreground">
                One evidence packet can become every career document you need next.
              </h2>
              <p className="support-copy max-w-xl">
                Structured proof becomes promotion packets, self-reviews, resume
                bullets, and interview stories without turning vague or
                repetitive.
              </p>
            </div>
            <div className="border-l-2 border-accent pl-5">
              <p className="text-sm font-semibold leading-7 text-foreground">
                The conversion value is specificity: ownership, context,
                measurable outcomes, and proof travel together into each draft.
              </p>
            </div>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[1.08fr_0.72fr]">
            <DocumentPreview output={promotionPacketPreview} featured />
            <EvidencePacketPanel />
          </div>

          <div className="grid items-start gap-4 md:grid-cols-3">
            {supportingOutputPreviews.map((output) => (
              <DocumentPreview key={output.label} output={output} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
            <div className="space-y-4">
              <p className="eyebrow-label">How the habit works</p>
              <h2 className="section-title tracking-normal text-foreground">
                Less journaling. More reusable proof.
              </h2>
              <p className="support-copy">
                BragBook is designed around the handful of facts that make work
                promotable later.
              </p>
            </div>

            <div className="border-y border-border-strong">
              {workflowSteps.map((step) => (
                <div
                  key={step.step}
                  className="grid gap-5 border-t border-border/80 py-6 first:border-t-0 md:grid-cols-[6rem_1fr]"
                >
                  <p className="font-display text-[3.5rem] leading-none tracking-normal text-accent">
                    {step.step}
                  </p>
                  <div className="space-y-2">
                    <h3 className="font-display text-[1.75rem] leading-[1.02] tracking-normal text-foreground">
                      {step.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 rounded-[2rem] border border-white/80 bg-[#fff8ee] px-6 py-7 shadow-[0_24px_56px_rgba(28,20,13,0.1)] lg:grid-cols-[0.38fr_0.62fr] lg:px-8 lg:py-9">
          <div className="space-y-4">
            <p className="eyebrow-label">Privacy and ownership</p>
            <h2 className="section-title tracking-normal text-foreground">
              Your career evidence should feel owned, not borrowed.
            </h2>
            <p className="support-copy">
              The trust model is simple enough to scan: local storage for daily
              use, exportable backups for control.
            </p>
          </div>

          <div className="border-y border-border/80">
            {trustLedger.map((item) => (
              <TrustLedgerItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[2rem] bg-[#15110e] text-[#f7f1e8] shadow-[0_36px_80px_rgba(17,13,10,0.24)]">
          <div className="grid gap-8 px-6 py-9 lg:grid-cols-[1fr_auto] lg:items-end lg:px-9 lg:py-10">
            <div className="max-w-3xl space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#cdbda9]">
                Start with one win
              </p>
              <h2 className="section-title tracking-normal text-[#fff7ed]">
                You already did the work. Capture the proof before it gets diluted.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[#cdbda9]">
                Open BragBook, save one accomplishment that could matter in a
                review, promotion conversation, resume update, or interview loop.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/dashboard"
                className={marketingButtonStyles(
                  "primary",
                  "bg-[#fff7ed] text-[#15110e] hover:bg-white focus-visible:ring-white/30",
                )}
              >
                Open BragBook
              </Link>
              <Link
                href="/settings"
                className="block text-sm font-semibold text-[#cdbda9] underline-offset-4 transition hover:text-[#fff7ed] hover:underline"
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
