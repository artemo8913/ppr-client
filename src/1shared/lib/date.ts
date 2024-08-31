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

const TIME_PERIOD_RU = {
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

export const translateRuTimePeriod = (string: string): string => {
  for (const period of TIME_PERIODS) {
    if (string.startsWith(period)) {
      return TIME_PERIOD_RU[period];
    }
  }
  return "";
};
// TODO: удалить при переходе к scss стилям у таблицы ППР
export const checkIsStartsWithTimePeriodName = (string: string): boolean => {
  for (const period of TIME_PERIODS) {
    if (string.startsWith(period)) {
      return true;
    }
  }
  return false;
};

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
