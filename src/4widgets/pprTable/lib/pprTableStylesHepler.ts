import { getCurrentQuartal, getQuartalMonths } from "@/1shared/lib/date";
import { ITableCell } from "@/1shared/ui/table";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TPprTimePeriod, pprTimePeriods } from "@/1shared/types/date";
import { TFilterTimePeriodOption, TFilterPlanFactOption } from "@/1shared/providers/pprTableProvider";
import { IHandlePprData, IPprData, TAllMonthStatuses, TMonthPprStatus, TYearPprStatus } from "@/2entities/pprTable";

export function getThStyle(key: keyof IPprData): React.CSSProperties {
  switch (key) {
    case "name":
      return { width: "10%" };
    case "location":
      return { width: "5%" };
    case "line_class":
      return { width: "2%" };
    case "total_count":
      return { width: "3%" };
    case "entry_year":
      return { width: "2%" };
    case "periodicity_normal":
      return { width: "2%" };
    case "periodicity_fact":
      return { width: "3%" };
    case "last_maintenance_year":
      return { width: "3%" };
    case "norm_of_time":
      return { width: "3%" };
    case "norm_of_time_document":
      return { width: "3%" };
    case "measure":
      return { width: "2%" };
    case "unity":
      return { width: "3%" };
    default:
      return {};
  }
}

export function getTdStyle(key: keyof IPprData): React.CSSProperties {
  if (key === "norm_of_time_document") {
    return { fontSize: "0.7vw" };
  }
  return { backgroundColor: setBgColor(key) };
}
