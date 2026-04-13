"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EntryForm } from "@/components/entries/entry-form";
import { EntryMetadataStrip } from "@/components/entries/entry-metadata-strip";
import { ProofImagePreview } from "@/components/entries/proof-image-preview";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useEntry } from "@/hooks/use-entry";
import type { AccomplishmentEntryInput } from "@/lib/schemas/entry";
import { deleteEntry, updateEntry } from "@/lib/storage/entries";

function DetailSection({
  title,
  body,
}: {
  title: string;
  body: string | null;
}) {
  return (
    <Card>
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
        />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Entry not found"
          description="The item you were looking for may have been deleted from this local vault."
        />
        <EmptyState
          title="No matching entry"
          description="Return to your vault and create or open another accomplishment entry."
          ctaHref="/entries"
          ctaLabel="Back to entries"
        />
      </div>
    );
  }

  async function handleUpdate(
    values: AccomplishmentEntryInput,
    imageFile?: File | null,
  ) {
    await updateEntry(entryId, values, imageFile);
    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteEntry(entryId);
    router.push("/entries");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={entry.title}
        description="Review the narrative and supporting proof, or switch into edit mode to tighten the record."
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
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Evidence summary</CardTitle>
              <CardDescription>
                A complete snapshot of the accomplishment, including proof and reusable review context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <EntryMetadataStrip entry={entry} />
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
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
            <Card>
              <CardHeader>
                <CardTitle>Supporting proof</CardTitle>
                <CardDescription>
                  Capture what would help a reviewer trust the impact quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Metric</p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {entry.metric ?? "No metric recorded yet."}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Proof notes</p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {entry.proofNotes ?? "No proof notes recorded yet."}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Pasted praise</p>
                  <blockquote className="rounded-[1.5rem] bg-muted/60 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    {entry.pastedPraise ?? "No direct praise saved yet."}
                  </blockquote>
                </div>
                {entry.artifactLink ? (
                  <Link
                    href={entry.artifactLink}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonStyles({ variant: "secondary" })}
                  >
                    Open artifact
                  </Link>
                ) : null}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
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
                    <p className="text-sm text-muted-foreground">No stakeholders captured.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Local image evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProofImagePreview image={entry.localImage} />
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete this entry?"
        description="This removes the accomplishment and any linked local image from this browser."
        confirmLabel="Delete entry"
        confirmVariant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
