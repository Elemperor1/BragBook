"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EntryForm } from "@/components/entries/entry-form";
import { EntryMetadataStrip } from "@/components/entries/entry-metadata-strip";
import { ProofImagePreview } from "@/components/entries/proof-image-preview";
import { ProofStrengthBadge } from "@/components/entries/proof-strength-badge";
import { ProofStrengthExplainer } from "@/components/entries/proof-strength-explainer";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntry } from "@/hooks/use-entry";
import { proofStrengthMeta } from "@/lib/proof-strength";
import {
  proofItemTypeLabels,
  type AccomplishmentEntry,
  type AccomplishmentEntryInput,
} from "@/lib/schemas/entry";
import {
  deleteEntry,
  updateEntry,
  type ProofImageFileMap,
} from "@/lib/storage/entries";
import { getProofStrength } from "@/lib/utils/proof";

function DetailSection({
  title,
  body,
}: {
  title: string;
  body: string | null;
}) {
  return (
    <Card variant="quiet">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">
          {body ?? "No details captured yet."}
        </p>
      </CardContent>
    </Card>
  );
}

function ProofItemCard({ entry }: { entry: AccomplishmentEntry }) {
  if (entry.proofItems.length === 0) {
    return (
      <EmptyState
        title="No proof saved yet"
        description="The narrative is here, but it still needs concrete evidence like a metric snapshot, quote, screenshot, or artifact link."
      />
    );
  }

  return (
    <div className="space-y-4">
      {entry.proofItems.map((proofItem) => (
        <Card key={proofItem.id} variant="document" className="rounded-[1.75rem]">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="selected">{proofItemTypeLabels[proofItem.type]}</Badge>
              {proofItem.title ? (
                <p className="text-sm font-medium text-foreground">{proofItem.title}</p>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {proofItem.metric ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Metric</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {proofItem.metric}
                </p>
              </div>
            ) : null}

            {proofItem.summary ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Summary</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {proofItem.summary}
                </p>
              </div>
            ) : null}

            {proofItem.link ? (
              <Link
                href={proofItem.link}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Open linked proof
              </Link>
            ) : null}

            {proofItem.localImage ? (
              <ProofImagePreview
                image={proofItem.localImage}
                title={proofItem.title ?? "Attached screenshot proof"}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EntryDetailPage({ entryId }: { entryId: string }) {
  const router = useRouter();
  const entry = useEntry(entryId);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (entry === null) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Entry"
          description="Loading the selected accomplishment."
          eyebrow="Evidence detail"
        />
        <Card variant="elevated" className="rounded-[2rem]">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-2xl" />
            <div className="grid gap-4 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[1.75rem] border border-border p-5">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Entry not found"
          description="The item you were looking for may have been deleted from this browser."
          eyebrow="Evidence detail"
        />
        <EmptyState
          title="No matching entry"
          description="Return to your entries and create or open another accomplishment."
          ctaHref="/entries"
          ctaLabel="Back to entries"
        />
      </div>
    );
  }

  async function handleUpdate(
    values: AccomplishmentEntryInput,
    imageFiles?: ProofImageFileMap,
  ) {
    await updateEntry(entryId, values, imageFiles);
    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteEntry(entryId);
    router.push("/entries");
  }

  const proofStrength = getProofStrength(entry);
  const proofMeta = proofStrengthMeta[proofStrength];

  return (
    <div className="space-y-8">
      <PageHeader
        title={entry.title}
        description="Review the narrative and supporting proof, or switch into edit mode to tighten the record."
        eyebrow="Evidence detail"
        action={
          <div className="flex flex-wrap gap-3">
            {isEditing ? null : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit entry
              </Button>
            )}
            <Button variant="ghost" onClick={() => setConfirmDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        }
      />

      {isEditing ? (
        <EntryForm
          mode="edit"
          initialValue={entry}
          submitLabel="Save entry"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <Card variant="elevated" className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Evidence summary</CardTitle>
              <CardDescription>
                A reusable snapshot of the accomplishment, the outcome, and how well the proof holds up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <EntryMetadataStrip entry={entry} />
              <div className="flex flex-wrap items-center gap-3">
                <ProofStrengthBadge entry={entry} />
                <Badge variant="selected">{proofMeta.description}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="selected">
                    {tag}
                  </Badge>
                ))}
                {entry.seniorityTags.map((tag) => (
                  <Badge key={tag} variant="subtle">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                <DetailSection title="Situation" body={entry.situation} />
                <DetailSection title="Action" body={entry.action} />
                <DetailSection title="Result" body={entry.result} />
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Supporting proof</CardTitle>
                <CardDescription>
                  Concrete signals that help a reviewer trust the outcome quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Top-line metric</p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {entry.metric ?? "No top-line metric recorded yet."}
                  </p>
                </div>
                <ProofItemCard entry={entry} />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card variant="quiet">
                <CardHeader>
                  <CardTitle>Stakeholders</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {entry.stakeholders.length > 0 ? (
                    entry.stakeholders.map((stakeholder) => (
                      <Badge key={stakeholder} variant="subtle">
                        {stakeholder}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No stakeholders captured.
                    </p>
                  )}
                </CardContent>
              </Card>

              <ProofStrengthExplainer title="Proof strength rubric" />
            </div>
          </section>
        </>
      )}

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete this entry?"
        description="This removes the accomplishment and any linked local screenshots from this browser."
        confirmLabel="Delete entry"
        confirmVariant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
