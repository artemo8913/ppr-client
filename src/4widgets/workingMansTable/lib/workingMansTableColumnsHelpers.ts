import { TimePeriod } from "@/1shared/lib/date";
import { TableCellProps } from "@/1shared/ui/table";
import {
  PprField,
  TYearPprStatus,
  TAllMonthStatuses,
  IWorkingManYearPlan,
  TFactTimePeriodsFields,
  TPlanNormTimePeriodsFields,
  TPlanTabelTimePeriodsFields,
} from "@/2entities/ppr";

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

const ALL_EDITABLE_SETTINGS: { [column in keyof IWorkingManYearPlan]?: TableCellProps } = {
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input", inputType: "number" },
  jan_plan_norm_time: { cellType: "input", inputType: "number" },
  feb_plan_norm_time: { cellType: "input", inputType: "number" },
  mar_plan_norm_time: { cellType: "input", inputType: "number" },
  apr_plan_norm_time: { cellType: "input", inputType: "number" },
  may_plan_norm_time: { cellType: "input", inputType: "number" },
  june_plan_norm_time: { cellType: "input", inputType: "number" },
  july_plan_norm_time: { cellType: "input", inputType: "number" },
  aug_plan_norm_time: { cellType: "input", inputType: "number" },
  sept_plan_norm_time: { cellType: "input", inputType: "number" },
  oct_plan_norm_time: { cellType: "input", inputType: "number" },
  nov_plan_norm_time: { cellType: "input", inputType: "number" },
  dec_plan_norm_time: { cellType: "input", inputType: "number" },
  jan_plan_tabel_time: { cellType: "input", inputType: "number" },
  feb_plan_tabel_time: { cellType: "input", inputType: "number" },
  mar_plan_tabel_time: { cellType: "input", inputType: "number" },
  apr_plan_tabel_time: { cellType: "input", inputType: "number" },
  may_plan_tabel_time: { cellType: "input", inputType: "number" },
  june_plan_tabel_time: { cellType: "input", inputType: "number" },
  july_plan_tabel_time: { cellType: "input", inputType: "number" },
  aug_plan_tabel_time: { cellType: "input", inputType: "number" },
  sept_plan_tabel_time: { cellType: "input", inputType: "number" },
  oct_plan_tabel_time: { cellType: "input", inputType: "number" },
  nov_plan_tabel_time: { cellType: "input", inputType: "number" },
  dec_plan_tabel_time: { cellType: "input", inputType: "number" },
  jan_fact_time: { cellType: "input", inputType: "number" },
  feb_fact_time: { cellType: "input", inputType: "number" },
  mar_fact_time: { cellType: "input", inputType: "number" },
  apr_fact_time: { cellType: "input", inputType: "number" },
  may_fact_time: { cellType: "input", inputType: "number" },
  june_fact_time: { cellType: "input", inputType: "number" },
  july_fact_time: { cellType: "input", inputType: "number" },
  aug_fact_time: { cellType: "input", inputType: "number" },
  sept_fact_time: { cellType: "input", inputType: "number" },
  oct_fact_time: { cellType: "input", inputType: "number" },
  nov_fact_time: { cellType: "input", inputType: "number" },
  dec_fact_time: { cellType: "input", inputType: "number" },
};

const getPlanEditableSettings = (
  planNormField: keyof TPlanNormTimePeriodsFields,
  planTabelField: keyof TPlanTabelTimePeriodsFields
): { [column in keyof IWorkingManYearPlan]?: TableCellProps } => ({
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input", inputType: "number" },
  [planNormField]: { cellType: "input", type: "number" },
  [planTabelField]: { cellType: "input", type: "number" },
});

const getFactEditableSettings = (
  factField: keyof TFactTimePeriodsFields
): { [column in keyof IWorkingManYearPlan]?: TableCellProps } => ({
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input", inputType: "number" },
  [factField]: { cellType: "input", type: "number" },
});

export function getColumnSettings({
  field,
  pprYearStatus,
  timePeriod,
  isPprInUserControl,
  pprMonthStatuses,
}: {
  field: keyof IWorkingManYearPlan;
  pprYearStatus: TYearPprStatus;
  timePeriod: TimePeriod;
  isPprInUserControl?: boolean;
  pprMonthStatuses?: TAllMonthStatuses;
}): TableCellProps {
  if (!isPprInUserControl) {
    return {};
  }
  if (pprYearStatus === "plan_creating") {
    return ALL_EDITABLE_SETTINGS[field] || {};
  }
  if (timePeriod === "year" || !pprMonthStatuses) {
    return {};
  }

  const planNormField = PprField.getPlanNormTimeFieldByTimePeriod(timePeriod);
  const planTabelField = PprField.getPlanTabelTimeFieldByTimePeriod(timePeriod);
  const factTimeField = PprField.getFactTimeFieldByTimePeriod(timePeriod);

  if (pprMonthStatuses[timePeriod] === "plan_creating") {
    return getPlanEditableSettings(planNormField, planTabelField)[field] || {};
  }
  if (pprMonthStatuses[timePeriod] === "fact_filling") {
    return getFactEditableSettings(factTimeField)[field] || {};
  }
  return {};
}
