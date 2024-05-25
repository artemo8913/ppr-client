export type TMonth = "jan" | "feb" | "mar" | "apr" | "may" | "june" | "july" | "aug" | "sept" | "oct" | "nov" | "dec";

export const months: TMonth[] = [
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

export type TPprTimePeriod = "year" | TMonth;

export const pprTimePeriods: TPprTimePeriod[] = ["year", ...months] as const;

export const tymePeriodIntlRu = {
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

export const stringToTimePeriodIntlRu = (string: string): string => {
  for (const period of pprTimePeriods) {
    if (string.startsWith(period)) {
      return tymePeriodIntlRu[period];
    }
  }
  return "";
};

export const isStringStartsWithTimePeriodName = (string: string): boolean => {
  for (const period of pprTimePeriods) {
    if (string.startsWith(period)) {
      return true;
    }
  }
  return false;
};
