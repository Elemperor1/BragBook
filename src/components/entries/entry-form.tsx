"use client";

import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";
import { PillInput } from "@/components/ui/pill-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  accomplishmentEntryInputSchema,
  emptyEntryInput,
  proofTypeLabels,
  proofTypeOptions,
  type AccomplishmentEntryInput,
  type LocalImage,
} from "@/lib/schemas/entry";
import { ProofImagePreview } from "@/components/entries/proof-image-preview";

type FieldErrors = Partial<
  Record<keyof AccomplishmentEntryInput | "form", string>
>;

type ImageMode = "empty" | "keep" | "replace" | "remove";

interface EntryFormProps {
  mode: "create" | "edit";
  initialValue?: AccomplishmentEntryInput;
  submitLabel?: string;
  onSubmit: (
    values: AccomplishmentEntryInput,
    imageFile?: File | null,
  ) => Promise<void>;
  onCancel?: () => void;
}

function optionalValue(value: string) {
  return value.trim().length > 0 ? value : null;
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
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>(
    initialValue.localImage ? "keep" : "empty",
  );

  useEffect(() => {
    setValues(initialValue);
    setErrors({});
    setReplacementFile(null);
    setImagePreviewUrl(null);
    setImageMode(initialValue.localImage ? "keep" : "empty");
  }, [initialValue]);

  useEffect(() => {
    if (!replacementFile) {
      setImagePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(replacementFile);
    setImagePreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [replacementFile]);

  const imagePreview = useMemo(
    () => (imageMode === "replace" ? imagePreviewUrl : null),
    [imageMode, imagePreviewUrl],
  );
  const displayedImage: LocalImage | null = useMemo(() => {
    if (imageMode === "keep") {
      return values.localImage;
    }

    if (imageMode === "replace" && replacementFile) {
      return {
        id: "pending-preview",
        name: replacementFile.name,
        mimeType: replacementFile.type || "image/*",
        size: replacementFile.size,
        createdAt: new Date().toISOString(),
      };
    }

    return null;
  }, [imageMode, replacementFile, values.localImage]);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload: AccomplishmentEntryInput = {
      ...values,
      localImage: imageMode === "keep" ? initialValue.localImage ?? null : null,
    };

    try {
      const parsed = accomplishmentEntryInputSchema.parse(payload);
      await onSubmit(parsed, imageMode === "replace" ? replacementFile : null);
    } catch (error) {
      if (error instanceof ZodError) {
        const nextErrors: FieldErrors = {};

        for (const issue of error.issues) {
          const field = issue.path[0] as keyof AccomplishmentEntryInput | undefined;
          if (field && !nextErrors[field]) {
            nextErrors[field] = issue.message;
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
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Capture the basics first: what happened, where it happened, and when.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={values.title}
              placeholder="Stabilized release pipeline during infra migration"
              onChange={(event) => setValue("title", event.target.value)}
            />
            {errors.title ? (
              <p className="text-sm text-danger">{errors.title}</p>
            ) : null}
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
            <label className="text-sm font-medium text-foreground">Proof type</label>
            <Select
              value={values.proofType}
              onChange={(event) =>
                setValue("proofType", event.target.value as AccomplishmentEntryInput["proofType"])
              }
            >
              {proofTypeOptions.map((proofType) => (
                <option key={proofType} value={proofType}>
                  {proofTypeLabels[proofType]}
                </option>
              ))}
            </Select>
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
            {errors.endDate ? (
              <p className="text-sm text-danger">{errors.endDate}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>STAR Narrative</CardTitle>
          <CardDescription>
            Capture enough detail now so future review writing is synthesis, not memory work.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Situation</label>
            <Textarea
              value={values.situation ?? ""}
              placeholder="What context or problem made this work matter?"
              onChange={(event) => setOptionalField("situation", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Action</label>
            <Textarea
              value={values.action ?? ""}
              placeholder="What did you specifically drive, build, influence, or unblock?"
              onChange={(event) => setOptionalField("action", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Result</label>
            <Textarea
              value={values.result ?? ""}
              placeholder="What changed for users, the team, or the business?"
              onChange={(event) => setOptionalField("result", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Metric</label>
            <Input
              value={values.metric ?? ""}
              placeholder="Failure rate dropped from 18% to 3%"
              onChange={(event) => setOptionalField("metric", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proof</CardTitle>
          <CardDescription>
            Save links, praise, or screenshots that make the accomplishment easier to trust later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Proof notes</label>
            <Textarea
              value={values.proofNotes ?? ""}
              placeholder="What evidence would you point to in a review or promotion packet?"
              onChange={(event) => setOptionalField("proofNotes", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Pasted praise</label>
            <Textarea
              value={values.pastedPraise ?? ""}
              placeholder="Paste direct feedback from a teammate, partner, or manager."
              onChange={(event) => setOptionalField("pastedPraise", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Artifact link</label>
            <Input
              value={values.artifactLink ?? ""}
              placeholder="https://example.com/design-doc"
              onChange={(event) => setOptionalField("artifactLink", event.target.value)}
            />
            {errors.artifactLink ? (
              <p className="text-sm text-danger">{errors.artifactLink}</p>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Local image</label>
              <p className="text-xs leading-5 text-muted-foreground">
                Stored locally in IndexedDB. Useful for screenshots, dashboards, or visual proof.
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2.5 file:font-medium file:text-accent-foreground"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                setReplacementFile(file);
                setImageMode("replace");
              }}
            />
            <ProofImagePreview
              image={displayedImage}
              previewUrl={imagePreview}
            />
            <div className="flex flex-wrap gap-3">
              {initialValue.localImage && imageMode === "replace" ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setReplacementFile(null);
                    setImageMode("keep");
                  }}
                >
                  Keep saved image
                </Button>
              ) : null}
              {imageMode === "replace" ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setReplacementFile(null);
                    setImageMode(initialValue.localImage ? "keep" : "empty");
                  }}
                >
                  Clear selection
                </Button>
              ) : null}
              {(imageMode === "keep" || imageMode === "replace") && (initialValue.localImage || replacementFile) ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setReplacementFile(null);
                    setImageMode(initialValue.localImage ? "remove" : "empty");
                  }}
                >
                  Remove image
                </Button>
              ) : null}
              {imageMode === "remove" && initialValue.localImage ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setImageMode("keep");
                  }}
                >
                  Restore saved image
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add enough structure that you can later group wins by role, scope, and review theme.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <PillInput
            label="Stakeholders"
            hint="Who benefited from or collaborated on this work?"
            values={values.stakeholders}
            onChange={(next) => setArrayField("stakeholders", next)}
            placeholder="Support, Product, SRE"
          />
          <PillInput
            label="Tags"
            values={values.tags}
            onChange={(next) => setArrayField("tags", next)}
            placeholder="reliability, launches, mentoring"
          />
          <PillInput
            label="Seniority tags"
            hint="Helpful when you later write self-reviews or promotion cases."
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
        </CardContent>
      </Card>

      {errors.form ? <p className="text-sm text-danger">{errors.form}</p> : null}

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
