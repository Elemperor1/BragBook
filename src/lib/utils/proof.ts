import type {
  AccomplishmentEntry,
  ProofItem,
  ProofStrength,
} from "@/lib/schemas/entry";
import {
  proofStrengthLabels,
  type ProofItemType,
} from "@/lib/schemas/entry";

const artifactProofTypes = new Set<ProofItemType>([
  "screenshot",
  "artifactLink",
  "pastedPraise",
  "customerFeedback",
]);

const narrativeProofTypes = new Set<ProofItemType>([
  "releaseNote",
  "meetingNote",
  "beforeAfterSummary",
  "metricSnapshot",
]);

export const proofStrengthRank: Record<ProofStrength, number> = {
  weak: 0,
  medium: 1,
  strong: 2,
  strongest: 3,
};

export function isProofItemPopulated(item: ProofItem) {
  return Boolean(item.summary || item.link || item.metric || item.localImage);
}

export function getProofStrength(entry: Pick<AccomplishmentEntry, "metric" | "proofItems">) {
  const populatedItems = entry.proofItems.filter(isProofItemPopulated);

  if (populatedItems.length === 0) {
    return "weak";
  }

  const hasArtifactProof = populatedItems.some((item) =>
    artifactProofTypes.has(item.type),
  );
  const hasNarrativeProof = populatedItems.some((item) =>
    narrativeProofTypes.has(item.type),
  );
  const hasMetricEvidence = Boolean(entry.metric) || populatedItems.some(
    (item) => item.type === "metricSnapshot" && Boolean(item.metric),
  );

  if (hasMetricEvidence && hasArtifactProof) {
    return "strongest";
  }

  if (hasArtifactProof) {
    return "strong";
  }

  if (hasNarrativeProof) {
    return "medium";
  }

  return "weak";
}

export function getProofStrengthLabel(entry: Pick<AccomplishmentEntry, "metric" | "proofItems">) {
  return proofStrengthLabels[getProofStrength(entry)];
}

export function getProofSummary(entry: Pick<AccomplishmentEntry, "proofItems">) {
  const firstUsefulProof = entry.proofItems.find(isProofItemPopulated);

  if (!firstUsefulProof) {
    return "No supporting proof saved yet.";
  }

  return (
    firstUsefulProof.metric ??
    firstUsefulProof.summary ??
    firstUsefulProof.link ??
    "Saved proof is attached."
  );
}
