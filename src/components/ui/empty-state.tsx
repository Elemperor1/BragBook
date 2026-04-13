import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  eyebrow,
  title,
  description,
  supportingPoints,
  note,
  ctaHref,
  ctaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  supportingPoints?: string[];
  note?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
}) {
  return (
    <Card className="rounded-[2rem] border-dashed border-border-strong/70 bg-white/55">
      <CardHeader>
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {supportingPoints && supportingPoints.length > 0 ? (
          <div className="grid gap-2 pt-2 sm:grid-cols-2">
            {supportingPoints.map((point) => (
              <div
                key={point}
                className="rounded-[1.25rem] bg-muted/55 px-3 py-3 text-sm leading-6 text-foreground"
              >
                {point}
              </div>
            ))}
          </div>
        ) : null}
        {note ? <p className="text-sm leading-6 text-muted-foreground">{note}</p> : null}
      </CardHeader>
      {((ctaHref && ctaLabel) || (secondaryCtaHref && secondaryCtaLabel)) ? (
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {ctaHref && ctaLabel ? (
              <Link href={ctaHref} className={buttonStyles()}>
                {ctaLabel}
              </Link>
            ) : null}
            {secondaryCtaHref && secondaryCtaLabel ? (
              <Link
                href={secondaryCtaHref}
                className={buttonStyles({ variant: "secondary" })}
              >
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
