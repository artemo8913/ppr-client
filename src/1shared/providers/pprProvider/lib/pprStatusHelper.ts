import { DefaultOptionType } from "antd/es/select";

import { MONTHS, TTimePeriod } from "@/1shared/const/date";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { translateRuMonthStatus, translateRuYearStatus } from "@/1shared/locale/pprStatus";
import { TAllMonthStatuses, TMonthPprStatus, TPprShortInfo, TYearPprStatus } from "@/2entities/ppr";

export function checkIsAllMonthsPprStatusesIsDone(monthsStatuses: TAllMonthStatuses) {
  let result = true;
  MONTHS.forEach((month) => {
    if (monthsStatuses[month] !== "done") {
      result = false;
    }
  });
  return result;
}

export function checkIsTimePeriodAvailableToTransfer(
  timePeriod: TTimePeriod,
  monthsStatuses: TAllMonthStatuses
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
  timePeriod: TTimePeriod,
  yearStatus: TYearPprStatus,
  monthsStatuses: TAllMonthStatuses
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

export function findFirstUndonePprPeriod(ppr: TPprShortInfo | null): TTimePeriod {
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

const NEXT_PPR_YEAR_STATUS: { [key in TYearPprStatus]: TYearPprStatus | null } = {
  template: null,
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_sub_boss",
  plan_on_agreement_sub_boss: "plan_on_aprove",
  plan_on_aprove: "in_process",
  in_process: "done",
  done: null,
};

const NEXT_PPR_MONTH_STATUS: { [key in TMonthPprStatus]: TMonthPprStatus | null } = {
  none: "plan_creating",
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_aprove",
  plan_on_aprove: "in_process",
  in_process: "fact_filling",
  fact_filling: "fact_verification_engineer",
  fact_verification_engineer: "fact_verification_time_norm",
  fact_verification_time_norm: "fact_on_agreement_sub_boss",
  fact_on_agreement_sub_boss: "done",
  done: null,
};

export function getNextPprYearStatus(currentStatus: TYearPprStatus): TYearPprStatus | null {
  return NEXT_PPR_YEAR_STATUS[currentStatus];
}

export function getNextPprMonthStatus(currentStatus: TMonthPprStatus): TMonthPprStatus | null {
  return NEXT_PPR_MONTH_STATUS[currentStatus];
}

export const PPR_YEAR_STATUSES: TYearPprStatus[] = [
  "template",
  "plan_creating",
  "plan_on_agreement_engineer",
  "plan_on_agreement_time_norm",
  "plan_on_agreement_sub_boss",
  "plan_on_aprove",
  "in_process",
  "done",
];

export const PPR_MONTH_STATUSES: TMonthPprStatus[] = [
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

export function getStatusText(pprInfo: TPprShortInfo) {
  const undoneTimePeriod = findFirstUndonePprPeriod(pprInfo);

  if (pprInfo.status !== "in_process" || undoneTimePeriod === "year") {
    return translateRuYearStatus(pprInfo.status);
  }

  return `${translateRuYearStatus(pprInfo.status)}: ${translateRuTimePeriod(
    undoneTimePeriod
  )} (${translateRuMonthStatus(pprInfo.months_statuses[undoneTimePeriod])})`;
}

export const PPR_YEAR_OPTIONS: DefaultOptionType[] = PPR_YEAR_STATUSES.map((status) => ({
  value: status,
  label: translateRuYearStatus(status),
}));
