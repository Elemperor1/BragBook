import type { Metadata } from "next";
import { NewEntryPage } from "@/components/entries/new-entry-page";

export const metadata: Metadata = {
  title: "New Entry",
};

export default function NewEntryRoute() {
  return <NewEntryPage />;
}
