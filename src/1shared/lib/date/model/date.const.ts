import { Month, TimePeriod } from "./date.types";

export const MONTHS: Month[] = [
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

export const TIME_PERIODS: TimePeriod[] = ["year", ...MONTHS] as const;
