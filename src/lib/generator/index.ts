import type { AccomplishmentEntry, ProofItem } from "@/lib/schemas/entry";
import { formatCompactDate, formatDateRange } from "@/lib/utils/date";
import {
  getProofStrength,
  getProofSummary,
  proofStrengthRank,
} from "@/lib/utils/proof";

export const generatorOutputTypes = [
  "selfReview",
  "promotionCase",
  "resumeBullets",
  "starStories",
] as const;

export const generatorTones = [
  "concise",
  "confident",
  "executive",
  "technical",
] as const;

export type GeneratorOutputType = (typeof generatorOutputTypes)[number];
export type GeneratorTone = (typeof generatorTones)[number];

export const generatorOutputTypeLabels: Record<GeneratorOutputType, string> = {
  selfReview: "Self-review",
  promotionCase: "Promotion case",
  resumeBullets: "Resume bullets",
  starStories: "STAR interview stories",
};

export const generatorToneLabels: Record<GeneratorTone, string> = {
  concise: "Concise",
  confident: "Confident",
  executive: "Executive",
  technical: "Technical",
};

export interface GenerateOutputRequest {
  entries: AccomplishmentEntry[];
  outputType: GeneratorOutputType;
  tone: GeneratorTone;
  targetLevel?: string | null;
  variantIndex?: number;
}

interface EntryFact {
  entry: AccomplishmentEntry;
  title: string;
  project: string | null;
  heading: string;
  timeline: string;
  situation: string | null;
  action: string | null;
  result: string | null;
  metric: string | null;
  stakeholders: string[];
  tags: string[];
  seniorityTags: string[];
  roleTags: string[];
  proofStrength: ReturnType<typeof getProofStrength>;
  proofSummary: string | null;
  proofHighlights: string[];
  referenceDate: string;
  isOpenEnded: boolean;
}

function rotateList<T>(items: T[], variantIndex: number) {
  if (items.length === 0) {
    return items;
  }

  const offset = ((variantIndex % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function uniqueStrings(items: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      items
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item)),
    ),
  );
}

function trimClause(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized
    .replace(/([.!?]+)(["'])$/, "$2")
    .replace(/[.!?]+$/, "");
}

function lowercaseFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function ensureSentence(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = trimClause(value);

  if (!normalized) {
    return null;
  }

  return `${normalized}.`;
}

function clauseToSentence(value: string | null | undefined) {
  return ensureSentence(value) ?? "";
}

function lowerClause(value: string | null | undefined) {
  const normalized = trimClause(value);
  return normalized ? lowercaseFirst(normalized) : null;
}

function joinWithCommas(items: Array<string | null | undefined>) {
  return uniqueStrings(items).join(", ");
}

function joinSentences(items: Array<string | null | undefined>) {
  return items
    .map((item) => ensureSentence(item))
    .filter((item): item is string => Boolean(item))
    .join(" ");
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatList(items: string[]) {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function describeProofItem(item: ProofItem) {
  if (item.metric) {
    return trimClause(item.metric);
  }

  if (item.summary) {
    return trimClause(item.summary);
  }

  if (item.title) {
    return trimClause(item.title);
  }

  if (item.link) {
    return trimClause(item.link);
  }

  if (item.localImage && item.type === "screenshot") {
    return "Screenshot evidence is attached";
  }

  return null;
}

function normalizeEntry(entry: AccomplishmentEntry): EntryFact {
  const proofSummary = getProofSummary(entry);
  const proofHighlights = uniqueStrings(
    entry.proofItems
      .map((item) => describeProofItem(item))
      .filter((item): item is string => Boolean(item)),
  );

  return {
    entry,
    title: entry.title,
    project: entry.project,
    heading: entry.project ? `${entry.title} (${entry.project})` : entry.title,
    timeline: formatDateRange(entry.startDate, entry.endDate),
    situation: trimClause(entry.situation),
    action: trimClause(entry.action),
    result: trimClause(entry.result),
    metric:
      trimClause(entry.metric) ??
      trimClause(entry.proofItems.find((item) => item.metric)?.metric),
    stakeholders: uniqueStrings(entry.stakeholders),
    tags: uniqueStrings(entry.tags),
    seniorityTags: uniqueStrings(entry.seniorityTags),
    roleTags: uniqueStrings(entry.roleTags),
    proofStrength: getProofStrength(entry),
    proofSummary:
      proofSummary === "No supporting proof saved yet."
        ? null
        : trimClause(proofSummary),
    proofHighlights,
    referenceDate: entry.endDate ?? entry.startDate ?? entry.updatedAt,
    isOpenEnded: !entry.endDate,
  };
}

function getPeriodRange(facts: EntryFact[]) {
  const starts = facts.map((fact) => fact.entry.startDate ?? fact.entry.createdAt);
  const earliest = starts.sort((left, right) => left.localeCompare(right))[0];
  const latestClosed = facts
    .map((fact) => fact.entry.endDate ?? fact.entry.startDate ?? fact.entry.updatedAt)
    .sort((left, right) => right.localeCompare(left))[0];

  if (!earliest) {
    return "recent work";
  }

  if (facts.some((fact) => fact.isOpenEnded)) {
    return `${formatCompactDate(earliest)} to Present`;
  }

  return `${formatCompactDate(earliest)} to ${formatCompactDate(latestClosed)}`;
}

function getTopThemes(facts: EntryFact[], limit = 3) {
  const counts = new Map<string, number>();

  for (const fact of facts) {
    for (const tag of fact.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) =>
      right[1] === left[1]
        ? left[0].localeCompare(right[0])
        : right[1] - left[1],
    )
    .slice(0, limit)
    .map(([tag]) => tag);
}

function getProjects(facts: EntryFact[]) {
  return uniqueStrings(facts.map((fact) => fact.project));
}

function buildOutcomeFragments(fact: EntryFact) {
  return uniqueStrings([fact.result, fact.metric, fact.proofSummary]);
}

function getPrimaryOutcome(fact: EntryFact) {
  return fact.metric ?? fact.result ?? fact.proofSummary ?? "Outcome still needs tighter evidence.";
}

function rankFacts(facts: EntryFact[]) {
  return [...facts].sort((left, right) => {
    const strengthDelta =
      proofStrengthRank[right.proofStrength] - proofStrengthRank[left.proofStrength];

    if (strengthDelta !== 0) {
      return strengthDelta;
    }

    return right.referenceDate.localeCompare(left.referenceDate);
  });
}

function buildSummaryParagraph(
  facts: EntryFact[],
  tone: GeneratorTone,
  variantIndex: number,
) {
  const periodRange = getPeriodRange(facts);
  const projects = getProjects(facts);
  const themes = getTopThemes(facts);
  const lead =
    variantIndex % 2 === 0
      ? {
          concise: `This period covered ${facts.length} selected accomplishments across ${projects.length || 1} project areas from ${periodRange}.`,
          confident: `This period shows repeated delivery across ${facts.length} accomplishments from ${periodRange}, spanning ${projects.length || 1} project areas.`,
          executive: `Across ${periodRange}, this body of work shows sustained delivery across ${projects.length || 1} project areas and ${facts.length} concrete accomplishments.`,
          technical: `Across ${periodRange}, the work concentrated on shipped engineering outcomes across ${projects.length || 1} project areas and ${facts.length} concrete accomplishments.`,
        }
      : {
          concise: `From ${periodRange}, the selected work captures ${facts.length} accomplishments across ${projects.length || 1} project areas.`,
          confident: `From ${periodRange}, the selected work shows a consistent pattern of execution across ${projects.length || 1} project areas and ${facts.length} accomplishments.`,
          executive: `From ${periodRange}, the selected work demonstrates repeatable impact across ${projects.length || 1} project areas and ${facts.length} accomplishments.`,
          technical: `From ${periodRange}, the selected work captures repeatable engineering impact across ${projects.length || 1} project areas and ${facts.length} accomplishments.`,
        };

  const themeLine =
    themes.length > 0
      ? {
          concise: `Recurring themes: ${formatList(themes)}.`,
          confident: `The strongest recurring themes were ${formatList(themes)}.`,
          executive: `The recurring impact areas were ${formatList(themes)}.`,
          technical: `The technical themes that surfaced repeatedly were ${formatList(themes)}.`,
        }
      : {
          concise: "",
          confident: "",
          executive: "",
          technical: "",
        };

  return [lead[tone], themeLine[tone]].filter(Boolean).join(" ");
}

function buildAccomplishmentLine(
  fact: EntryFact,
  tone: GeneratorTone,
  variantIndex: number,
) {
  const outcome = getPrimaryOutcome(fact);

  if (variantIndex % 2 === 0) {
    switch (tone) {
      case "concise":
        return `- ${fact.heading}: ${clauseToSentence(outcome)}`;
      case "confident":
        return `- ${fact.heading}: ${joinSentences([fact.action ?? fact.title, outcome])}`;
      case "executive":
        return `- ${fact.heading}: ${joinSentences([
          outcome,
          fact.stakeholders.length > 0 ? `This work aligned ${formatList(fact.stakeholders)}` : null,
        ])}`;
      case "technical":
        return `- ${fact.heading}: ${joinSentences([fact.action ?? fact.title, outcome])}`;
    }
  }

  switch (tone) {
    case "concise":
      return fact.action
        ? `- ${fact.heading}: ${trimClause(fact.action)}; ${lowerClause(outcome) ?? "outcome still needs tighter evidence"}.`
        : `- ${fact.heading}: ${clauseToSentence(outcome)}`;
    case "confident":
      return `- ${fact.heading}: ${joinSentences([
        outcome,
        fact.action,
      ])}`;
    case "executive":
      return `- ${fact.heading}: ${joinSentences([
        outcome,
        fact.project ? `Scope sat in ${fact.project}` : null,
      ])}`;
    case "technical":
      return `- ${fact.heading}: ${joinSentences([
        fact.action ?? fact.title,
        fact.metric ? `Measured result: ${fact.metric}` : fact.result,
      ])}`;
  }
}

function buildImpactLines(facts: EntryFact[], tone: GeneratorTone) {
  const impactFacts = facts.filter((fact) => fact.metric || fact.result);

  if (impactFacts.length === 0) {
    return [
      "- The selected entries still need clearer result or metric capture before this section is strong enough to use externally.",
    ];
  }

  return impactFacts.map((fact) => {
    const outcome = getPrimaryOutcome(fact);

    switch (tone) {
      case "concise":
        return `- ${fact.heading}: ${clauseToSentence(outcome)}`;
      case "confident":
        return `- ${fact.heading}: ${joinSentences([
          outcome,
          fact.proofSummary ? `Supporting proof: ${fact.proofSummary}` : null,
        ])}`;
      case "executive":
        return `- ${fact.heading}: ${joinSentences([
          outcome,
          fact.stakeholders.length > 0 ? `The work affected ${formatList(fact.stakeholders)}` : null,
        ])}`;
      case "technical":
        return `- ${fact.heading}: ${joinSentences([
          fact.result ?? fact.metric ?? outcome,
          fact.metric && fact.result ? `Measured by ${fact.metric}` : null,
        ])}`;
    }
  });
}

function buildLeadershipLines(facts: EntryFact[], tone: GeneratorTone) {
  const collaborationFacts = facts.filter(
    (fact) =>
      fact.stakeholders.length > 0 ||
      fact.seniorityTags.length > 0 ||
      fact.roleTags.length > 0,
  );

  if (collaborationFacts.length === 0) {
    return [
      "- The selected entries do not yet capture enough stakeholder or scope detail to make a strong collaboration section.",
    ];
  }

  return collaborationFacts.map((fact) => {
    const stakeholderText =
      fact.stakeholders.length > 0
        ? `Worked with ${formatList(fact.stakeholders)}`
        : "Scope details are captured in the seniority and role tags";
    const scopeSignals = uniqueStrings([...fact.seniorityTags, ...fact.roleTags]);
    const scopeLine =
      scopeSignals.length > 0
        ? `Signals included ${formatList(scopeSignals)}`
        : "";

    switch (tone) {
      case "concise":
        return `- ${fact.heading}: ${joinSentences([stakeholderText, scopeLine])}`;
      case "confident":
        return `- ${fact.heading}: ${joinSentences([stakeholderText, scopeLine])}`;
      case "executive":
        return `- ${fact.heading}: ${joinSentences([
          stakeholderText,
          scopeLine,
          fact.result ? `This translated into ${lowerClause(fact.result)}` : null,
        ])}`;
      case "technical":
        return `- ${fact.heading}: ${joinSentences([
          `${stakeholderText} while shipping ${lowerClause(fact.action ?? fact.title)}`,
          scopeLine,
        ])}`;
    }
  });
}

function buildGrowthLines(facts: EntryFact[]) {
  const lines: string[] = [];

  for (const fact of facts) {
    if (!fact.metric) {
      lines.push(
        `- ${fact.heading}: add a topline metric so the outcome is easier to defend in review and external documents.`,
      );
    }

    if (proofStrengthRank[fact.proofStrength] < proofStrengthRank.strong) {
      lines.push(
        `- ${fact.heading}: strengthen the evidence with a screenshot, artifact, quote, or metric snapshot before reusing it in promotion or interview material.`,
      );
    }

    if (fact.isOpenEnded || !fact.result) {
      lines.push(
        `- ${fact.heading}: close the loop by recording the shipped result or next milestone once the work lands.`,
      );
    }
  }

  const uniqueLines = uniqueStrings(lines).slice(0, 4);

  if (uniqueLines.length > 0) {
    return uniqueLines;
  }

  return [
    "- The current selection is already well backed up; keep maintaining the same metric and proof standard on future entries.",
  ];
}

function buildNextStepLines(facts: EntryFact[]) {
  const lines: string[] = [];

  for (const fact of facts.filter((item) => item.isOpenEnded)) {
    lines.push(
      `- ${fact.heading}: move the open work to a shipped milestone and capture the first measurable result.`,
    );
  }

  if (facts.some((fact) => !fact.metric)) {
    lines.push(
      "- Capture metrics earlier in the cycle so strong outcomes are easier to reuse in reviews, promotion packets, and resumes.",
    );
  }

  if (facts.some((fact) => proofStrengthRank[fact.proofStrength] < proofStrengthRank.strong)) {
    lines.push(
      "- Attach artifacts, quotes, or screenshots at the point of delivery so future drafts can lean on concrete proof instead of memory.",
    );
  }

  if (lines.length === 0) {
    lines.push(
      "- Keep the current proof standard intact by continuing to pair measurable outcomes with artifacts or stakeholder evidence.",
    );
  }

  return uniqueStrings(lines).slice(0, 4);
}

function createSection(title: string, lines: string[]) {
  return [title, ...lines].join("\n");
}

function generateSelfReview(
  facts: EntryFact[],
  tone: GeneratorTone,
  variantIndex: number,
) {
  const orderedFacts = rotateList(rankFacts(facts), variantIndex);

  return [
    "Self-review",
    "",
    createSection("Summary of the period", [buildSummaryParagraph(orderedFacts, tone, variantIndex)]),
    "",
    createSection(
      "Key accomplishments",
      orderedFacts.map((fact) => buildAccomplishmentLine(fact, tone, variantIndex)),
    ),
    "",
    createSection("Team or business impact", buildImpactLines(orderedFacts, tone)),
    "",
    createSection("Collaboration and leadership", buildLeadershipLines(orderedFacts, tone)),
    "",
    createSection("Growth areas", buildGrowthLines(orderedFacts)),
    "",
    createSection("Next steps", buildNextStepLines(orderedFacts)),
  ].join("\n");
}

function getImpactAreaSignals(fact: EntryFact) {
  return uniqueStrings([
    ...fact.seniorityTags,
    ...fact.tags,
    ...fact.roleTags,
    fact.project,
  ]);
}

function buildPromotionGroups(facts: EntryFact[], variantIndex: number) {
  const candidateCounts = new Map<string, number>();

  for (const fact of facts) {
    for (const signal of getImpactAreaSignals(fact)) {
      candidateCounts.set(signal, (candidateCounts.get(signal) ?? 0) + 1);
    }
  }

  const preferredSignals = [...candidateCounts.entries()]
    .sort((left, right) =>
      right[1] === left[1]
        ? left[0].localeCompare(right[0])
        : right[1] - left[1],
    )
    .map(([label]) => label);
  const preferredSignalRank = new Map(
    preferredSignals.map((signal, index) => [signal, index] as const),
  );

  const groups = new Map<string, EntryFact[]>();

  for (const fact of facts) {
    const rankedSignal = getImpactAreaSignals(fact).reduce<string | null>(
      (best, signal) => {
        if (best === null) {
          return signal;
        }

        const bestRank = preferredSignalRank.get(best) ?? Number.POSITIVE_INFINITY;
        const signalRank = preferredSignalRank.get(signal) ?? Number.POSITIVE_INFINITY;
        return signalRank < bestRank ? signal : best;
      },
      null,
    );
    const signal =
      rankedSignal ??
      fact.project ??
      fact.tags[0] ??
      fact.seniorityTags[0] ??
      fact.roleTags[0] ??
      "Additional impact";

    groups.set(signal, [...(groups.get(signal) ?? []), fact]);
  }

  return rotateList(
    [...groups.entries()].sort((left, right) =>
      right[1].length === left[1].length
        ? left[0].localeCompare(right[0])
        : right[1].length - left[1].length,
    ),
    variantIndex,
  );
}

function buildPromotionOpening(
  facts: EntryFact[],
  tone: GeneratorTone,
  targetLevel: string,
  variantIndex: number,
) {
  const themes = getTopThemes(facts);
  const base =
    variantIndex % 2 === 0
      ? {
          concise: `This evidence supports a case for ${targetLevel} based on ${facts.length} selected accomplishments from ${getPeriodRange(facts)}.`,
          confident: `This body of work supports a case for ${targetLevel} through ${facts.length} selected accomplishments from ${getPeriodRange(facts)}.`,
          executive: `This body of work supports a case for ${targetLevel} through sustained impact across ${facts.length} accomplishments from ${getPeriodRange(facts)}.`,
          technical: `This body of work supports a case for ${targetLevel} through shipped engineering outcomes across ${facts.length} accomplishments from ${getPeriodRange(facts)}.`,
        }
      : {
          concise: `For ${targetLevel}, the selected accomplishments show repeatable impact across ${facts.length} entries from ${getPeriodRange(facts)}.`,
          confident: `For ${targetLevel}, the selected accomplishments show repeatable impact and influence across ${facts.length} entries from ${getPeriodRange(facts)}.`,
          executive: `For ${targetLevel}, the selected accomplishments show repeatable business impact, leadership, and execution across ${facts.length} entries from ${getPeriodRange(facts)}.`,
          technical: `For ${targetLevel}, the selected accomplishments show repeatable technical execution, scope, and measurable outcomes across ${facts.length} entries from ${getPeriodRange(facts)}.`,
        };

  if (themes.length === 0) {
    return base[tone];
  }

  const themeLine =
    tone === "technical"
      ? `Recurring themes included ${formatList(themes)}.`
      : `Recurring impact areas included ${formatList(themes)}.`;

  return `${base[tone]} ${themeLine}`;
}

function buildPromotionEvidenceLine(
  fact: EntryFact,
  tone: GeneratorTone,
) {
  const evidence = fact.proofHighlights[0] ?? fact.proofSummary;
  const outcome = getPrimaryOutcome(fact);

  switch (tone) {
    case "concise":
      return `- ${fact.heading}: ${joinSentences([
        outcome,
        evidence ? `Proof: ${evidence}` : null,
      ])}`;
    case "confident":
      return `- ${fact.heading}: ${joinSentences([
        fact.action ?? fact.title,
        outcome,
        evidence ? `Proof: ${evidence}` : null,
      ])}`;
    case "executive":
      return `- ${fact.heading}: ${joinSentences([
        outcome,
        fact.stakeholders.length > 0 ? `Stakeholders: ${formatList(fact.stakeholders)}` : null,
        evidence ? `Proof: ${evidence}` : null,
      ])}`;
    case "technical":
      return `- ${fact.heading}: ${joinSentences([
        fact.action ?? fact.title,
        outcome,
        evidence ? `Evidence included ${lowerClause(evidence)}` : null,
      ])}`;
  }
}

function buildPromotionCase(
  facts: EntryFact[],
  tone: GeneratorTone,
  targetLevel: string,
  variantIndex: number,
) {
  const orderedFacts = rotateList(rankFacts(facts), variantIndex);
  const groups = buildPromotionGroups(orderedFacts, variantIndex);
  const groupSections = groups.map(([label, groupFacts]) =>
    createSection(
      toTitleCase(label),
      groupFacts.map((fact) => buildPromotionEvidenceLine(fact, tone)),
    ),
  );

  const businessImpact = orderedFacts
    .filter((fact) => fact.metric || fact.result)
    .map((fact) => `- ${fact.heading}: ${getPrimaryOutcome(fact)}`)
    .slice(0, 5);

  const leadership = orderedFacts
    .filter((fact) => fact.stakeholders.length > 0 || fact.seniorityTags.length > 0)
    .map(
      (fact) =>
        `- ${fact.heading}: ${fact.stakeholders.length > 0 ? `Worked with ${formatList(fact.stakeholders)}.` : ""} ${
          fact.seniorityTags.length > 0 ? `Signals included ${formatList(fact.seniorityTags)}.` : ""
        }`.trim(),
    )
    .slice(0, 5);

  const proofExamples = orderedFacts
    .filter((fact) => fact.proofHighlights.length > 0 || fact.proofSummary)
    .map(
      (fact) =>
        `- ${fact.heading}: ${fact.proofHighlights[0] ?? fact.proofSummary ?? "Proof is saved in the entry."}`,
    )
    .slice(0, 5);

  return [
    `Case for ${targetLevel}`,
    "",
    buildPromotionOpening(orderedFacts, tone, targetLevel, variantIndex),
    "",
    "Evidence grouped by competency or impact area",
    ...groupSections.flatMap((section) => ["", section]),
    "",
    createSection("Business impact", businessImpact),
    "",
    createSection(
      "Leadership and influence",
      leadership.length > 0
        ? leadership
        : ["- The selected entries need clearer stakeholder or scope detail to strengthen this section."],
    ),
    "",
    createSection(
      "Proof-backed examples",
      proofExamples.length > 0
        ? proofExamples
        : ["- The selected entries need stronger artifact or quote capture before this section is persuasive."],
    ),
  ].join("\n");
}

function buildResumeBullet(
  fact: EntryFact,
  tone: GeneratorTone,
  variantIndex: number,
) {
  const action = fact.action ?? fact.title;
  const scopedAction = fact.project ? `${action} for ${fact.project}` : action;
  const outcomeFragments = buildOutcomeFragments(fact);
  const primaryOutcome = outcomeFragments[0];
  const secondaryOutcome = outcomeFragments[1];

  if (variantIndex % 2 === 0) {
    switch (tone) {
      case "concise":
        return `- ${joinWithCommas([
          trimClause(scopedAction),
          lowerClause(primaryOutcome),
          lowerClause(secondaryOutcome),
        ])}.`;
      case "confident":
        return `- ${trimClause(scopedAction)}, resulting in ${lowerClause(primaryOutcome ?? "a documented outcome")}${secondaryOutcome ? ` and ${lowerClause(secondaryOutcome)}` : ""}.`;
      case "executive":
        return `- ${trimClause(scopedAction)}, creating ${lowerClause(primaryOutcome ?? "a documented outcome")}${secondaryOutcome ? ` and ${lowerClause(secondaryOutcome)}` : ""}.`;
      case "technical":
        return `- ${trimClause(scopedAction)}, improving ${lowerClause(primaryOutcome ?? "a documented outcome")}${secondaryOutcome ? ` and ${lowerClause(secondaryOutcome)}` : ""}.`;
    }
  }

  switch (tone) {
    case "concise":
      return `- ${fact.project ? `${fact.project}: ` : ""}${trimClause(action)}${primaryOutcome ? `; ${lowerClause(primaryOutcome)}` : ""}.`;
    case "confident":
      return `- Delivered ${lowerClause(action)}${fact.project ? ` for ${fact.project}` : ""}, with ${lowerClause(primaryOutcome ?? "a documented outcome")}${secondaryOutcome ? ` and ${lowerClause(secondaryOutcome)}` : ""}.`;
    case "executive":
      return `- Led ${lowerClause(action)}${fact.project ? ` for ${fact.project}` : ""}, driving ${lowerClause(primaryOutcome ?? "a documented outcome")}${secondaryOutcome ? ` and ${lowerClause(secondaryOutcome)}` : ""}.`;
    case "technical":
      return `- Shipped ${lowerClause(action)}${fact.project ? ` for ${fact.project}` : ""}, producing ${lowerClause(primaryOutcome ?? "a documented outcome")}${secondaryOutcome ? ` and ${lowerClause(secondaryOutcome)}` : ""}.`;
  }
}

function generateResumeBullets(
  facts: EntryFact[],
  tone: GeneratorTone,
  variantIndex: number,
) {
  const orderedFacts = rotateList(rankFacts(facts), variantIndex);

  return [
    "Resume bullets",
    "",
    ...orderedFacts.map((fact) => buildResumeBullet(fact, tone, variantIndex)),
  ].join("\n");
}

function buildTaskLine(fact: EntryFact, tone: GeneratorTone) {
  if (fact.project && fact.situation) {
    switch (tone) {
      case "concise":
        return `Task: Resolve the issue in ${fact.project} and deliver a concrete improvement.`;
      case "confident":
        return `Task: Turn the problem in ${fact.project} into a shipped improvement the team could trust.`;
      case "executive":
        return `Task: Convert the issue in ${fact.project} into an outcome the business and partner teams could rely on.`;
      case "technical":
        return `Task: Fix the engineering failure mode in ${fact.project} and land a durable implementation change.`;
    }
  }

  if (fact.project) {
    return `Task: Deliver a concrete outcome for ${fact.project}.`;
  }

  return "Task: Own the work end to end and turn it into a reusable result.";
}

function buildResultLine(fact: EntryFact, tone: GeneratorTone) {
  const pieces = uniqueStrings([fact.result, fact.metric, fact.proofHighlights[0]]);

  if (pieces.length === 0) {
    return "Result: The entry still needs a recorded outcome before it is strong enough for interviews.";
  }

  if (tone === "concise") {
    return `Result: ${joinSentences(pieces)}`;
  }

  return `Result: ${joinSentences(pieces)}`;
}

function generateStarStories(
  facts: EntryFact[],
  tone: GeneratorTone,
  variantIndex: number,
) {
  const storyFacts = rotateList(rankFacts(facts), variantIndex).slice(0, 3);

  return [
    "STAR interview stories",
    "",
    ...storyFacts.flatMap((fact, index) => [
      `Story ${index + 1}: ${fact.heading}`,
      `Situation: ${ensureSentence(fact.situation) ?? "The entry needs a tighter situation statement before using it in an interview."}`,
      buildTaskLine(fact, tone),
      `Action: ${ensureSentence(fact.action) ?? "The entry needs a clearer action statement before using it in an interview."}`,
      buildResultLine(fact, tone),
      "",
    ]),
  ]
    .join("\n")
    .trimEnd();
}

export function generateOutput(request: GenerateOutputRequest) {
  const variantIndex = Math.max(0, request.variantIndex ?? 0);
  const facts = request.entries.map(normalizeEntry);

  if (facts.length === 0) {
    return "";
  }

  switch (request.outputType) {
    case "selfReview":
      return generateSelfReview(facts, request.tone, variantIndex);
    case "promotionCase":
      return buildPromotionCase(
        facts,
        request.tone,
        request.targetLevel?.trim() || "the next level",
        variantIndex,
      );
    case "resumeBullets":
      return generateResumeBullets(facts, request.tone, variantIndex);
    case "starStories":
      return generateStarStories(facts, request.tone, variantIndex);
  }
}
