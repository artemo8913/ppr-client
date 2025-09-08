import { MONTHS, TimePeriod } from "@/1shared/lib/date";

import { YearPlanBasicData } from "../model/ppr.types";

export function findFirstUndonePprPeriod(ppr: YearPlanBasicData): TimePeriod {
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
