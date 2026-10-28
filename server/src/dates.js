const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_PATTERN = /^\d{4}-\d{2}$/;

export function parseDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function currentMonth(timeZone = "Asia/Makassar") {
  return new Intl.DateTimeFormat("en-CA", { timeZone })
    .format(new Date())
    .slice(0, 7);
}

export function monthRange(month) {
  if (typeof month !== "string" || !MONTH_PATTERN.test(month)) return null;
  const [year, monthIndex] = month.split("-").map(Number);
  if (monthIndex < 1 || monthIndex > 12) return null;
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));
  return { start, end };
}
