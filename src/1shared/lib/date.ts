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

export type TQuartalNumber = 1 | 2 | 3 | 4;

export function getCurrentQuartal(timePeriod?: TPprTimePeriod): TQuartalNumber | undefined {
  if (timePeriod === "jan" || timePeriod === "feb" || timePeriod === "mar") {
    return 1;
  } else if (timePeriod === "apr" || timePeriod === "may" || timePeriod === "june") {
    return 2;
  } else if (timePeriod === "july" || timePeriod === "aug" || timePeriod === "sept") {
    return 3;
  } else if (timePeriod === "oct" || timePeriod === "nov" || timePeriod === "dec") {
    return 4;
  }
}

export function getQuartalMonths(quartal?: TQuartalNumber): TMonth[] {
  if (quartal === 1) {
    return ["jan", "feb", "mar"];
  } else if (quartal === 2) {
    return ["apr", "may", "june"];
  } else if (quartal === 3) {
    return ["july", "aug", "sept"];
  } else if (quartal === 4) {
    return ["oct", "nov", "dec"];
  }
  return [];
}
