import { translateRuTimePeriod } from "@/1shared/lib/date";
import {
  TPprShortInfo,
  findFirstUndonePprPeriod,
  translateRuPprYearStatus,
  translateRuPprMonthStatus,
} from "@/2entities/ppr";

export function getStatusText(pprInfo: TPprShortInfo) {
  const undoneTimePeriod = findFirstUndonePprPeriod(pprInfo);

  if (pprInfo.status !== "in_process" || undoneTimePeriod === "year") {
    return translateRuPprYearStatus(pprInfo.status);
  }

  return `${translateRuPprYearStatus(pprInfo.status)}: ${translateRuTimePeriod(
    undoneTimePeriod
  )} (${translateRuPprMonthStatus(pprInfo.months_statuses[undoneTimePeriod])})`;
}
