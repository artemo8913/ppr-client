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

export const stringToMonthIntlRu = (string: string): string => {
  for (const month of months) {
    if (string.startsWith(month)) {
      return monthsIntlRu[month];
    }
  }
  return "";
};
