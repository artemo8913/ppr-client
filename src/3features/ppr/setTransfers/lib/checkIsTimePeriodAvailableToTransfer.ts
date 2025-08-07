import { Month, TimePeriod } from "@/1shared/lib/date";
import { TMonthPprStatus } from "@/2entities/ppr";

export function checkIsTimePeriodAvailableToTransfer(
  timePeriod: TimePeriod,
  monthsStatuses: { [month in Month]: TMonthPprStatus }
): boolean {
  if (timePeriod === "year") {
    return false;
  }
  if (monthsStatuses[timePeriod] === "none") {
    return true;
  }
  return false;
}
