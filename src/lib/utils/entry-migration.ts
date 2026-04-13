import type { AccomplishmentEntry, LocalImage, ProofItem } from "@/lib/schemas/entry";

type LegacyProofType = "artifact" | "praise" | "metric" | "image" | "doc" | "other";

export interface LegacyAccomplishmentEntryRecord {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  project: string | null;
  situation: string | null;
  action: string | null;
  result: string | null;
  metric: string | null;
  stakeholders: string[];
  proofType: LegacyProofType;
  proofNotes: string | null;
  pastedPraise: string | null;
  artifactLink: string | null;
  tags: string[];
  seniorityTags: string[];
  roleTags: string[];
  localImage: LocalImage | null;
  createdAt: string;
  updatedAt: string;
}

function createProofItemId(entryId: string, suffix: string) {
  return `${entryId}-${suffix}`;
}

function pushIfMissing(items: ProofItem[], candidate: ProofItem | null) {
  if (!candidate) {
    return;
  }

  const alreadyExists = items.some(
    (item) =>
      item.type === candidate.type &&
      item.summary === candidate.summary &&
      item.link === candidate.link &&
      item.metric === candidate.metric &&
      item.localImage?.id === candidate.localImage?.id,
  );

  if (!alreadyExists) {
    items.push(candidate);
  }
}

export function migrateLegacyEntryRecord(
  entry: LegacyAccomplishmentEntryRecord,
): AccomplishmentEntry {
  const proofItems: ProofItem[] = [];

  if (entry.localImage) {
    pushIfMissing(proofItems, {
      id: entry.localImage.id,
      type: "screenshot",
      title: "Migrated screenshot",
      summary: entry.proofType === "image" ? entry.proofNotes : null,
      link: null,
      metric: null,
      localImage: entry.localImage,
    });
  }

  if (entry.pastedPraise) {
    pushIfMissing(proofItems, {
      id: createProofItemId(entry.id, "praise"),
      type: "pastedPraise",
      title: null,
      summary: entry.pastedPraise,
      link: null,
      metric: null,
      localImage: null,
    });
  }

  if (entry.artifactLink) {
    pushIfMissing(proofItems, {
      id: createProofItemId(entry.id, "artifact"),
      type: entry.proofType === "doc" ? "releaseNote" : "artifactLink",
      title: null,
      summary:
        entry.proofType === "artifact" || entry.proofType === "doc"
          ? entry.proofNotes
          : null,
      link: entry.artifactLink,
      metric: null,
      localImage: null,
    });
  }

  if (entry.proofNotes) {
    const fallbackByType: Record<LegacyProofType, ProofItem> = {
      artifact: {
        id: createProofItemId(entry.id, "artifact-note"),
        type: "meetingNote",
        title: "Migrated proof note",
        summary: entry.proofNotes,
        link: null,
        metric: null,
        localImage: null,
      },
      praise: {
        id: createProofItemId(entry.id, "feedback"),
        type: "customerFeedback",
        title: "Migrated feedback note",
        summary: entry.proofNotes,
        link: null,
        metric: null,
        localImage: null,
      },
      metric: {
        id: createProofItemId(entry.id, "metric"),
        type: "metricSnapshot",
        title: "Migrated metric note",
        summary: entry.proofNotes,
        link: null,
        metric: entry.metric,
        localImage: null,
      },
      image: {
        id: createProofItemId(entry.id, "image-note"),
        type: "meetingNote",
        title: "Migrated screenshot note",
        summary: entry.proofNotes,
        link: null,
        metric: null,
        localImage: null,
      },
      doc: {
        id: createProofItemId(entry.id, "meeting-note"),
        type: "meetingNote",
        title: "Migrated document note",
        summary: entry.proofNotes,
        link: null,
        metric: null,
        localImage: null,
      },
      other: {
        id: createProofItemId(entry.id, "before-after"),
        type: "beforeAfterSummary",
        title: "Migrated summary",
        summary: entry.proofNotes,
        link: null,
        metric: null,
        localImage: null,
      },
    };

    pushIfMissing(
      proofItems,
      fallbackByType[entry.proofType],
    );
  }

  if (entry.proofType === "metric" && entry.metric) {
    pushIfMissing(proofItems, {
      id: createProofItemId(entry.id, "metric-only"),
      type: "metricSnapshot",
      title: "Migrated metric",
      summary: null,
      link: null,
      metric: entry.metric,
      localImage: null,
    });
  }

  return {
    id: entry.id,
    title: entry.title,
    startDate: entry.startDate,
    endDate: entry.endDate,
    project: entry.project,
    situation: entry.situation,
    action: entry.action,
    result: entry.result,
    metric: entry.metric,
    stakeholders: entry.stakeholders ?? [],
    proofItems,
    tags: entry.tags ?? [],
    seniorityTags: entry.seniorityTags ?? [],
    roleTags: entry.roleTags ?? [],
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}
