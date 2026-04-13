import type { Metadata } from "next";
import { EntryDetailPage } from "@/components/entries/entry-detail-page";

export const metadata: Metadata = {
  title: "Entry Detail",
};

export default async function EntryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntryDetailPage entryId={id} />;
}
