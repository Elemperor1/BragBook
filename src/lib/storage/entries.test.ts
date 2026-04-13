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
    proofType: "artifact",
    tags: ["launch"],
  };

  beforeEach(async () => {
    await clearAllData();
  });

  afterAll(async () => {
    await clearAllData();
    db.close();
  });

  it("creates and lists entries", async () => {
    await createEntry(baseEntry);
    const entries = await listEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.title).toBe("Captured rollout evidence");
  });

  it("updates entries in place", async () => {
    const created = await createEntry(baseEntry);
    await updateEntry(created.id, {
      ...baseEntry,
      title: "Updated entry title",
      proofType: "metric",
    });

    const updated = await getEntry(created.id);
    expect(updated?.title).toBe("Updated entry title");
    expect(updated?.proofType).toBe("metric");
  });

  it("deletes linked image assets with the entry", async () => {
    const imageFile = new File(["demo"], "proof.png", { type: "image/png" });
    const created = await createEntry(baseEntry, imageFile);

    expect(created.localImage?.id).toBeTruthy();
    expect(await getEntryAssetBlob(created.localImage!.id)).not.toBeNull();

    await deleteEntry(created.id);

    expect(await getEntry(created.id)).toBeUndefined();
    expect(await getEntryAssetBlob(created.localImage!.id)).toBeNull();
  });

  it("seeds demo data and returns dashboard stats", async () => {
    const seeded = await seedDemoData();
    const stats = await getDashboardStats();

    expect(seeded).toBe(true);
    expect(stats.totalEntries).toBeGreaterThan(0);
    expect(stats.recentlyUpdated.length).toBeGreaterThan(0);
  });
});
