import Dexie, { type Table } from "dexie";
import type { AccomplishmentEntry, LocalImage } from "@/lib/schemas/entry";

export interface EntryAssetRecord extends LocalImage {
  entryId: string;
  blob: Blob;
}

class BragBookDatabase extends Dexie {
  entries!: Table<AccomplishmentEntry, string>;
  entryAssets!: Table<EntryAssetRecord, string>;

  constructor() {
    super("bragbook-db");

    this.version(1).stores({
      entries: "id, updatedAt, createdAt, project, proofType",
      entryAssets: "id, entryId, createdAt",
    });
  }
}

export const db = new BragBookDatabase();
