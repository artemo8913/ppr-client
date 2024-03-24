export type TMonths = "jan" | "feb" | "mar" | "apr" | "may" | "june" | "july" | "aug" | "sept" | "oct" | "nov" | "dec";

export const months: TMonths[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "june",
  "july",
  "aug",
  `sept`,
  "oct",
  "nov",
  "dec",
] as const;

export type TPprTimePeriod =
  | "year"
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "june"
  | "july"
  | "aug"
  | "sept"
  | "oct"
  | "nov"
  | "dec";

export const pprTimePeriods: TPprTimePeriod[] = [
  "year",
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "june",
  "july",
  "aug",
  `sept`,
  "oct",
  "nov",
  "dec",
] as const;

export const monthsIntlRu = {
  year: "год",
  jan: "январь",
  feb: "февраль",
  mar: "март",
  apr: "апрель",
  may: "май",
  june: "июнь",
  july: "июль",
  aug: "август",
  sept: "сентябрь",
  oct: "октябрь",
  nov: "ноябрь",
  dec: "декабрь",
};
