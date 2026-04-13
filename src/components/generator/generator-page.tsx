"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryFiltersPanel } from "@/components/entries/entry-filters-panel";
import { EntryMetadataStrip } from "@/components/entries/entry-metadata-strip";
import { ProofStrengthBadge } from "@/components/entries/proof-strength-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEntries } from "@/hooks/use-entry";
import {
  generateOutput,
  generatorOutputTypeLabels,
  generatorOutputTypes,
  generatorToneLabels,
  generatorTones,
  type GeneratorOutputType,
  type GeneratorTone,
} from "@/lib/generator";
import {
  buildEntryFilterOptions,
  emptyEntryFilters,
  filterEntries,
  type EntryFilters,
} from "@/lib/utils/entry-search";

function buildBaseSignature({
  filters,
  outputType,
  selectedIds,
  targetLevel,
  tone,
}: {
  filters: EntryFilters;
  outputType: GeneratorOutputType;
  selectedIds: string[];
  targetLevel: string;
  tone: GeneratorTone;
}) {
  return JSON.stringify({
    filters,
    outputType,
    selectedIds: [...selectedIds].sort(),
    targetLevel: outputType === "promotionCase" ? targetLevel.trim() : "",
    tone,
  });
}

function SelectableEntryCard({
  body,
  checked,
  entryId,
  footer,
  onToggle,
  title,
}: {
  body: React.ReactNode;
  checked: boolean;
  entryId: string;
  footer?: React.ReactNode;
  onToggle: () => void;
  title: string;
}) {
  return (
    <Card
      className={
        checked
          ? "rounded-[1.75rem] border-border-strong bg-white transition hover:-translate-y-0.5"
          : "rounded-[1.75rem] bg-white/85 transition hover:-translate-y-0.5"
      }
    >
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <label
              htmlFor={`generator-select-${entryId}`}
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                id={`generator-select-${entryId}`}
                checked={checked}
                type="checkbox"
                aria-label={`Select ${title}`}
                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
                onChange={onToggle}
              />
              <span className="sr-only">{title}</span>
              <span className="space-y-2">{body}</span>
            </label>
          </div>
          <span
            className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
              checked
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-white/70 text-muted-foreground"
            }`}
          >
            {checked ? "✓" : ""}
          </span>
        </div>
        {footer ? <div className="pl-7">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}

export function GeneratorPage() {
  const entries = useEntries();
  const [filters, setFilters] = useState<EntryFilters>(emptyEntryFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [outputType, setOutputType] = useState<GeneratorOutputType>("selfReview");
  const [tone, setTone] = useState<GeneratorTone>("confident");
  const [targetLevel, setTargetLevel] = useState("");
  const [draft, setDraft] = useState("");
  const [lastGeneratedBaseSignature, setLastGeneratedBaseSignature] = useState<
    string | null
  >(null);
  const [lastGeneratedVariantIndex, setLastGeneratedVariantIndex] = useState<number | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<"success" | "error" | null>(null);

  const filterOptions = useMemo(
    () => (entries ? buildEntryFilterOptions(entries) : null),
    [entries],
  );
  const filteredEntries = useMemo(
    () => (entries ? filterEntries(entries, filters) : null),
    [entries, filters],
  );
  const selectedEntries = useMemo(
    () => entries?.filter((entry) => selectedIds.includes(entry.id)) ?? [],
    [entries, selectedIds],
  );

  const baseSignature = useMemo(
    () =>
      buildBaseSignature({
        filters,
        outputType,
        selectedIds,
        targetLevel,
        tone,
      }),
    [filters, outputType, selectedIds, targetLevel, tone],
  );
  const isDraftStale = Boolean(draft) && lastGeneratedBaseSignature !== baseSignature;
  const visibleSelectedCount = filteredEntries
    ? filteredEntries.filter((entry) => selectedIds.includes(entry.id)).length
    : 0;
  const canGenerate =
    selectedEntries.length > 0 &&
    (outputType !== "promotionCase" || targetLevel.trim().length > 0);
  const canRegenerate = Boolean(draft) && !isDraftStale && selectedEntries.length > 0;

  function toggleSelection(entryId: string) {
    setCopyStatus(null);
    setSelectedIds((current) =>
      current.includes(entryId)
        ? current.filter((id) => id !== entryId)
        : [...current, entryId],
    );
  }

  function selectVisibleEntries() {
    if (!filteredEntries) {
      return;
    }

    setCopyStatus(null);
    setSelectedIds((current) =>
      Array.from(new Set([...current, ...filteredEntries.map((entry) => entry.id)])),
    );
  }

  function clearSelection() {
    setCopyStatus(null);
    setSelectedIds([]);
  }

  function applyGeneration(variantIndex: number) {
    const nextDraft = generateOutput({
      entries: selectedEntries,
      outputType,
      tone,
      targetLevel,
      variantIndex,
    });

    setDraft(nextDraft);
    setLastGeneratedBaseSignature(baseSignature);
    setLastGeneratedVariantIndex(variantIndex);
    setCopyStatus(null);
  }

  async function handleCopy() {
    if (!draft) {
      return;
    }

    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  if (!entries || !filterOptions || !filteredEntries) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Generator"
          description="Loading your saved evidence so you can turn it into review, promotion, resume, or interview drafts."
        />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Generator"
          description="Select saved accomplishments, choose a tone, and turn evidence into editable output."
        />
        <EmptyState
          title="No entries available to generate from"
          description="Capture at least one accomplishment before opening the generator. The output quality depends on the structured evidence saved in each entry."
          ctaHref="/entries/new"
          ctaLabel="Capture your first entry"
          secondaryCtaHref="/settings"
          secondaryCtaLabel="Load demo entries"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Generator"
        description="Filter down to the strongest evidence, choose a single output type and tone, then turn the selected work into an editable draft you can copy anywhere."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-5">
          <EntryFiltersPanel
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            filteredCount={filteredEntries.length}
            totalEntries={entries.length}
            queryPlaceholder="Filter entries before selecting what should feed the draft"
          />

          <Card className="rounded-[2rem]">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-2">
                  <CardTitle>Select entries</CardTitle>
                  <CardDescription>
                    Choose the evidence packets that should feed the current draft.
                  </CardDescription>
                </div>
                <Badge variant="subtle">
                  {selectedIds.length} selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-muted/55 px-4 py-3 text-sm">
                <p className="text-muted-foreground">
                  {visibleSelectedCount} of {filteredEntries.length} visible entries selected.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={filteredEntries.length === 0}
                    onClick={selectVisibleEntries}
                  >
                    Select visible
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={selectedIds.length === 0}
                    onClick={clearSelection}
                  >
                    Clear selection
                  </Button>
                </div>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-border-strong/70 bg-white/55 px-5 py-7">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    No entries match these filters
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Widen the quarter or proof filters, or search with a different project, tag, or metric phrase.
                  </p>
                </div>
              ) : (
                <div className="grid max-h-[56rem] gap-4 overflow-y-auto pr-1">
                  {filteredEntries.map((entry) => {
                    const checked = selectedIds.includes(entry.id);

                    return (
                      <SelectableEntryCard
                        key={entry.id}
                        body={
                          <>
                            <EntryMetadataStrip entry={entry} />
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="space-y-2">
                                  <p className="text-lg font-semibold tracking-tight text-foreground">
                                    {entry.title}
                                  </p>
                                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                                    {entry.result ??
                                      entry.metric ??
                                      entry.action ??
                                      "No summary recorded yet."}
                                  </p>
                                </div>
                                <ProofStrengthBadge entry={entry} />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {entry.tags.slice(0, 4).map((tag) => (
                                  <Badge key={tag} variant="subtle">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        }
                        checked={checked}
                        entryId={entry.id}
                        footer={
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={`/entries/${entry.id}`}
                              className={buttonStyles({ variant: "ghost", size: "sm" })}
                            >
                              Review entry
                            </Link>
                          </div>
                        }
                        title={entry.title}
                        onToggle={() => toggleSelection(entry.id)}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Draft controls</CardTitle>
              <CardDescription>
                Pick the output shape and tone, then generate from the selected entries only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="generator-output-type"
                    className="text-sm font-medium text-foreground"
                  >
                    Output type
                  </label>
                  <Select
                    id="generator-output-type"
                    value={outputType}
                    onChange={(event) => {
                      setCopyStatus(null);
                      setOutputType(event.target.value as GeneratorOutputType);
                    }}
                  >
                    {generatorOutputTypes.map((type) => (
                      <option key={type} value={type}>
                        {generatorOutputTypeLabels[type]}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="generator-tone"
                    className="text-sm font-medium text-foreground"
                  >
                    Tone
                  </label>
                  <Select
                    id="generator-tone"
                    value={tone}
                    onChange={(event) => {
                      setCopyStatus(null);
                      setTone(event.target.value as GeneratorTone);
                    }}
                  >
                    {generatorTones.map((value) => (
                      <option key={value} value={value}>
                        {generatorToneLabels[value]}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {outputType === "promotionCase" ? (
                <div className="space-y-2">
                  <label
                    htmlFor="generator-target-level"
                    className="text-sm font-medium text-foreground"
                  >
                    Target level
                  </label>
                  <Input
                    id="generator-target-level"
                    value={targetLevel}
                    placeholder="Example: Staff Engineer"
                    onChange={(event) => {
                      setCopyStatus(null);
                      setTargetLevel(event.target.value);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Promotion framing is generated per draft, so keep this specific to the case you want to make.
                  </p>
                </div>
              ) : null}

              <div className="rounded-[1.5rem] bg-muted/55 px-4 py-3 text-sm leading-6 text-muted-foreground">
                <p>
                  {selectedEntries.length === 0
                    ? "No entries selected yet."
                    : `${selectedEntries.length} entries will feed the current draft.`}
                </p>
                {outputType === "promotionCase" && targetLevel.trim().length === 0 ? (
                  <p className="mt-1">Add a target level before generating a promotion case.</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button disabled={!canGenerate} onClick={() => applyGeneration(0)}>
                  Generate
                </Button>
                <Button
                  variant="secondary"
                  disabled={!canRegenerate}
                  onClick={() =>
                    applyGeneration((lastGeneratedVariantIndex ?? 0) + 1)
                  }
                >
                  Regenerate
                </Button>
                <Button variant="ghost" disabled={!draft} onClick={handleCopy}>
                  Copy
                </Button>
              </div>

              {isDraftStale ? (
                <div className="rounded-[1.5rem] border border-warning/35 bg-warning/10 px-4 py-3 text-sm leading-6 text-warning">
                  The draft is out of date with the current filters, selection, or output settings. Your edits are preserved until you generate again.
                </div>
              ) : null}

              {copyStatus === "success" ? (
                <p className="text-sm text-success">Draft copied to the clipboard.</p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="text-sm text-danger">
                  Clipboard access failed. Select the text manually and copy it from the editor.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Editable output</CardTitle>
              <CardDescription>
                Generate once, then keep editing before you copy it into a review, packet, or interview prep doc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {draft ? (
                <Textarea
                  aria-label="Editable output"
                  value={draft}
                  className="min-h-[34rem] font-mono text-[13px] leading-6"
                  onChange={(event) => {
                    setCopyStatus(null);
                    setDraft(event.target.value);
                  }}
                />
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-border-strong/70 bg-white/55 px-5 py-7">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    No generated draft yet
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Select one or more entries, choose the output shape, and generate the first draft here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
