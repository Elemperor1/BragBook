"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";
import { ProofImagePreview } from "@/components/entries/proof-image-preview";
import { ProofStrengthBadge } from "@/components/entries/proof-strength-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PillInput } from "@/components/ui/pill-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  accomplishmentEntryInputSchema,
  createEmptyProofItem,
  emptyEntryInput,
  proofItemTypeLabels,
  proofItemTypeOptions,
  type AccomplishmentEntryInput,
  type LocalImage,
  type ProofItem,
  type ProofItemType,
} from "@/lib/schemas/entry";
import { getProofStrength } from "@/lib/utils/proof";

type SectionId = "basic" | "situation" | "action" | "result" | "proof" | "tags";
type FieldErrors = Partial<Record<string, string>>;
type ProofImageFileMap = Record<string, File | null>;

interface EntryFormProps {
  mode: "create" | "edit";
  initialValue?: AccomplishmentEntryInput;
  submitLabel?: string;
  onSubmit: (
    values: AccomplishmentEntryInput,
    imageFiles?: ProofImageFileMap,
  ) => Promise<void>;
  onCancel?: () => void;
}

function optionalValue(value: string) {
  return value.trim().length > 0 ? value : null;
}

function fieldKey(path: ReadonlyArray<PropertyKey>) {
  return path.map(String).join(".");
}

function createPendingLocalImage(proofItemId: string, file: File): LocalImage {
  return {
    id: proofItemId,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    createdAt: new Date().toISOString(),
  };
}

function buildValidationPayload(
  values: AccomplishmentEntryInput,
  imageFiles: ProofImageFileMap,
): AccomplishmentEntryInput {
  return {
    ...values,
    proofItems: values.proofItems.map((proofItem) => {
      const pendingFile = imageFiles[proofItem.id];

      if (proofItem.type === "screenshot" && pendingFile && !proofItem.localImage) {
        return {
          ...proofItem,
          localImage: createPendingLocalImage(proofItem.id, pendingFile),
        };
      }

      return proofItem;
    }),
  };
}

function proofGuidance(strength: ReturnType<typeof getProofStrength>) {
  switch (strength) {
    case "weak":
      return "Add one proof item so this entry is more than memory.";
    case "medium":
      return "A link, screenshot, or quote would make this much easier to trust later.";
    case "strong":
      return "You have concrete proof. Add a metric if you want this to become strongest.";
    case "strongest":
      return "This has both measurable impact and concrete evidence.";
  }
}

function SectionCard({
  id,
  title,
  description,
  isOpen,
  onToggle,
  children,
}: {
  id: SectionId;
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: (sectionId: SectionId) => void;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-[2rem]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggle(id)}>
          {isOpen ? "Collapse" : "Expand"}
        </Button>
      </CardHeader>
      {isOpen ? <CardContent className="space-y-5">{children}</CardContent> : null}
    </Card>
  );
}

function ProofItemEditor({
  item,
  index,
  previewUrl,
  errorFor,
  onTypeChange,
  onFieldChange,
  onSelectImage,
  onClearImage,
  onRemove,
}: {
  item: ProofItem;
  index: number;
  previewUrl: string | null;
  errorFor: (path: string) => string | undefined;
  onTypeChange: (proofItemId: string, nextType: ProofItemType) => void;
  onFieldChange: <K extends keyof ProofItem>(
    proofItemId: string,
    key: K,
    value: ProofItem[K],
  ) => void;
  onSelectImage: (proofItemId: string, file: File | null) => void;
  onClearImage: (proofItemId: string) => void;
  onRemove: (proofItemId: string) => void;
}) {
  const titleError = errorFor(`proofItems.${index}.title`);
  const summaryError = errorFor(`proofItems.${index}.summary`);
  const linkError = errorFor(`proofItems.${index}.link`);
  const metricError = errorFor(`proofItems.${index}.metric`);
  const imageError = errorFor(`proofItems.${index}.localImage`);

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-border bg-white/70 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Proof item</p>
          <p className="text-xs leading-5 text-muted-foreground">
            Capture one concrete signal. Add more only when they add new evidence.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            value={item.type}
            className="min-w-52"
            onChange={(event) =>
              onTypeChange(item.id, event.target.value as ProofItemType)
            }
          >
            {proofItemTypeOptions.map((proofType) => (
              <option key={proofType} value={proofType}>
                {proofItemTypeLabels[proofType]}
              </option>
            ))}
          </Select>
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Source or label</label>
        <Input
          value={item.title ?? ""}
          placeholder="PR retrospective, customer email, launch brief"
          onChange={(event) => onFieldChange(item.id, "title", optionalValue(event.target.value))}
        />
        {titleError ? <p className="text-sm text-danger">{titleError}</p> : null}
      </div>

      {item.type === "artifactLink" || item.type === "releaseNote" ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Link</label>
            <Input
              value={item.link ?? ""}
              placeholder="https://example.com/release-notes"
              onChange={(event) =>
                onFieldChange(item.id, "link", optionalValue(event.target.value))
              }
            />
            {linkError ? <p className="text-sm text-danger">{linkError}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Why it matters</label>
            <Textarea
              value={item.summary ?? ""}
              placeholder="What does this artifact prove?"
              onChange={(event) =>
                onFieldChange(item.id, "summary", optionalValue(event.target.value))
              }
            />
            {summaryError ? <p className="text-sm text-danger">{summaryError}</p> : null}
          </div>
        </>
      ) : null}

      {item.type === "metricSnapshot" ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Metric</label>
            <Input
              value={item.metric ?? ""}
              placeholder="Median time-to-triage fell from 2.4 days to 6 hours"
              onChange={(event) =>
                onFieldChange(item.id, "metric", optionalValue(event.target.value))
              }
            />
            {metricError ? <p className="text-sm text-danger">{metricError}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Context</label>
            <Textarea
              value={item.summary ?? ""}
              placeholder="Where did the metric come from and what changed?"
              onChange={(event) =>
                onFieldChange(item.id, "summary", optionalValue(event.target.value))
              }
            />
            {summaryError ? <p className="text-sm text-danger">{summaryError}</p> : null}
          </div>
        </>
      ) : null}

      {item.type === "screenshot" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">What does the screenshot show?</label>
            <Textarea
              value={item.summary ?? ""}
              placeholder="Dashboard after the fix, rollout graph, user-facing before/after"
              onChange={(event) =>
                onFieldChange(item.id, "summary", optionalValue(event.target.value))
              }
            />
            {summaryError ? <p className="text-sm text-danger">{summaryError}</p> : null}
          </div>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2.5 file:font-medium file:text-accent-foreground"
              onChange={(event) => onSelectImage(item.id, event.target.files?.[0] ?? null)}
            />
            <ProofImagePreview
              image={item.localImage}
              previewUrl={previewUrl}
              title={item.title ?? "Attached screenshot"}
            />
            <div className="flex flex-wrap gap-3">
              {(item.localImage || previewUrl) ? (
                <Button variant="ghost" size="sm" onClick={() => onClearImage(item.id)}>
                  Remove image
                </Button>
              ) : null}
            </div>
            {imageError ? <p className="text-sm text-danger">{imageError}</p> : null}
          </div>
        </div>
      ) : null}

      {item.type === "pastedPraise" ||
      item.type === "customerFeedback" ||
      item.type === "meetingNote" ||
      item.type === "beforeAfterSummary" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Summary</label>
          <Textarea
            value={item.summary ?? ""}
            placeholder={
              item.type === "beforeAfterSummary"
                ? "Before: on-call ignored the alert. After: the page reliably meant action was needed."
                : "Paste the note, quote, or summary here."
            }
            onChange={(event) =>
              onFieldChange(item.id, "summary", optionalValue(event.target.value))
            }
          />
          {summaryError ? <p className="text-sm text-danger">{summaryError}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function EntryForm({
  mode,
  initialValue = emptyEntryInput,
  submitLabel = mode === "create" ? "Create entry" : "Save changes",
  onSubmit,
  onCancel,
}: EntryFormProps) {
  const [values, setValues] = useState<AccomplishmentEntryInput>(initialValue);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<ProofImageFileMap>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [advancedStructureOpen, setAdvancedStructureOpen] = useState(
    Boolean(
      initialValue.stakeholders.length ||
        initialValue.seniorityTags.length ||
        initialValue.roleTags.length,
    ),
  );
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    basic: true,
    situation: false,
    action: false,
    result: true,
    proof: true,
    tags: false,
  });

  useEffect(() => {
    setValues(initialValue);
    setErrors({});
    setImageFiles({});
    setPreviewUrls({});
    setAdvancedStructureOpen(
      Boolean(
        initialValue.stakeholders.length ||
          initialValue.seniorityTags.length ||
          initialValue.roleTags.length,
      ),
    );
  }, [initialValue]);

  useEffect(() => {
    const nextPreviewUrls = Object.fromEntries(
      Object.entries(imageFiles)
        .filter(([, file]) => Boolean(file))
        .map(([proofItemId, file]) => [proofItemId, URL.createObjectURL(file as File)]),
    );

    setPreviewUrls(nextPreviewUrls);

    return () => {
      Object.values(nextPreviewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const proofStrength = useMemo(
    () => getProofStrength(buildValidationPayload(values, imageFiles)),
    [imageFiles, values],
  );

  function errorFor(path: string) {
    return errors[path];
  }

  function setValue<K extends keyof AccomplishmentEntryInput>(
    key: K,
    value: AccomplishmentEntryInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function setOptionalField<K extends keyof AccomplishmentEntryInput>(
    key: K,
    value: string,
  ) {
    setValue(key, optionalValue(value) as AccomplishmentEntryInput[K]);
  }

  function setArrayField<K extends keyof AccomplishmentEntryInput>(
    key: K,
    nextValues: string[],
  ) {
    setValue(key, nextValues as AccomplishmentEntryInput[K]);
  }

  function toggleSection(sectionId: SectionId) {
    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  }

  function updateProofItem<K extends keyof ProofItem>(
    proofItemId: string,
    key: K,
    value: ProofItem[K],
  ) {
    setValues((current) => ({
      ...current,
      proofItems: current.proofItems.map((proofItem) =>
        proofItem.id === proofItemId ? { ...proofItem, [key]: value } : proofItem,
      ),
    }));
    setErrors((current) => {
      const next = { ...current };

      Object.keys(next)
        .filter((field) => field.startsWith("proofItems."))
        .forEach((field) => {
          delete next[field];
        });

      return next;
    });
  }

  function changeProofItemType(proofItemId: string, nextType: ProofItemType) {
    setValues((current) => ({
      ...current,
      proofItems: current.proofItems.map((proofItem) => {
        if (proofItem.id !== proofItemId) {
          return proofItem;
        }

        return {
          ...proofItem,
          type: nextType,
          link:
            nextType === "artifactLink" || nextType === "releaseNote"
              ? proofItem.link
              : null,
          metric: nextType === "metricSnapshot" ? proofItem.metric : null,
          localImage: nextType === "screenshot" ? proofItem.localImage : null,
        };
      }),
    }));

    if (nextType !== "screenshot") {
      setImageFiles((current) => {
        const next = { ...current };
        delete next[proofItemId];
        return next;
      });
    }
  }

  function addProofItem(type: ProofItemType) {
    setValues((current) => ({
      ...current,
      proofItems: [...current.proofItems, createEmptyProofItem(type)],
    }));
    setOpenSections((current) => ({ ...current, proof: true }));
  }

  function removeProofItem(proofItemId: string) {
    setValues((current) => ({
      ...current,
      proofItems: current.proofItems.filter((proofItem) => proofItem.id !== proofItemId),
    }));
    setImageFiles((current) => {
      const next = { ...current };
      delete next[proofItemId];
      return next;
    });
  }

  function selectProofImage(proofItemId: string, file: File | null) {
    setImageFiles((current) => {
      const next = { ...current };

      if (file) {
        next[proofItemId] = file;
      } else {
        delete next[proofItemId];
      }

      return next;
    });
  }

  function clearProofImage(proofItemId: string) {
    selectProofImage(proofItemId, null);
    updateProofItem(proofItemId, "localImage", null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = buildValidationPayload(values, imageFiles);
      const parsed = accomplishmentEntryInputSchema.parse(payload);
      await onSubmit(parsed, imageFiles);
    } catch (error) {
      if (error instanceof ZodError) {
        const nextErrors: FieldErrors = {};

        for (const issue of error.issues) {
          const key = fieldKey(issue.path);

          if (key && !nextErrors[key]) {
            nextErrors[key] = issue.message;
          }
        }

        setErrors(nextErrors);
      } else {
        setErrors({
          form: error instanceof Error ? error.message : "Unable to save entry",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <SectionCard
        id="basic"
        title="Basic info"
        description="Start with enough context to identify the win later."
        isOpen={openSections.basic}
        onToggle={toggleSection}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={values.title}
              placeholder="Stabilized release pipeline during infra migration"
              onChange={(event) => setValue("title", event.target.value)}
            />
            {errors.title ? <p className="text-sm text-danger">{errors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project</label>
            <Input
              value={values.project ?? ""}
              placeholder="Developer Platform"
              onChange={(event) => setOptionalField("project", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Start date</label>
            <Input
              type="date"
              value={values.startDate ?? ""}
              onChange={(event) => setOptionalField("startDate", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">End date</label>
            <Input
              type="date"
              value={values.endDate ?? ""}
              onChange={(event) => setOptionalField("endDate", event.target.value)}
            />
            {errors.endDate ? <p className="text-sm text-danger">{errors.endDate}</p> : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        id="situation"
        title="Situation"
        description="What made this work matter?"
        isOpen={openSections.situation}
        onToggle={toggleSection}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Context</label>
          <Textarea
            value={values.situation ?? ""}
            placeholder="The problem, risk, or opportunity that made this accomplishment meaningful."
            onChange={(event) => setOptionalField("situation", event.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        id="action"
        title="Action"
        description="What did you personally drive?"
        isOpen={openSections.action}
        onToggle={toggleSection}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Action</label>
          <Textarea
            value={values.action ?? ""}
            placeholder="The decision, build, coordination, or unblocking work you actually did."
            onChange={(event) => setOptionalField("action", event.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        id="result"
        title="Result"
        description="Capture the outcome first. You can polish wording later."
        isOpen={openSections.result}
        onToggle={toggleSection}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Result</label>
            <Textarea
              value={values.result ?? ""}
              placeholder="What changed for users, the team, or the business?"
              onChange={(event) => setOptionalField("result", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Top-line metric</label>
            <Input
              value={values.metric ?? ""}
              placeholder="Failure rate dropped from 18% to 3%"
              onChange={(event) => setOptionalField("metric", event.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        id="proof"
        title="Proof"
        description="Save the evidence now so future review writing is fast."
        isOpen={openSections.proof}
        onToggle={toggleSection}
      >
        <Card className="rounded-[1.75rem] border border-border bg-white/65">
          <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <ProofStrengthBadge entry={buildValidationPayload(values, imageFiles)} />
              <p className="text-sm leading-6 text-muted-foreground">
                {proofGuidance(proofStrength)}
              </p>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Strongest proof comes from a metric plus a quote, screenshot, or artifact.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          {proofItemTypeOptions.map((proofType) => (
            <Button
              key={proofType}
              variant="secondary"
              size="sm"
              onClick={() => addProofItem(proofType)}
            >
              Add {proofItemTypeLabels[proofType]}
            </Button>
          ))}
        </div>

        {values.proofItems.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-border-strong/70 bg-white/55 px-5 py-6 text-sm leading-6 text-muted-foreground">
            Start with the easiest thing you already have: a quote, a release note, a metric, or a link.
          </div>
        ) : (
          <div className="space-y-4">
            {values.proofItems.map((proofItem, index) => (
              <ProofItemEditor
                key={proofItem.id}
                item={proofItem}
                index={index}
                previewUrl={previewUrls[proofItem.id] ?? null}
                errorFor={errorFor}
                onTypeChange={changeProofItemType}
                onFieldChange={updateProofItem}
                onSelectImage={selectProofImage}
                onClearImage={clearProofImage}
                onRemove={removeProofItem}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        id="tags"
        title="Tags"
        description="Keep structure light by default. Add more only if it helps later filtering or storytelling."
        isOpen={openSections.tags}
        onToggle={toggleSection}
      >
        <div className="space-y-5">
          <PillInput
            label="Primary tags"
            hint="These power the main filters and tag analytics."
            values={values.tags}
            onChange={(next) => setArrayField("tags", next)}
            placeholder="reliability, launches, mentoring"
          />

          <div className="space-y-3 rounded-[1.5rem] border border-border bg-white/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">More structure</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Helpful for promotion packets, but optional for quick capture.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdvancedStructureOpen((current) => !current)}
              >
                {advancedStructureOpen ? "Hide" : "Show"}
              </Button>
            </div>

            {advancedStructureOpen ? (
              <div className="space-y-5">
                <PillInput
                  label="Stakeholders"
                  hint="Who benefited from or collaborated on this work?"
                  values={values.stakeholders}
                  onChange={(next) => setArrayField("stakeholders", next)}
                  placeholder="Support, Product, SRE"
                />
                <PillInput
                  label="Seniority tags"
                  hint="Useful later when you want to group entries by scope or leadership."
                  values={values.seniorityTags}
                  onChange={(next) => setArrayField("seniorityTags", next)}
                  placeholder="leadership, scope, influence"
                />
                <PillInput
                  label="Role tags"
                  values={values.roleTags}
                  onChange={(next) => setArrayField("roleTags", next)}
                  placeholder="staff, tech lead, backend"
                />
              </div>
            ) : null}
          </div>
        </div>
      </SectionCard>

      {errors.form ? (
        <p className="text-sm text-danger">{errors.form}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-border bg-white/60 px-5 py-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Capture the core now. You can keep refining the language after the evidence is safe.
        </p>
        <div className="flex flex-wrap gap-3">
          {onCancel ? (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
