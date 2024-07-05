import { setBgColor } from "@/1shared/lib/setBgColor";
import { TTimePeriod, isStringStartsWithTimePeriodName } from "@/1shared/lib/date";
import {
  IPprData,
  TAllMonthStatuses,
  TYearPprStatus,
  planWorkFields,
  factWorkFields,
  factTimeFields,
} from "@/2entities/ppr";
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
  if (isStringStartsWithTimePeriodName(key)) {
    return { backgroundColor: setBgColor(key), verticalAlign: "bottom" };
  }
  return {};
}

export function getColumnSettings(
  field: keyof IPprData,
  pprYearStatus: TYearPprStatus,
  timePeriod: TTimePeriod,
  isHaveWorkId?: boolean,
  pprMonthStatuses?: TAllMonthStatuses,
  pprView?: TCorrectionView
): ITableCellProps | undefined {
  if (pprView === "INITIAL_PLAN" || pprView === "INITIAL_PLAN_WITH_ARROWS") {
    return {};
  }
  if (pprYearStatus === "plan_creating" && !isHaveWorkId) {
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
    };
    planWorkFields.forEach((field) => (settings[field] = { cellType: "input" }));
    factWorkFields.forEach((field) => (settings[field] = { cellType: "input" }));
    factTimeFields.forEach((field) => (settings[field] = { cellType: "input" }));

    return settings[field];
  }
  if (pprYearStatus === "plan_creating" && isHaveWorkId) {
    const settings: { [key in keyof IPprData]?: ITableCellProps } = {
      location: { cellType: "textarea" },
      line_class: { cellType: "input" },
      total_count: { cellType: "input" },
      entry_year: { cellType: "input" },
      periodicity_normal: { cellType: "input" },
      periodicity_fact: { cellType: "input" },
      last_maintenance_year: { cellType: "input" },
      unity: { cellType: "input" },
    };
    planWorkFields.forEach((field) => (settings[field] = { cellType: "input" }));
    factWorkFields.forEach((field) => (settings[field] = { cellType: "input" }));
    factTimeFields.forEach((field) => (settings[field] = { cellType: "input" }));

    return settings[field];
  }
  if (pprYearStatus !== "in_process" || timePeriod === "year" || !pprMonthStatuses) {
    return {};
  }
  if (pprMonthStatuses[timePeriod] === "plan_creating" && field === `${timePeriod}_plan_work`) {
    return { cellType: "input" };
  }
  if (
    pprMonthStatuses[timePeriod] === "fact_filling" &&
    (field === `${timePeriod}_fact_work` || field === `${timePeriod}_fact_time`)
  ) {
    return { cellType: "input" };
  }
  return {};
}
