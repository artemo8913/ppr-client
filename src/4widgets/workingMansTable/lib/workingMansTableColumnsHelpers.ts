import { TTimePeriod } from "@/1shared/const/date";
import { ITableCellProps } from "@/1shared/ui/table";
import {
  getFactTimeFieldByTimePeriod,
  getPlanNormTimeFieldByTimePeriod,
  getPlanTabelTimeFieldByTimePeriod,
  IWorkingManYearPlan,
  TAllMonthStatuses,
  TYearPprStatus,
} from "@/2entities/ppr";
import { TFactTimePeriodsFields, TPlanNormTimePeriodsFields, TPlanTabelTimePeriodsFields } from "@/2entities/ppr";

const WORKING_MAN_TABLE_FIELDS_TITLES_RU: { [key in keyof IWorkingManYearPlan | string]?: string } = {
  full_name: "Фамилия, имя, отчество",
  work_position: "Должность, профессия, разряд рабочих, совмещаемые профессии",
  participation: "Доля участия",
};

function findPlanFactTitle(string: string) {
  if (string.endsWith("plan_norm_time")) {
    return "по норме, чел.-ч";
  } else if (string.endsWith("plan_tabel_time")) {
    return "по табелю, чел.-ч";
  } else if (string.endsWith("plan_time")) {
    return "план, чел.-ч";
  } else if (string.endsWith("fact_time")) {
    return "факт, чел.-ч";
  }
}

export function getColumnTitle(field: string) {
  return WORKING_MAN_TABLE_FIELDS_TITLES_RU[field] || findPlanFactTitle(field) || "";
}

export function getThStyle(column: keyof IWorkingManYearPlan): React.CSSProperties {
  if (column === "full_name") {
    return { width: "15%" };
  } else if (column === "work_position") {
    return { width: "15%" };
  }
  return {};
}

const ALL_EDITABLE_SETTINGS: { [column in keyof IWorkingManYearPlan]?: ITableCellProps } = {
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input", type: "number" },
  jan_plan_norm_time: { cellType: "input", type: "number" },
  feb_plan_norm_time: { cellType: "input", type: "number" },
  mar_plan_norm_time: { cellType: "input", type: "number" },
  apr_plan_norm_time: { cellType: "input", type: "number" },
  may_plan_norm_time: { cellType: "input", type: "number" },
  june_plan_norm_time: { cellType: "input", type: "number" },
  july_plan_norm_time: { cellType: "input", type: "number" },
  aug_plan_norm_time: { cellType: "input", type: "number" },
  sept_plan_norm_time: { cellType: "input", type: "number" },
  oct_plan_norm_time: { cellType: "input", type: "number" },
  nov_plan_norm_time: { cellType: "input", type: "number" },
  dec_plan_norm_time: { cellType: "input", type: "number" },
  jan_plan_tabel_time: { cellType: "input", type: "number" },
  feb_plan_tabel_time: { cellType: "input", type: "number" },
  mar_plan_tabel_time: { cellType: "input", type: "number" },
  apr_plan_tabel_time: { cellType: "input", type: "number" },
  may_plan_tabel_time: { cellType: "input", type: "number" },
  june_plan_tabel_time: { cellType: "input", type: "number" },
  july_plan_tabel_time: { cellType: "input", type: "number" },
  aug_plan_tabel_time: { cellType: "input", type: "number" },
  sept_plan_tabel_time: { cellType: "input", type: "number" },
  oct_plan_tabel_time: { cellType: "input", type: "number" },
  nov_plan_tabel_time: { cellType: "input", type: "number" },
  dec_plan_tabel_time: { cellType: "input", type: "number" },
  jan_fact_time: { cellType: "input", type: "number" },
  feb_fact_time: { cellType: "input", type: "number" },
  mar_fact_time: { cellType: "input", type: "number" },
  apr_fact_time: { cellType: "input", type: "number" },
  may_fact_time: { cellType: "input", type: "number" },
  june_fact_time: { cellType: "input", type: "number" },
  july_fact_time: { cellType: "input", type: "number" },
  aug_fact_time: { cellType: "input", type: "number" },
  sept_fact_time: { cellType: "input", type: "number" },
  oct_fact_time: { cellType: "input", type: "number" },
  nov_fact_time: { cellType: "input", type: "number" },
  dec_fact_time: { cellType: "input", type: "number" },
};

const getPlanEditableSettings = (
  planNormField: keyof TPlanNormTimePeriodsFields,
  planTabelField: keyof TPlanTabelTimePeriodsFields
): { [column in keyof IWorkingManYearPlan]?: ITableCellProps } => ({
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input", type: "number" },
  [planNormField]: { cellType: "input", type: "number" },
  [planTabelField]: { cellType: "input", type: "number" },
});

const getFactEditableSettings = (
  factField: keyof TFactTimePeriodsFields
): { [column in keyof IWorkingManYearPlan]?: ITableCellProps } => ({
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input", type: "number" },
  [factField]: { cellType: "input", type: "number" },
});

export function getColumnSettings(
  field: keyof IWorkingManYearPlan,
  pprYearStatus: TYearPprStatus,
  timePeriod: TTimePeriod,
  pprMonthStatuses?: TAllMonthStatuses
): ITableCellProps {
  if (pprYearStatus === "plan_creating") {
    return ALL_EDITABLE_SETTINGS[field] || {};
  }
  if (timePeriod === "year" || !pprMonthStatuses) {
    return {};
  }

  const planNormField = getPlanNormTimeFieldByTimePeriod(timePeriod);
  const planTabelField = getPlanTabelTimeFieldByTimePeriod(timePeriod);
  const factTimeField = getFactTimeFieldByTimePeriod(timePeriod);

  if (pprMonthStatuses[timePeriod] === "plan_creating") {
    return getPlanEditableSettings(planNormField, planTabelField)[field] || {};
  }
  if (pprMonthStatuses[timePeriod] === "fact_filling") {
    return getFactEditableSettings(factTimeField)[field] || {};
  }
  return {};
}
