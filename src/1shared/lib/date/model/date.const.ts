import { TMonth, TTimePeriod } from "./date.types";

export const MONTHS: TMonth[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "june",
  "july",
  "aug",
  "sept",
  "oct",
  "nov",
  "dec",
] as const;

export const TIME_PERIODS: TTimePeriod[] = ["year", ...MONTHS] as const;
