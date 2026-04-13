import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Card className="rounded-[2rem] border-dashed border-border-strong/70 bg-white/55">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {ctaHref && ctaLabel ? (
        <CardContent>
          <Link href={ctaHref} className={buttonStyles()}>
            {ctaLabel}
          </Link>
        </CardContent>
      ) : null}
    </Card>
  );
}
