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

export function getQuartal(month: TMonth): TQuartalNumber {
  if (month === "jan" || month === "feb" || month === "mar") {
    return 1;
  } else if (month === "apr" || month === "may" || month === "june") {
    return 2;
  } else if (month === "july" || month === "aug" || month === "sept") {
    return 3;
  }

  return 4;
}

export function getMonthsByQuartal(quartal: TQuartalNumber): TMonth[] {
  if (quartal === 1) {
    return ["jan", "feb", "mar"];
  } else if (quartal === 2) {
    return ["apr", "may", "june"];
  } else if (quartal === 3) {
    return ["july", "aug", "sept"];
  }

  return ["oct", "nov", "dec"];
}
