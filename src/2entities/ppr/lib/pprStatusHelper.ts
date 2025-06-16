import { MONTHS, TimePeriod, translateRuTimePeriod } from "@/1shared/lib/date";

import { translateRuPprMonthStatus, translateRuPprYearStatus } from "./pprStatusLocale";
import { AllMonthStatuses, MonthPprStatus, PprShortInfo, YearPprStatus } from "../model/ppr.types";
import { OptionType } from "@/1shared/lib/form/TOptionType";

export function checkIsAllMonthsPprStatusesIsDone(monthsStatuses: AllMonthStatuses) {
  let result = true;
  MONTHS.forEach((month) => {
    if (monthsStatuses[month] !== "done") {
      result = false;
    }
  });
  return result;
}

export function checkIsTimePeriodAvailableToTransfer(
  timePeriod: TimePeriod,
  monthsStatuses: AllMonthStatuses
): boolean {
  if (timePeriod === "year") {
    return false;
  }
  if (monthsStatuses[timePeriod] === "none") {
    return true;
  }
  return false;
}

export function checkIsTimePeriodAvailableForPlanning(
  timePeriod: TimePeriod,
  yearStatus: YearPprStatus,
  monthsStatuses: AllMonthStatuses
): boolean {
  if (timePeriod === "year") {
    return true;
  } else if (yearStatus !== "in_process" && yearStatus !== "done") {
    return false;
  } else if (timePeriod === "jan" && yearStatus === "in_process") {
    return true;
  }

  const timePeriodIndex = MONTHS.indexOf(timePeriod);
  const prevTimePeriod = MONTHS[timePeriodIndex - 1];

  if (prevTimePeriod in monthsStatuses && monthsStatuses[prevTimePeriod] === "done") {
    return true;
  }

  return false;
}

export function findFirstUndonePprPeriod(ppr: PprShortInfo | null): TimePeriod {
  if (!ppr) {
    return "year";
  }

  const { status, months_statuses } = ppr;

  if (status !== "in_process") {
    return "year";
  }

  for (const month of MONTHS) {
    if (months_statuses[month] !== "done") {
      return month;
    }
  }

  return "year";
}

const NEXT_PPR_YEAR_STATUS: { [key in YearPprStatus]: YearPprStatus | null } = {
  template: null,
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_sub_boss",
  plan_on_agreement_sub_boss: "plan_on_aprove",
  plan_on_aprove: "in_process",
  in_process: "done",
  done: null,
};

const NEXT_PPR_MONTH_STATUS: { [key in MonthPprStatus]: MonthPprStatus | null } = {
  none: "plan_creating",
  plan_creating: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_aprove",
  plan_on_aprove: "in_process",
  in_process: "fact_filling",
  fact_filling: "fact_verification_time_norm",
  fact_verification_time_norm: "fact_verification_engineer",
  fact_verification_engineer: "fact_on_agreement_sub_boss",
  fact_on_agreement_sub_boss: "done",
  done: null,
};

export function getNextPprYearStatus(currentStatus: YearPprStatus): YearPprStatus | null {
  return NEXT_PPR_YEAR_STATUS[currentStatus];
}

export function getNextPprMonthStatus(currentStatus: MonthPprStatus): MonthPprStatus | null {
  return NEXT_PPR_MONTH_STATUS[currentStatus];
}

export const PPR_YEAR_STATUSES: YearPprStatus[] = [
  "template",
  "plan_creating",
  "plan_on_agreement_engineer",
  "plan_on_agreement_time_norm",
  "plan_on_agreement_sub_boss",
  "plan_on_aprove",
  "in_process",
  "done",
];

export const PPR_MONTH_STATUSES: MonthPprStatus[] = [
  "none",
  "plan_creating",
  "plan_on_agreement_engineer",
  "plan_on_agreement_time_norm",
  "plan_on_aprove",
  "in_process",
  "fact_filling",
  "fact_verification_engineer",
  "fact_verification_time_norm",
  "fact_on_agreement_sub_boss",
  "done",
];

export function getStatusText(pprInfo: PprShortInfo) {
  const undoneTimePeriod = findFirstUndonePprPeriod(pprInfo);

  if (pprInfo.status !== "in_process" || undoneTimePeriod === "year") {
    return translateRuPprYearStatus(pprInfo.status);
  }

  return `${translateRuPprYearStatus(pprInfo.status)}: ${translateRuTimePeriod(
    undoneTimePeriod
  )} (${translateRuPprMonthStatus(pprInfo.months_statuses[undoneTimePeriod])})`;
}

export const PPR_YEAR_OPTIONS: OptionType<YearPprStatus>[] = PPR_YEAR_STATUSES.map((status) => ({
  value: status,
  label: translateRuPprYearStatus(status),
}));
