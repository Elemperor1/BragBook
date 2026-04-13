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
        "Build failures were blocking releases three to five times each week and confidence in the main branch was dropping.",
      action:
        "Mapped flaky steps, split cache keys by runtime, added guardrail alerts for lockfile drift, and documented the recovery path for on-call engineers.",
      result:
        "Release engineers regained a predictable merge path and product teams stopped batching unrelated changes into risky deploy windows.",
      metric:
        "Main-branch failure rate dropped from 18% to 3% within one sprint.",
      stakeholders: ["Platform team", "Release manager", "Frontend leads"],
      proofType: "metric",
      proofNotes:
        "Can point to the release calendar and the weekly platform report for before/after stability numbers.",
      pastedPraise:
        "\"This is the first time in months the pipeline feels boring in the best possible way.\"",
      artifactLink: "https://example.com/build-retro",
      tags: ["reliability", "delivery", "platform"],
      seniorityTags: ["scope", "execution"],
      roleTags: ["staff", "tech lead"],
      localImage: null,
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
        "Teams were inheriting services without clear owners, leading to slow incident response and repeated duplicate work.",
      action:
        "Built a lightweight workbook that paired service inventory, dependency maps, and migration notes with a clear owner and review cadence.",
      result:
        "The migration plan became actionable instead of aspirational, and managers could track who was accountable for the next cutover step.",
      metric:
        "Assigned durable ownership for 27 services across 5 teams.",
      stakeholders: ["Engineering managers", "SRE", "Migration council"],
      proofType: "artifact",
      proofNotes:
        "The workbook and review notes demonstrate how the framework was used in cross-team planning.",
      pastedPraise: null,
      artifactLink: "https://example.com/service-workbook",
      tags: ["ownership", "cross-functional", "migration"],
      seniorityTags: ["influence", "systems thinking"],
      roleTags: ["senior", "architect"],
      localImage: null,
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
        "Customer-facing issues arrived without enough context, so product and engineering lost time reproducing already-known failure modes.",
      action:
        "Partnered with support to define escalation templates, added structured request IDs to the UI, and introduced a narrow diagnostics panel for internal triage.",
      result:
        "Escalations became much easier to route, and product reviews started using the same evidence to prioritize fixes.",
      metric:
        "Median time-to-triage fell from 2.4 days to 6 hours.",
      stakeholders: ["Support", "Product", "QA"],
      proofType: "praise",
      proofNotes:
        "Pair this with the rollout announcement and support lead feedback for a strong communication example.",
      pastedPraise:
        "\"The new diagnostics flow saved us multiple back-and-forth rounds this week.\"",
      artifactLink: null,
      tags: ["customer empathy", "observability", "product partnership"],
      seniorityTags: ["communication", "impact"],
      roleTags: ["senior", "full-stack"],
      localImage: null,
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
        "Created a single launch brief with owner handoffs, rollback points, and evidence capture prompts for engineering, support, and operations.",
      result:
        "Launch reviews became shorter and more confident because everyone was working from the same source of truth.",
      metric:
        "Cut rehearsal meeting time by 40% and eliminated checklist drift across teams.",
      stakeholders: ["Security", "Operations", "Support"],
      proofType: "doc",
      proofNotes:
        "Useful as a promotion example for operational rigor and cross-functional leadership.",
      pastedPraise: null,
      artifactLink: "https://example.com/launch-brief",
      tags: ["launches", "operational excellence", "security"],
      seniorityTags: ["leadership", "risk management"],
      roleTags: ["staff", "backend"],
      localImage: null,
      createdAt: isoDaysAgo(29),
      updatedAt: isoDaysAgo(2),
    },
  ];
}
