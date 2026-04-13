import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { formatDateRange } from "@/lib/utils/date";

function compact(entry: AccomplishmentEntry) {
  const projectLine = entry.project ? `${entry.title} (${entry.project})` : entry.title;

  return {
    heading: projectLine,
    timeline: formatDateRange(entry.startDate, entry.endDate),
    situation: entry.situation ?? "Situation not recorded yet.",
    action: entry.action ?? "Action not recorded yet.",
    result: entry.result ?? "Result not recorded yet.",
    metric: entry.metric ? `Metric: ${entry.metric}` : "Metric: none captured yet.",
  };
}

export function renderSelfReview(entry: AccomplishmentEntry) {
  const summary = compact(entry);

  return [
    `Impact Summary: ${summary.heading}`,
    `Timeline: ${summary.timeline}`,
    "",
    `Situation: ${summary.situation}`,
    `Action: ${summary.action}`,
    `Result: ${summary.result}`,
    summary.metric,
  ].join("\n");
}

export function renderPromotionCase(entry: AccomplishmentEntry) {
  const summary = compact(entry);
  const signals = [...entry.seniorityTags, ...entry.roleTags].join(", ") || "No tags captured";

  return [
    `Promotion Evidence: ${summary.heading}`,
    `Scope Signals: ${signals}`,
    `Timeline: ${summary.timeline}`,
    "",
    `Why it mattered: ${summary.situation}`,
    `What changed because of the work: ${summary.result}`,
    summary.metric,
  ].join("\n");
}

export function renderResumeBullet(entry: AccomplishmentEntry) {
  const action = (entry.action ?? entry.title).replace(/[.!?]+$/, "");
  const metric = entry.metric
    ? entry.metric.replace(/[.!?]+$/, "").replace(/^[A-Z]/, (value) => value.toLowerCase())
    : null;
  const fragments = [
    action,
    entry.project ? `for ${entry.project}` : null,
    metric ? `delivering ${metric}` : null,
  ].filter(Boolean);

  return `${fragments.join(", ")}.`;
}

export function renderStarStory(entry: AccomplishmentEntry) {
  const summary = compact(entry);

  return [
    `Situation: ${summary.situation}`,
    `Task: ${entry.project ? `Support the goals of ${entry.project}.` : "Drive the work to completion."}`,
    `Action: ${summary.action}`,
    `Result: ${summary.result}`,
    summary.metric,
  ].join("\n");
}
