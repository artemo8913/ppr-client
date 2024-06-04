import { TPprTimePeriod, months } from "@/1shared/lib/date";
import { IPpr } from "@/2entities/ppr";

export function findPossibleCurrentPprPeriod(ppr: IPpr | null): TPprTimePeriod {
  if (!ppr) {
    return "year";
  }
  const { status, months_statuses } = ppr;
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
