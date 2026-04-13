"use client";

import { db, type EntryAssetRecord } from "@/lib/db/dexie";
import {
  accomplishmentEntryInputSchema,
  accomplishmentEntrySchema,
  type AccomplishmentEntry,
  type AccomplishmentEntryInput,
  type LocalImage,
  type ProofItem,
} from "@/lib/schemas/entry";
import { createDemoEntries } from "@/lib/demo-entries";
import {
  buildDashboardStats,
  type DashboardStats,
} from "@/lib/utils/entry-stats";
import { getImageDimensions } from "@/lib/utils/file";

export interface StorageSummary {
  entryCount: number;
  imageCount: number;
  lastUpdatedAt: string | null;
}

export type ProofImageFileMap = Record<string, File | null | undefined>;

async function storeImageAsset(
  entryId: string,
  proofItemId: string,
  file: File,
): Promise<LocalImage> {
  const assetId = proofItemId;
  const createdAt = new Date().toISOString();
  const dimensions = await getImageDimensions(file);

  const asset: EntryAssetRecord = {
    id: assetId,
    entryId,
    proofItemId,
    blob: file,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    createdAt,
    ...dimensions,
  };

  await db.entryAssets.put(asset);

  return {
    id: asset.id,
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
    width: asset.width,
    height: asset.height,
    createdAt: asset.createdAt,
  };
}

async function deleteAsset(assetId: string | null | undefined) {
  if (!assetId) {
    return;
  }

  await db.entryAssets.delete(assetId);
}

async function deleteAssetsForEntry(entryId: string) {
  const assetIds = await db.entryAssets.where("entryId").equals(entryId).primaryKeys();
  await db.entryAssets.bulkDelete(assetIds);
}

async function hydrateProofItemsForCreate(
  entryId: string,
  proofItems: ProofItem[],
  imageFiles: ProofImageFileMap,
) {
  const hydratedItems: ProofItem[] = [];

  for (const proofItem of proofItems) {
    const imageFile = imageFiles[proofItem.id] ?? null;
    const localImage = imageFile
      ? await storeImageAsset(entryId, proofItem.id, imageFile)
      : proofItem.localImage;

    hydratedItems.push({
      ...proofItem,
      localImage,
    });
  }

  return hydratedItems;
}

async function hydrateProofItemsForUpdate(
  entry: AccomplishmentEntry,
  proofItems: ProofItem[],
  imageFiles: ProofImageFileMap,
) {
  const existingProofMap = new Map(entry.proofItems.map((item) => [item.id, item]));
  const nextProofIds = new Set(proofItems.map((item) => item.id));
  const hydratedItems: ProofItem[] = [];

  for (const proofItem of proofItems) {
    const existingProofItem = existingProofMap.get(proofItem.id);
    const imageFile = imageFiles[proofItem.id] ?? null;
    let localImage = proofItem.localImage;

    if (imageFile) {
      await deleteAsset(existingProofItem?.localImage?.id);
      localImage = await storeImageAsset(entry.id, proofItem.id, imageFile);
    } else if (!proofItem.localImage && existingProofItem?.localImage) {
      await deleteAsset(existingProofItem.localImage.id);
      localImage = null;
    }

    hydratedItems.push({
      ...proofItem,
      localImage,
    });
  }

  for (const existingProofItem of entry.proofItems) {
    if (!nextProofIds.has(existingProofItem.id)) {
      await deleteAsset(existingProofItem.localImage?.id);
    }
  }

  return hydratedItems;
}

export async function listEntries() {
  return db.entries.orderBy("updatedAt").reverse().toArray();
}

export async function getEntry(id: string) {
  return db.entries.get(id);
}

export async function getEntryAssetBlob(assetId: string) {
  const asset = await db.entryAssets.get(assetId);
  return asset?.blob ?? null;
}

export async function createEntry(
  input: AccomplishmentEntryInput,
  imageFiles: ProofImageFileMap = {},
) {
  const parsed = accomplishmentEntryInputSchema.parse(input);
  const timestamp = new Date().toISOString();
  const entryId = crypto.randomUUID();
  const proofItems = await hydrateProofItemsForCreate(
    entryId,
    parsed.proofItems,
    imageFiles,
  );

  const entry = accomplishmentEntrySchema.parse({
    ...parsed,
    id: entryId,
    proofItems,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await db.entries.put(entry);

  return entry;
}

export async function updateEntry(
  id: string,
  input: AccomplishmentEntryInput,
  imageFiles: ProofImageFileMap = {},
) {
  const existing = await getEntry(id);

  if (!existing) {
    throw new Error("Entry not found");
  }

  const parsed = accomplishmentEntryInputSchema.parse(input);
  const proofItems = await hydrateProofItemsForUpdate(
    existing,
    parsed.proofItems,
    imageFiles,
  );

  const updated = accomplishmentEntrySchema.parse({
    ...existing,
    ...parsed,
    id,
    proofItems,
    updatedAt: new Date().toISOString(),
  });

  await db.entries.put(updated);

  return updated;
}

export async function deleteEntry(id: string) {
  await db.transaction("rw", db.entries, db.entryAssets, async () => {
    await db.entries.delete(id);
    await deleteAssetsForEntry(id);
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const entries = await listEntries();
  return buildDashboardStats(entries);
}

export async function getStorageSummary(): Promise<StorageSummary> {
  const [entryCount, imageCount, latest] = await Promise.all([
    db.entries.count(),
    db.entryAssets.count(),
    db.entries.orderBy("updatedAt").last(),
  ]);

  return {
    entryCount,
    imageCount,
    lastUpdatedAt: latest?.updatedAt ?? null,
  };
}

export async function seedDemoData(force = false) {
  const existingCount = await db.entries.count();

  if (existingCount > 0 && !force) {
    return false;
  }

  const demoEntries = createDemoEntries();

  await db.transaction("rw", db.entries, db.entryAssets, async () => {
    if (force) {
      await db.entries.clear();
      await db.entryAssets.clear();
    }

    await db.entries.bulkPut(demoEntries);
  });

  return true;
}

export async function clearAllData() {
  await db.transaction("rw", db.entries, db.entryAssets, async () => {
    await db.entries.clear();
    await db.entryAssets.clear();
  });
}
