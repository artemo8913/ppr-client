import { TIME_PERIODS } from "../model/date.const";
import { Month, QuartalNumber, TimePeriod } from "../model/date.types";

export function getTimePeriodFromString(string: string): TimePeriod | undefined {
  for (const period of TIME_PERIODS) {
    if (string.startsWith(period)) {
      return period;
    }
  }
}

export function getQuartal(month: Month): QuartalNumber {
  if (month === "jan" || month === "feb" || month === "mar") {
    return 1;
  } else if (month === "apr" || month === "may" || month === "june") {
    return 2;
  } else if (month === "july" || month === "aug" || month === "sept") {
    return 3;
  }

  return 4;
}

export function getMonthsByQuartal(quartal: QuartalNumber): Month[] {
  if (quartal === 1) {
    return ["jan", "feb", "mar"];
  } else if (quartal === 2) {
    return ["apr", "may", "june"];
  } else if (quartal === 3) {
    return ["july", "aug", "sept"];
  }

  return ["oct", "nov", "dec"];
}
