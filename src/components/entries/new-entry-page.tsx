"use client";

import { useRouter } from "next/navigation";
import { EntryForm } from "@/components/entries/entry-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEntry, type ProofImageFileMap } from "@/lib/storage/entries";
import type { AccomplishmentEntryInput } from "@/lib/schemas/entry";

export function NewEntryPage() {
  const router = useRouter();

  async function handleSubmit(
    values: AccomplishmentEntryInput,
    imageFiles?: ProofImageFileMap,
  ) {
    const entry = await createEntry(values, imageFiles);
    router.push(`/entries/${entry.id}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="New Entry"
        description="Capture the win now, save the proof while it is easy to find, and leave the polishing for later."
        eyebrow="Capture workflow"
      />
      <Card variant="quiet" className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Capture the essentials first</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/60 bg-white/78 px-4 py-4 text-sm leading-7 text-foreground">
            Situation and action explain the scope of the work.
          </div>
          <div className="rounded-[1.5rem] border border-white/60 bg-white/78 px-4 py-4 text-sm leading-7 text-foreground">
            Results and metrics make the outcome reusable in reviews and resumes.
          </div>
          <div className="rounded-[1.5rem] border border-white/60 bg-white/78 px-4 py-4 text-sm leading-7 text-foreground">
            Saved proof makes the story easier to trust months later.
          </div>
        </CardContent>
      </Card>
      <EntryForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entries")}
      />
    </div>
  );
}
