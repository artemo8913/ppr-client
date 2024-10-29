import { MONTHS, TTimePeriod } from "@/1shared/const/date";
import { IPpr, TAllMonthStatuses, TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";

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

export function checkIsTimePeriodAvailableToSelect(
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

export function findFirstUndonePprPeriod(ppr: IPpr | null): TTimePeriod {
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
