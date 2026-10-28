export const money = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const number = (value) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

export const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar" }).format(
    new Date(),
  );

export function numberIfNumeric(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (
    typeof value === "number" ||
    (String(value).trim() !== "" && !isNaN(Number(value)))
  ) {
    return number(Number(value));
  }
  return value;
}
