import { TIME_PERIODS } from "../const/date";

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
