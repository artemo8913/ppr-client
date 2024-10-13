import { TTimePeriod } from "@/1shared/lib/date";
import { ITableCellProps } from "@/1shared/ui/table";
import { TCorrectionView } from "@/1shared/providers/pprTableSettingsProvider";
import {
  IPprData,
  TAllMonthStatuses,
  TYearPprStatus,
  PLAN_WORK_FIELDS,
  FACT_WORK_FIELDS,
  FACT_TIME_FIELDS,
  checkIsWorkOrTimeField,
} from "@/2entities/ppr";

const EDITABLE_PLAN_FACT_FIELDS = [...PLAN_WORK_FIELDS, ...FACT_WORK_FIELDS, ...FACT_TIME_FIELDS].filter(
  (field) => !field.startsWith("year")
);

export function getThStyle(key?: keyof IPprData): React.CSSProperties {
  switch (key) {
    case "name":
      return { width: "10%" };
    case "location":
      return { width: "5%" };
    case "periodicity_normal":
      return { width: "2%" };
    case "last_maintenance_year":
      return { width: "2%" };
    case "norm_of_time_document":
      return { width: "6%" };
    case "measure":
      return { width: "6%" };
    default:
      return {};
  }
}

export function checkIsFieldVertical(field: keyof IPprData): boolean {
  return (
    checkIsWorkOrTimeField(field) ||
    field === "total_count" ||
    field === "entry_year" ||
    field === "last_maintenance_year" ||
    field === "periodicity_fact" ||
    field === "periodicity_normal" ||
    field === "line_class" ||
    field === "unity" ||
    field === "norm_of_time"
  );
}

export function getColumnSettings(
  field: keyof IPprData,
  pprYearStatus: TYearPprStatus,
  timePeriod: TTimePeriod,
  isHaveWorkId?: boolean,
  pprMonthStatuses?: TAllMonthStatuses | null,
  pprView?: TCorrectionView,
  isInUserControl?: boolean
): ITableCellProps | undefined {
  if (pprView === "INITIAL_PLAN" || pprView === "INITIAL_PLAN_WITH_ARROWS" || !isInUserControl) {
    return {};
  }
  if (pprYearStatus === "plan_creating" && !isHaveWorkId) {
    const settings: { [key in keyof IPprData]?: ITableCellProps } = {
      name: { cellType: "textarea" },
      location: { cellType: "textarea" },
      line_class: { cellType: "input" },
      measure: { cellType: "textarea" },
      total_count: { cellType: "input" },
      entry_year: { cellType: "input" },
      periodicity_normal: { cellType: "input" },
      periodicity_fact: { cellType: "input" },
      last_maintenance_year: { cellType: "input" },
      norm_of_time: { cellType: "input" },
      norm_of_time_document: { cellType: "textarea" },
      unity: { cellType: "input" },
    };
    EDITABLE_PLAN_FACT_FIELDS.forEach((field) => (settings[field] = { cellType: "input" }));

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
    EDITABLE_PLAN_FACT_FIELDS.forEach((field) => (settings[field] = { cellType: "input" }));

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
