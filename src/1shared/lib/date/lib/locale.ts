import { TimePeriod } from "../model/date.types";

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

export const translateRuTimePeriod = (timePeriod: TimePeriod): string => {
  return TIME_PERIOD_RU[timePeriod];
};
