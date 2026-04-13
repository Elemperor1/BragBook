"use client";

import { useRouter } from "next/navigation";
import { EntryForm } from "@/components/entries/entry-form";
import { PageHeader } from "@/components/layout/page-header";
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
      />
      <EntryForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entries")}
      />
    </div>
  );
}
