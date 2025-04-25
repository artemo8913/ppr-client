export type { TMonth, TQuartalNumber, TTimePeriod } from "./model/date.types";
export { MONTHS, TIME_PERIODS } from "./model/date.const";
export { getMonthsByQuartal, getQuartal, getTimePeriodFromString } from "./lib/getTimePeriod";
export { translateRuTimePeriod } from "./lib/locale";
