import Dexie, { type Table } from "dexie";
import type { AccomplishmentEntry, LocalImage } from "@/lib/schemas/entry";
import {
  migrateLegacyEntryRecord,
  type LegacyAccomplishmentEntryRecord,
} from "@/lib/utils/entry-migration";

export interface EntryAssetRecord extends LocalImage {
  entryId: string;
  proofItemId: string;
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

    this.version(2)
      .stores({
        entries: "id, updatedAt, createdAt, project",
        entryAssets: "id, entryId, proofItemId, createdAt",
      })
      .upgrade(async (transaction) => {
        const legacyEntriesTable = transaction.table("entries");
        const legacyAssetsTable = transaction.table("entryAssets");

        const legacyEntries = (await legacyEntriesTable.toArray()) as LegacyAccomplishmentEntryRecord[];
        const migratedEntries = legacyEntries.map((entry) =>
          migrateLegacyEntryRecord(entry),
        );

        await legacyEntriesTable.clear();
        await legacyEntriesTable.bulkPut(migratedEntries);

        const legacyAssets = (await legacyAssetsTable.toArray()) as Array<
          Omit<EntryAssetRecord, "proofItemId">
        >;

        if (legacyAssets.length > 0) {
          await legacyAssetsTable.clear();
          await legacyAssetsTable.bulkPut(
            legacyAssets.map((asset) => ({
              ...asset,
              proofItemId: asset.id,
            })),
          );
        }
      });
  }
}

export const db = new BragBookDatabase();
