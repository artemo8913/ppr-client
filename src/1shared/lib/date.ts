import { TPprTimePeriod, TMonth } from "../types/date";

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
