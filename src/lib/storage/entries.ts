"use client";

import { db, type EntryAssetRecord } from "@/lib/db/dexie";
import {
  accomplishmentEntryInputSchema,
  accomplishmentEntrySchema,
  type AccomplishmentEntryInput,
  type LocalImage,
} from "@/lib/schemas/entry";
import { createDemoEntries } from "@/lib/storage/demo-data";
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

async function storeImageAsset(entryId: string, file: File): Promise<LocalImage> {
  const assetId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const dimensions = await getImageDimensions(file);

  const asset: EntryAssetRecord = {
    id: assetId,
    entryId,
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
  imageFile?: File | null,
) {
  const parsed = accomplishmentEntryInputSchema.parse(input);
  const timestamp = new Date().toISOString();
  const entryId = crypto.randomUUID();
  let localImage = parsed.localImage;

  if (imageFile) {
    localImage = await storeImageAsset(entryId, imageFile);
  }

  const entry = accomplishmentEntrySchema.parse({
    ...parsed,
    id: entryId,
    localImage,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await db.entries.put(entry);

  return entry;
}

export async function updateEntry(
  id: string,
  input: AccomplishmentEntryInput,
  imageFile?: File | null,
) {
  const existing = await getEntry(id);

  if (!existing) {
    throw new Error("Entry not found");
  }

  const parsed = accomplishmentEntryInputSchema.parse(input);
  let localImage = parsed.localImage;

  if (imageFile) {
    await deleteAsset(existing.localImage?.id);
    localImage = await storeImageAsset(id, imageFile);
  } else if (!parsed.localImage && existing.localImage) {
    await deleteAsset(existing.localImage.id);
    localImage = null;
  }

  const updated = accomplishmentEntrySchema.parse({
    ...existing,
    ...parsed,
    id,
    localImage,
    updatedAt: new Date().toISOString(),
  });

  await db.entries.put(updated);

  return updated;
}

export async function deleteEntry(id: string) {
  const entry = await getEntry(id);

  await db.transaction("rw", db.entries, db.entryAssets, async () => {
    await db.entries.delete(id);
    await deleteAsset(entry?.localImage?.id);
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
