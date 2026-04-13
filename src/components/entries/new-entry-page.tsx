"use client";

import { useRouter } from "next/navigation";
import { EntryForm } from "@/components/entries/entry-form";
import { PageHeader } from "@/components/layout/page-header";
import { createEntry } from "@/lib/storage/entries";
import type { AccomplishmentEntryInput } from "@/lib/schemas/entry";

export function NewEntryPage() {
  const router = useRouter();

  async function handleSubmit(
    values: AccomplishmentEntryInput,
    imageFile?: File | null,
  ) {
    const entry = await createEntry(values, imageFile);
    router.push(`/entries/${entry.id}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="New Entry"
        description="Capture the raw evidence now while the details are still sharp. You can polish the narrative later."
      />
      <EntryForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entries")}
      />
    </div>
  );
}
