import { Badge } from "@/components/ui/badge";
import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { proofStrengthMeta } from "@/lib/proof-strength";
import { getProofStrength } from "@/lib/utils/proof";

export function ProofStrengthBadge({
  entry,
}: {
  entry: Pick<AccomplishmentEntry, "metric" | "proofItems">;
}) {
  const strength = getProofStrength(entry);
  const meta = proofStrengthMeta[strength];

  return (
    <Badge variant={meta.variant} title={meta.description}>
      {meta.badgeLabel}
    </Badge>
  );
}
