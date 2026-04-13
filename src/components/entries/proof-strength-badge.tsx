import { Badge } from "@/components/ui/badge";
import type { AccomplishmentEntry, ProofStrength } from "@/lib/schemas/entry";
import { proofStrengthLabels } from "@/lib/schemas/entry";
import { getProofStrength } from "@/lib/utils/proof";

const strengthVariant: Record<ProofStrength, "default" | "subtle" | "success" | "warning"> = {
  weak: "subtle",
  medium: "warning",
  strong: "success",
  strongest: "default",
};

export function ProofStrengthBadge({
  entry,
}: {
  entry: Pick<AccomplishmentEntry, "metric" | "proofItems">;
}) {
  const strength = getProofStrength(entry);

  return (
    <Badge variant={strengthVariant[strength]}>
      {proofStrengthLabels[strength]}
    </Badge>
  );
}
