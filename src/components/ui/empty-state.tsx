import type { ReactNode } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  actions,
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
  actions?: ReactNode;
}) {
  return (
    <Card variant="quiet" className="rounded-[2rem] border-dashed border-border-strong/70">
      <CardHeader>
        {eyebrow ? <CardEyebrow>{eyebrow}</CardEyebrow> : null}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {supportingPoints && supportingPoints.length > 0 ? (
          <div className="grid gap-2 pt-2 sm:grid-cols-2">
            {supportingPoints.map((point) => (
              <div
                key={point}
                className="rounded-[1.25rem] border border-white/55 bg-white/78 px-4 py-4 text-sm leading-6 text-foreground"
              >
                {point}
              </div>
            ))}
          </div>
        ) : null}
        {note ? <p className="text-sm leading-6 text-muted-foreground">{note}</p> : null}
      </CardHeader>
      {actions ? (
        <CardContent>
          <div className="flex flex-wrap gap-3">{actions}</div>
        </CardContent>
      ) : (ctaHref && ctaLabel) || (secondaryCtaHref && secondaryCtaLabel) ? (
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
