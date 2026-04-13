import { z } from "zod";

export const proofTypeOptions = [
  "artifact",
  "praise",
  "metric",
  "image",
  "doc",
  "other",
] as const;

export const proofTypeLabels: Record<ProofType, string> = {
  artifact: "Artifact",
  praise: "Praise",
  metric: "Metric",
  image: "Image",
  doc: "Document",
  other: "Other",
};

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  },
  z.string().max(4000).nullable(),
);

const optionalDate = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  },
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
);

const stringListSchema = z
  .array(z.string().trim().min(1).max(80))
  .default([])
  .transform((items) => Array.from(new Set(items)));

export const proofTypeSchema = z.enum(proofTypeOptions);

export const localImageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  createdAt: z.string().datetime(),
});

export const accomplishmentEntryInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(160),
    startDate: optionalDate,
    endDate: optionalDate,
    project: optionalString,
    situation: optionalString,
    action: optionalString,
    result: optionalString,
    metric: optionalString,
    stakeholders: stringListSchema,
    proofType: proofTypeSchema,
    proofNotes: optionalString,
    pastedPraise: optionalString,
    artifactLink: z.preprocess(
      (value) => {
        if (typeof value !== "string") {
          return value;
        }

        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      },
      z.url("Artifact link must be a valid URL").nullable(),
    ),
    tags: stringListSchema,
    seniorityTags: stringListSchema,
    roleTags: stringListSchema,
    localImage: localImageSchema.nullable().default(null),
  })
  .superRefine((entry, context) => {
    if (entry.startDate && entry.endDate) {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);

      if (end < start) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date cannot be earlier than start date",
        });
      }
    }
  });

export const accomplishmentEntrySchema = accomplishmentEntryInputSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProofType = z.infer<typeof proofTypeSchema>;
export type LocalImage = z.infer<typeof localImageSchema>;
export type AccomplishmentEntryInput = z.infer<
  typeof accomplishmentEntryInputSchema
>;
export type AccomplishmentEntry = z.infer<typeof accomplishmentEntrySchema>;

export const emptyEntryInput: AccomplishmentEntryInput = {
  title: "",
  startDate: null,
  endDate: null,
  project: null,
  situation: null,
  action: null,
  result: null,
  metric: null,
  stakeholders: [],
  proofType: "artifact",
  proofNotes: null,
  pastedPraise: null,
  artifactLink: null,
  tags: [],
  seniorityTags: [],
  roleTags: [],
  localImage: null,
};
