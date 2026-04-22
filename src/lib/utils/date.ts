const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateValue(date: string | Date) {
  if (date instanceof Date) {
    return date;
  }

  const dateOnlyMatch = dateOnlyPattern.exec(date);

  if (!dateOnlyMatch) {
    return new Date(date);
  }

  const [, year, month, day] = dateOnlyMatch;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Not set";
  }

  return dateFormatter.format(parseDateValue(date));
}

export function formatCompactDate(date: string | null | undefined) {
  if (!date) {
    return "Open-ended";
  }

  return monthYearFormatter.format(parseDateValue(date));
}

export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
) {
  if (!startDate && !endDate) {
    return "Timeline not set";
  }

  if (startDate && !endDate) {
    return `${formatCompactDate(startDate)} to Present`;
  }

  if (!startDate && endDate) {
    return `Through ${formatCompactDate(endDate)}`;
  }

  return `${formatCompactDate(startDate)} to ${formatCompactDate(endDate)}`;
}

export function formatRelativeTime(date: string | null | undefined) {
  if (!date) {
    return "No recent activity";
  }

  const deltaInMs = parseDateValue(date).getTime() - Date.now();
  const deltaInMinutes = Math.round(deltaInMs / (1000 * 60));

  if (Math.abs(deltaInMinutes) < 60) {
    return relativeFormatter.format(deltaInMinutes, "minute");
  }

  const deltaInHours = Math.round(deltaInMinutes / 60);
  if (Math.abs(deltaInHours) < 24) {
    return relativeFormatter.format(deltaInHours, "hour");
  }

  const deltaInDays = Math.round(deltaInHours / 24);
  if (Math.abs(deltaInDays) < 30) {
    return relativeFormatter.format(deltaInDays, "day");
  }

  return dateFormatter.format(parseDateValue(date));
}

export function getQuarterStart(date = new Date()) {
  const month = date.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;

  return new Date(date.getFullYear(), quarterStartMonth, 1);
}

export function getQuarterNumber(date = new Date()) {
  return Math.floor(date.getMonth() / 3) + 1;
}

export function getQuarterSortKey(date: string | Date) {
  const resolvedDate = parseDateValue(date);
  return `${resolvedDate.getFullYear()}-Q${getQuarterNumber(resolvedDate)}`;
}

export function getQuarterLabel(date: string | Date) {
  const resolvedDate = parseDateValue(date);
  return `Q${getQuarterNumber(resolvedDate)} ${resolvedDate.getFullYear()}`;
}
