import { TPprTimePeriod, months } from "@/1shared/types/date";
import { TAllMonthStatuses, TYearPprStatus } from "@/2entities/pprTable";

interface IFindCurrentPprPeriodArgs {
  status: TYearPprStatus;
  months_statuses: TAllMonthStatuses;
}

export function findPossibleCurrentPprPeriod({ status, months_statuses }: IFindCurrentPprPeriodArgs): TPprTimePeriod {
  if (status !== "in_process") {
    return "year";
  }
  for (const month of months) {
    if (months_statuses[month] !== "done") {
      return month;
    }
  }
  return "year";
}
