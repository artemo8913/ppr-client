export type TMonth = "jan" | "feb" | "mar" | "apr" | "may" | "june" | "july" | "aug" | "sept" | "oct" | "nov" | "dec";

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

export type TTimePeriod = "year" | TMonth;

export const TIME_PERIODS: TTimePeriod[] = ["year", ...MONTHS] as const;

export function getTimePeriodFromString(string: string): TTimePeriod | undefined {
  for (const period of TIME_PERIODS) {
    if (string.startsWith(period)) {
      return period;
    }
  }
}
export type TQuartalNumber = 1 | 2 | 3 | 4;

export function getQuartal(timePeriod?: TTimePeriod): TQuartalNumber | undefined {
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

export function getMonthsByQuartal(quartal?: TQuartalNumber): TMonth[] {
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
