import type { AccomplishmentEntry } from "@/lib/schemas/entry";

function isoDaysAgo(daysAgo: number) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

export function createDemoEntries(): AccomplishmentEntry[] {
  return [
    {
      id: crypto.randomUUID(),
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
      metric:
        "Main-branch failure rate dropped from 18% to 3% within one sprint.",
      stakeholders: ["Platform team", "Release manager", "Frontend leads"],
      proofItems: [
        {
          id: crypto.randomUUID(),
          type: "metricSnapshot",
          title: "Weekly platform scorecard",
          summary: "Compared four weeks of CI stability before and after the cache and alerting fixes.",
          link: null,
          metric: "Failure rate fell from 18% to 3%.",
          localImage: null,
        },
        {
          id: crypto.randomUUID(),
          type: "artifactLink",
          title: "Build stability retro",
          summary: "Retro notes with the specific fixes, rollout timeline, and ownership follow-ups.",
          link: "https://example.com/build-retro",
          metric: null,
          localImage: null,
        },
      ],
      tags: ["reliability", "delivery", "platform"],
      seniorityTags: ["scope", "execution"],
      roleTags: ["staff", "tech lead"],
      createdAt: isoDaysAgo(82),
      updatedAt: isoDaysAgo(18),
    },
    {
      id: crypto.randomUUID(),
      title: "Shipped a migration workbook for service ownership",
      startDate: "2025-11-03",
      endDate: "2026-01-12",
      project: "Architecture Modernization",
      situation:
        "Teams were inheriting services without clear owners, which slowed incident response and created duplicate migration work.",
      action:
        "Built a workbook that joined service inventory, dependency maps, owner commitments, and review cadence in one planning artifact.",
      result:
        "The migration plan became actionable and managers could see exactly who owned the next cutover step.",
      metric:
        "Assigned durable ownership for 27 services across 5 teams.",
      stakeholders: ["Engineering managers", "SRE", "Migration council"],
      proofItems: [
        {
          id: crypto.randomUUID(),
          type: "artifactLink",
          title: "Ownership workbook",
          summary: "Working planning artifact used in weekly architecture review.",
          link: "https://example.com/service-workbook",
          metric: null,
          localImage: null,
        },
      ],
      tags: ["ownership", "cross-functional", "migration"],
      seniorityTags: ["influence", "systems thinking"],
      roleTags: ["senior", "architect"],
      createdAt: isoDaysAgo(121),
      updatedAt: isoDaysAgo(34),
    },
    {
      id: crypto.randomUUID(),
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
      metric:
        "Median time-to-triage fell from 2.4 days to 6 hours.",
      stakeholders: ["Support", "Product", "QA"],
      proofItems: [
        {
          id: crypto.randomUUID(),
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
      createdAt: isoDaysAgo(63),
      updatedAt: isoDaysAgo(7),
    },
    {
      id: crypto.randomUUID(),
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
      metric:
        "Cut rehearsal meeting time by 40% and eliminated checklist drift across teams.",
      stakeholders: ["Security", "Operations", "Support"],
      proofItems: [
        {
          id: crypto.randomUUID(),
          type: "releaseNote",
          title: "Launch brief",
          summary: "Release checklist and owner handoff notes used for rehearsals.",
          link: "https://example.com/launch-brief",
          metric: null,
          localImage: null,
        },
      ],
      tags: ["launches", "operational excellence", "security"],
      seniorityTags: ["leadership", "risk management"],
      roleTags: ["staff", "backend"],
      createdAt: isoDaysAgo(29),
      updatedAt: isoDaysAgo(2),
    },
    {
      id: crypto.randomUUID(),
      title: "Reduced pager fatigue from noisy cache alerts",
      startDate: "2026-03-01",
      endDate: "2026-03-28",
      project: "Reliability",
      situation:
        "The cache tier emitted alerts on transient spikes, which trained the team to ignore pages that later turned real.",
      action:
        "Changed thresholds, tuned aggregation windows, and documented the before/after failure modes for the on-call rotation.",
      result:
        "Pages felt more trustworthy and the on-call channel got quieter almost immediately.",
      metric: null,
      stakeholders: ["SRE", "Backend", "On-call rotation"],
      proofItems: [
        {
          id: crypto.randomUUID(),
          type: "beforeAfterSummary",
          title: "On-call handoff note",
          summary:
            "Before: engineers acknowledged bursts as false alarms. After: pages mostly represented actionable incidents and teams responded faster.",
          link: null,
          metric: null,
          localImage: null,
        },
      ],
      tags: ["alerts", "on-call", "reliability"],
      seniorityTags: ["execution"],
      roleTags: ["senior", "backend"],
      createdAt: isoDaysAgo(25),
      updatedAt: isoDaysAgo(6),
    },
    {
      id: crypto.randomUUID(),
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
      createdAt: isoDaysAgo(10),
      updatedAt: isoDaysAgo(1),
    },
  ];
}
