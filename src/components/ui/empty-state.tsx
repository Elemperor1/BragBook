import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
}) {
  return (
    <Card className="rounded-[2rem] border-dashed border-border-strong/70 bg-white/55">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
