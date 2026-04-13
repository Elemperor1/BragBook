import type { AccomplishmentEntry } from "@/lib/schemas/entry";

export const sampleEntries: AccomplishmentEntry[] = [
  {
    id: "entry-ci",
    title: "Stabilized the CI lane for monorepo builds",
    startDate: "2026-01-08",
    endDate: "2026-02-20",
    project: "Developer Platform",
    situation:
      "Build failures were blocking releases several times a week and teams were batching risky changes into late deploy windows.",
    action:
      "Mapped flaky jobs, split cache keys by runtime, added lockfile drift alerts, and wrote a short recovery playbook for on-call engineers.",
    result:
      "Main-branch merges became predictable again and release managers stopped holding changes for manual babysitting.",
    metric: "Failure rate dropped from 18% to 3% within one sprint.",
    stakeholders: ["Platform team", "Release manager", "Frontend leads"],
    proofItems: [
      {
        id: "proof-ci-metric",
        type: "metricSnapshot",
        title: "Weekly platform scorecard",
        summary:
          "Compared four weeks of CI stability before and after the cache and alerting fixes.",
        link: null,
        metric: "Failure rate dropped from 18% to 3%.",
        localImage: null,
      },
      {
        id: "proof-ci-artifact",
        type: "artifactLink",
        title: "Build stability retro",
        summary:
          "Retro notes with the specific fixes, rollout timeline, and ownership follow-ups.",
        link: "https://example.com/build-retro",
        metric: null,
        localImage: null,
      },
    ],
    tags: ["reliability", "delivery", "platform"],
    seniorityTags: ["scope", "execution"],
    roleTags: ["staff", "tech lead"],
    createdAt: "2026-02-20T00:00:00.000Z",
    updatedAt: "2026-02-22T00:00:00.000Z",
  },
  {
    id: "entry-support",
    title: "Turned support escalations into product diagnostics",
    startDate: "2026-02-03",
    endDate: "2026-03-18",
    project: "Observability Upgrade",
    situation:
      "Customer-facing issues arrived without enough context, so product and engineering burned time reproducing already-known failure modes.",
    action:
      "Partnered with support on a new escalation template, added request IDs to the UI, and shipped a narrow diagnostics panel for internal triage.",
    result:
      "Escalations became much easier to route and product reviews started using the same evidence to prioritize fixes.",
    metric: "Median time-to-triage fell from 2.4 days to 6 hours.",
    stakeholders: ["Support", "Product", "QA"],
    proofItems: [
      {
        id: "proof-support-feedback",
        type: "customerFeedback",
        title: "Support lead Slack note",
        summary:
          "\"The new diagnostics flow saved us multiple back-and-forth rounds this week.\"",
        link: null,
        metric: null,
        localImage: null,
      },
    ],
    tags: ["customer empathy", "observability", "product partnership"],
    seniorityTags: ["communication", "impact"],
    roleTags: ["senior", "full-stack"],
    createdAt: "2026-03-18T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "entry-launch",
    title: "Documented the launch checklist for a sensitive rollout",
    startDate: "2026-03-10",
    endDate: null,
    project: "Access Controls",
    situation:
      "A high-visibility rollout had multiple manual gates and no shared checklist, which made each rehearsal fragile.",
    action:
      "Created a launch brief with owner handoffs, rollback points, and evidence prompts for engineering, support, and operations.",
    result:
      "Launch reviews became shorter and more confident because everyone used the same source of truth.",
    metric: "Cut rehearsal meeting time by 40% and eliminated checklist drift across teams.",
    stakeholders: ["Security", "Operations", "Support"],
    proofItems: [
      {
        id: "proof-launch-brief",
        type: "releaseNote",
        title: "Launch brief",
        summary:
          "Release checklist and owner handoff notes used for rehearsals.",
        link: "https://example.com/launch-brief",
        metric: null,
        localImage: null,
      },
    ],
    tags: ["launches", "operational excellence", "security"],
    seniorityTags: ["leadership", "risk management"],
    roleTags: ["staff", "backend"],
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "entry-payments",
    title: "Outlined a plan for decomposing the billing webhook worker",
    startDate: "2026-04-02",
    endDate: null,
    project: "Payments",
    situation:
      "The webhook worker had become a single fragile path but the team had not yet aligned on the first slice to extract.",
    action:
      "Captured the hotspots, proposed a phased decomposition plan, and aligned on which path to isolate first.",
    result:
      "The team now has a credible path forward, but the refactor has not started yet.",
    metric: null,
    stakeholders: ["Billing", "Platform", "Finance systems"],
    proofItems: [],
    tags: ["architecture", "payments"],
    seniorityTags: ["systems thinking"],
    roleTags: ["staff", "backend"],
    createdAt: "2026-04-02T00:00:00.000Z",
    updatedAt: "2026-04-03T00:00:00.000Z",
  },
];
