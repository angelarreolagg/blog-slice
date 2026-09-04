const FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(isoDate: string): string {
  return FORMATTER.format(new Date(`${isoDate}T00:00:00Z`));
}
