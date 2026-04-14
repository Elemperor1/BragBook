import type { ProofStrength } from "@/lib/schemas/entry";

export const proofStrengthMeta: Record<
  ProofStrength,
  {
    badgeLabel: string;
    filterLabel: string;
    description: string;
    rubric: string;
    variant: "default" | "subtle" | "accent" | "success" | "warning";
  }
> = {
  weak: {
    badgeLabel: "Weak proof",
    filterLabel: "Weak proof",
    description: "No metric and no saved proof yet.",
    rubric: "No metric and no saved proof.",
    variant: "subtle",
  },
  medium: {
    badgeLabel: "Medium proof",
    filterLabel: "Medium proof",
    description: "Narrative-only proof is saved, but no metric or concrete artifact yet.",
    rubric: "Narrative-only proof.",
    variant: "warning",
  },
  strong: {
    badgeLabel: "Strong proof",
    filterLabel: "Strong proof",
    description: "A metric or a concrete artifact, quote, or screenshot is saved.",
    rubric: "A metric or a concrete artifact, quote, or screenshot.",
    variant: "success",
  },
  strongest: {
    badgeLabel: "Strongest proof",
    filterLabel: "Strongest proof",
    description: "A metric is paired with a concrete artifact, quote, or screenshot.",
    rubric: "A metric plus a concrete artifact, quote, or screenshot.",
    variant: "accent",
  },
};

export const proofStrengthLabels: Record<ProofStrength, string> = {
  weak: proofStrengthMeta.weak.badgeLabel,
  medium: proofStrengthMeta.medium.badgeLabel,
  strong: proofStrengthMeta.strong.badgeLabel,
  strongest: proofStrengthMeta.strongest.badgeLabel,
};
