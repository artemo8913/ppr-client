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
  "sept",
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

export const findMonthByStart = (string: string): string => {
  if (string.startsWith("year")) {
    return monthsIntlRu["year"];
  } else if (string.startsWith("jan")) {
    return monthsIntlRu["jan"];
  } else if (string.startsWith("feb")) {
    return monthsIntlRu["feb"];
  } else if (string.startsWith("mar")) {
    return monthsIntlRu["mar"];
  } else if (string.startsWith("apr")) {
    return monthsIntlRu["apr"];
  } else if (string.startsWith("may")) {
    return monthsIntlRu["may"];
  } else if (string.startsWith("june")) {
    return monthsIntlRu["june"];
  } else if (string.startsWith("july")) {
    return monthsIntlRu["july"];
  } else if (string.startsWith("aug")) {
    return monthsIntlRu["aug"];
  } else if (string.startsWith("sept")) {
    return monthsIntlRu["sept"];
  } else if (string.startsWith("oct")) {
    return monthsIntlRu["oct"];
  } else if (string.startsWith("nov")) {
    return monthsIntlRu["nov"];
  } else if (string.startsWith("dec")) {
    return monthsIntlRu["dec"];
  }
  return "";
};
