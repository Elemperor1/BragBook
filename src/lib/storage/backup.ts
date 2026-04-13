"use client";

import { z } from "zod";
import { db, type EntryAssetRecord } from "@/lib/db/dexie";
import { accomplishmentEntrySchema, localImageSchema } from "@/lib/schemas/entry";

const backupFormat = "bragbook-backup-v1" as const;
const backupSchemaVersion = 1 as const;

const backupImageAssetSchema = localImageSchema.extend({
  entryId: z.string().min(1),
  proofItemId: z.string().min(1),
  dataUrl: z.string().startsWith("data:"),
});

const backupSchema = z
  .object({
    format: z.literal(backupFormat),
    schemaVersion: z.literal(backupSchemaVersion),
    exportedAt: z.string().datetime(),
    entries: z.array(accomplishmentEntrySchema),
    imageAssets: z.array(backupImageAssetSchema),
  })
  .superRefine((backup, context) => {
    const assetIds = new Set(backup.imageAssets.map((asset) => asset.id));

    for (const entry of backup.entries) {
      for (const proofItem of entry.proofItems) {
        const localImageId = proofItem.localImage?.id;

        if (localImageId && !assetIds.has(localImageId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["imageAssets"],
            message: `Missing image asset for proof item ${proofItem.id}.`,
          });
        }
      }
    }
  });

export type BragBookBackupV1 = z.infer<typeof backupSchema>;

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function base64ToUint8Array(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function blobToDataUrl(blob: Blob, mimeTypeOverride?: string) {
  const base64 = arrayBufferToBase64(await new Response(blob).arrayBuffer());
  const mimeType = mimeTypeOverride || blob.type || "application/octet-stream";
  return `data:${mimeType};base64,${base64}`;
}

function dataUrlToBlob(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Backup image asset is not a valid base64 data URL.");
  }

  const [, mimeType, base64] = match;
  return new Blob([base64ToUint8Array(base64)], { type: mimeType });
}

function toEntryAssetRecord(
  imageAsset: BragBookBackupV1["imageAssets"][number],
): EntryAssetRecord {
  return {
    id: imageAsset.id,
    entryId: imageAsset.entryId,
    proofItemId: imageAsset.proofItemId,
    blob: dataUrlToBlob(imageAsset.dataUrl),
    name: imageAsset.name,
    mimeType: imageAsset.mimeType,
    size: imageAsset.size,
    width: imageAsset.width,
    height: imageAsset.height,
    createdAt: imageAsset.createdAt,
  };
}

export function getBackupFilename(exportedAt = new Date().toISOString()) {
  const compact = exportedAt.replace(/[:]/g, "-").replace(/\.\d{3}Z$/, "Z");
  return `bragbook-backup-${compact}.json`;
}

export function parseBackupJson(rawJson: string) {
  return backupSchema.parse(JSON.parse(rawJson)) satisfies BragBookBackupV1;
}

export async function createBackup(): Promise<BragBookBackupV1> {
  const [entries, imageAssets] = await Promise.all([
    db.entries.toArray(),
    db.entryAssets.toArray(),
  ]);

  return {
    format: backupFormat,
    schemaVersion: backupSchemaVersion,
    exportedAt: new Date().toISOString(),
    entries,
    imageAssets: await Promise.all(
      imageAssets.map(async (asset) => ({
        id: asset.id,
        entryId: asset.entryId,
        proofItemId: asset.proofItemId,
        name: asset.name,
        mimeType: asset.mimeType,
        size: asset.size,
        width: asset.width,
        height: asset.height,
        createdAt: asset.createdAt,
        dataUrl: await blobToDataUrl(asset.blob, asset.mimeType),
      })),
    ),
  };
}

export async function restoreBackup(backupInput: BragBookBackupV1) {
  const backup = backupSchema.parse(backupInput);
  const assetRecords = backup.imageAssets.map(toEntryAssetRecord);

  await db.transaction("rw", db.entries, db.entryAssets, async () => {
    await db.entries.clear();
    await db.entryAssets.clear();
    await db.entries.bulkPut(backup.entries);

    if (assetRecords.length > 0) {
      await db.entryAssets.bulkPut(assetRecords);
    }
  });

  return {
    entryCount: backup.entries.length,
    imageCount: backup.imageAssets.length,
  };
}
