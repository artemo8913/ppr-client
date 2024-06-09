import { setBgColor } from "@/1shared/lib/setBgColor";
import { TPprTimePeriod, isStringStartsWithTimePeriodName } from "@/1shared/lib/date";
import { IPprData, TAllMonthStatuses, TYearPprStatus, checkIsColumnField } from "@/2entities/ppr";
import { ITableCellProps } from "@/1shared/ui/table";
import { TCorrectionView } from "@/1shared/providers/pprTableSettingsProvider";

export function getThStyle(key: keyof IPprData | string): React.CSSProperties {
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

export function getTdStyle(key: keyof IPprData | string): React.CSSProperties {
  if (key === "norm_of_time_document") {
    return { fontSize: "0.7vw" };
  }
  if (isStringStartsWithTimePeriodName(key)) {
    return { backgroundColor: setBgColor(key), verticalAlign: "bottom" };
  }
  return {};
}

export function getColumnSettings(
  coulumnName: keyof Partial<IPprData> | string,
  pprYearStatus: TYearPprStatus,
  timePeriod: TPprTimePeriod,
  pprMonthStatuses?: TAllMonthStatuses,
  pprView?: TCorrectionView
): ITableCellProps | undefined {
  if (!checkIsColumnField(coulumnName)) {
    return;
  }
  if (pprView === "INITIAL_PLAN" || pprView === "INITIAL_PLAN_WITH_ARROWS") {
    return {};
  }
  if (pprYearStatus === "plan_creating") {
    const settings: { [key in keyof IPprData]?: ITableCellProps } = {
      name: { cellType: "textarea" },
      location: { cellType: "textarea" },
      line_class: { cellType: "input" },
      measure: { cellType: "input" },
      total_count: { cellType: "input" },
      entry_year: { cellType: "input" },
      periodicity_normal: { cellType: "input" },
      periodicity_fact: { cellType: "input" },
      last_maintenance_year: { cellType: "input" },
      norm_of_time: { cellType: "input" },
      norm_of_time_document: { cellType: "textarea" },
      unity: { cellType: "input" },
      jan_plan_work: { cellType: "input" },
      feb_plan_work: { cellType: "input" },
      mar_plan_work: { cellType: "input" },
      apr_plan_work: { cellType: "input" },
      may_plan_work: { cellType: "input" },
      june_plan_work: { cellType: "input" },
      july_plan_work: { cellType: "input" },
      aug_plan_work: { cellType: "input" },
      sept_plan_work: { cellType: "input" },
      oct_plan_work: { cellType: "input" },
      nov_plan_work: { cellType: "input" },
      dec_plan_work: { cellType: "input" },
      jan_fact_work: { cellType: "input" },
      feb_fact_work: { cellType: "input" },
      mar_fact_work: { cellType: "input" },
      apr_fact_work: { cellType: "input" },
      may_fact_work: { cellType: "input" },
      june_fact_work: { cellType: "input" },
      july_fact_work: { cellType: "input" },
      aug_fact_work: { cellType: "input" },
      sept_fact_work: { cellType: "input" },
      oct_fact_work: { cellType: "input" },
      nov_fact_work: { cellType: "input" },
      dec_fact_work: { cellType: "input" },
      jan_fact_time: { cellType: "input" },
      feb_fact_time: { cellType: "input" },
      mar_fact_time: { cellType: "input" },
      apr_fact_time: { cellType: "input" },
      may_fact_time: { cellType: "input" },
      june_fact_time: { cellType: "input" },
      july_fact_time: { cellType: "input" },
      aug_fact_time: { cellType: "input" },
      sept_fact_time: { cellType: "input" },
      oct_fact_time: { cellType: "input" },
      nov_fact_time: { cellType: "input" },
      dec_fact_time: { cellType: "input" },
    };
    return settings[coulumnName];
  }
  if (pprYearStatus !== "in_process" || timePeriod === "year" || !pprMonthStatuses) {
    return {};
  }
  if (pprMonthStatuses[timePeriod] === "plan_creating" && coulumnName === `${timePeriod}_plan_work`) {
    return { cellType: "input" };
  }
  if (
    pprMonthStatuses[timePeriod] === "fact_filling" &&
    (coulumnName === `${timePeriod}_fact_work` || coulumnName === `${timePeriod}_fact_time`)
  ) {
    return { cellType: "input" };
  }
  return {};
}
