import { z } from "zod";

export const proofItemTypeOptions = [
  "screenshot",
  "pastedPraise",
  "releaseNote",
  "metricSnapshot",
  "customerFeedback",
  "artifactLink",
  "meetingNote",
  "beforeAfterSummary",
] as const;

export const proofStrengthOptions = [
  "weak",
  "medium",
  "strong",
  "strongest",
] as const;

export const proofItemTypeLabels: Record<ProofItemType, string> = {
  screenshot: "Screenshot",
  pastedPraise: "Pasted praise",
  releaseNote: "Release note",
  metricSnapshot: "Metric snapshot",
  customerFeedback: "Customer feedback",
  artifactLink: "Artifact link",
  meetingNote: "Meeting note",
  beforeAfterSummary: "Before/after summary",
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
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((date) => {
      const [year, month, day] = date.split("-").map(Number);
      const candidate = new Date(year, month - 1, day);

      return (
        candidate.getFullYear() === year &&
        candidate.getMonth() === month - 1 &&
        candidate.getDate() === day
      );
    }, "Date must be a real calendar date")
    .nullable(),
);

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  },
  z.url("Link must be a valid URL").nullable(),
);

const stringListSchema = z
  .array(z.string().trim().min(1).max(80))
  .default([])
  .transform((items) => Array.from(new Set(items)));

export const proofItemTypeSchema = z.enum(proofItemTypeOptions);
export const proofStrengthSchema = z.enum(proofStrengthOptions);

export const localImageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  createdAt: z.string().datetime(),
});

export const proofItemSchema = z
  .object({
    id: z.string().min(1),
    type: proofItemTypeSchema,
    title: optionalString,
    summary: optionalString,
    link: optionalUrl,
    metric: optionalString,
    localImage: localImageSchema.nullable().default(null),
  })
  .superRefine((item, context) => {
    const hasSummary = Boolean(item.summary);
    const hasLink = Boolean(item.link);
    const hasMetric = Boolean(item.metric);
    const hasImage = Boolean(item.localImage);

    switch (item.type) {
      case "screenshot": {
        if (!hasImage) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["localImage"],
            message: "Screenshots need an attached image",
          });
        }

        if (hasLink) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["link"],
            message: "Screenshots do not use links",
          });
        }

        if (hasMetric) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["metric"],
            message: "Screenshots do not use metric fields",
          });
        }
        break;
      }
      case "artifactLink":
      case "releaseNote": {
        if (!hasLink) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["link"],
            message: `${proofItemTypeLabels[item.type]} needs a valid link`,
          });
        }

        if (hasImage) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["localImage"],
            message: `${proofItemTypeLabels[item.type]} does not use image uploads`,
          });
        }

        if (hasMetric) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["metric"],
            message: `${proofItemTypeLabels[item.type]} does not use metric fields`,
          });
        }
        break;
      }
      case "metricSnapshot": {
        if (!hasSummary && !hasMetric) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["metric"],
            message: "Metric snapshots need a metric or summary",
          });
        }

        if (hasLink) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["link"],
            message: "Metric snapshots do not use links",
          });
        }

        if (hasImage) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["localImage"],
            message: "Metric snapshots do not use image uploads",
          });
        }
        break;
      }
      default: {
        if (!hasSummary) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["summary"],
            message: `${proofItemTypeLabels[item.type]} needs a summary`,
          });
        }

        if (hasLink) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["link"],
            message: `${proofItemTypeLabels[item.type]} does not use links`,
          });
        }

        if (hasMetric) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["metric"],
            message: `${proofItemTypeLabels[item.type]} does not use metric fields`,
          });
        }

        if (hasImage) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["localImage"],
            message: `${proofItemTypeLabels[item.type]} does not use image uploads`,
          });
        }
      }
    }
  });

const proofItemsSchema = z
  .array(proofItemSchema)
  .default([])
  .transform((items) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);
      return true;
    });
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
    proofItems: proofItemsSchema,
    tags: stringListSchema,
    seniorityTags: stringListSchema,
    roleTags: stringListSchema,
  })
  .superRefine((entry, context) => {
    if (entry.startDate && entry.endDate) {
      if (entry.endDate < entry.startDate) {
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

export type ProofItemType = z.infer<typeof proofItemTypeSchema>;
export type ProofItem = z.infer<typeof proofItemSchema>;
export type ProofStrength = z.infer<typeof proofStrengthSchema>;
export type LocalImage = z.infer<typeof localImageSchema>;
export type AccomplishmentEntryInput = z.infer<
  typeof accomplishmentEntryInputSchema
>;
export type AccomplishmentEntry = z.infer<typeof accomplishmentEntrySchema>;

export function createEmptyProofItem(type: ProofItemType): ProofItem {
  return {
    id: crypto.randomUUID(),
    type,
    title: null,
    summary: null,
    link: null,
    metric: null,
    localImage: null,
  };
}

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
  proofItems: [],
  tags: [],
  seniorityTags: [],
  roleTags: [],
};
