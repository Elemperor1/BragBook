import Dexie from "dexie";
import { db } from "@/lib/db/dexie";
import { emptyEntryInput, type AccomplishmentEntryInput } from "@/lib/schemas/entry";

vi.mock("@/lib/utils/file", () => ({
  getImageDimensions: vi.fn().mockResolvedValue({ width: 1440, height: 900 }),
}));

import {
  clearAllData,
  createEntry,
  deleteEntry,
  getDashboardStats,
  getEntry,
  getEntryAssetBlob,
  listEntries,
  seedDemoData,
  updateEntry,
} from "@/lib/storage/entries";

describe("entry storage", () => {
  const baseEntry: AccomplishmentEntryInput = {
    ...emptyEntryInput,
    title: "Captured rollout evidence",
    project: "Access Controls",
    tags: ["launch"],
    proofItems: [
      {
        id: "proof-1",
        type: "artifactLink",
        title: "Launch brief",
        summary: "Release notes and rollback plan.",
        link: "https://example.com/launch-brief",
        metric: null,
        localImage: null,
      },
    ],
  };

  beforeEach(async () => {
    await clearAllData();
  });

  afterAll(async () => {
    await clearAllData();
    db.close();
    await Dexie.delete("bragbook-db");
  });

  it("creates and lists entries", async () => {
    await createEntry(baseEntry);
    const entries = await listEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.title).toBe("Captured rollout evidence");
    expect(entries[0]?.proofItems).toHaveLength(1);
  });

  it("updates entries in place and supports proof changes", async () => {
    const created = await createEntry(baseEntry);
    await updateEntry(created.id, {
      ...baseEntry,
      title: "Updated entry title",
      proofItems: [
        ...baseEntry.proofItems,
        {
          id: "proof-2",
          type: "metricSnapshot",
          title: "Support dashboard",
          summary: null,
          link: null,
          metric: "Escalations dropped by 35%",
          localImage: null,
        },
      ],
    });

    const updated = await getEntry(created.id);
    expect(updated?.title).toBe("Updated entry title");
    expect(updated?.proofItems).toHaveLength(2);
  });

  it("deletes linked image assets with the entry", async () => {
    const imageFile = new File(["demo"], "proof.png", { type: "image/png" });
    const created = await createEntry(
      {
        ...baseEntry,
        proofItems: [
          {
            id: "proof-image",
            type: "screenshot",
            title: "Dashboard capture",
            summary: "After the rollout fix.",
            link: null,
            metric: null,
            localImage: {
              id: "proof-image",
              name: "proof.png",
              mimeType: "image/png",
              size: imageFile.size,
              createdAt: new Date().toISOString(),
            },
          },
        ],
      },
      { "proof-image": imageFile },
    );

    const proofImage = created.proofItems[0]?.localImage;

    expect(proofImage?.id).toBeTruthy();
    expect(await getEntryAssetBlob(proofImage!.id)).not.toBeNull();

    await deleteEntry(created.id);

    expect(await getEntry(created.id)).toBeUndefined();
    expect(await getEntryAssetBlob(proofImage!.id)).toBeNull();
  });

  it("seeds demo data and returns dashboard stats", async () => {
    const seeded = await seedDemoData();
    const stats = await getDashboardStats();

    expect(seeded).toBe(true);
    expect(stats.totalEntries).toBeGreaterThan(0);
    expect(stats.recentlyUpdated.length).toBeGreaterThan(0);
    expect(stats.strongestProofEntries.length).toBeGreaterThan(0);
  });

  it("migrates legacy entries and image assets", async () => {
    db.close();
    await Dexie.delete("bragbook-db");

    const legacyDb = new Dexie("bragbook-db");
    legacyDb.version(1).stores({
      entries: "id, updatedAt, createdAt, project, proofType",
      entryAssets: "id, entryId, createdAt",
    });

    await legacyDb.open();
    await legacyDb.table("entries").put({
      id: "legacy-1",
      title: "Legacy entry",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      project: "Platform",
      situation: "Legacy context",
      action: "Legacy action",
      result: "Legacy result",
      metric: "Build failures down 20%",
      stakeholders: ["Platform"],
      proofType: "image",
      proofNotes: "Screenshot from the build dashboard.",
      pastedPraise: null,
      artifactLink: null,
      tags: ["legacy"],
      seniorityTags: [],
      roleTags: [],
      localImage: {
        id: "asset-1",
        name: "legacy.png",
        mimeType: "image/png",
        size: 100,
        createdAt: "2026-02-01T00:00:00.000Z",
      },
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-02T00:00:00.000Z",
    });
    await legacyDb.table("entryAssets").put({
      id: "asset-1",
      entryId: "legacy-1",
      blob: new Blob(["legacy"], { type: "image/png" }),
      name: "legacy.png",
      mimeType: "image/png",
      size: 100,
      createdAt: "2026-02-01T00:00:00.000Z",
    });
    await legacyDb.close();

    await db.open();

    const migratedEntry = await getEntry("legacy-1");
    const migratedAsset = await db.entryAssets.get("asset-1");

    expect(migratedEntry?.proofItems[0]?.type).toBe("screenshot");
    expect(migratedEntry?.proofItems[0]?.localImage?.id).toBe("asset-1");
    expect(migratedAsset?.proofItemId).toBe("asset-1");
  });
});
