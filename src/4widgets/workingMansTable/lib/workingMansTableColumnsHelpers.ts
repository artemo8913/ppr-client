import { TTimePeriod } from "@/1shared/lib/date";
import { ITableCellProps } from "@/1shared/ui/table";
import { IWorkingManYearPlan, TAllMonthStatuses, TYearPprStatus } from "@/2entities/ppr";
import { IFactTimePeriods, IPlanNormTimePeriods, IPlanTabelTimePeriods } from "@/2entities/ppr/model/ppr.schema";

export const columnsTitles: { [key in keyof IWorkingManYearPlan | string]?: string } = {
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
  return columnsTitles[field] || findPlanFactTitle(field) || "";
}

export function getThStyle(column: keyof IWorkingManYearPlan): React.CSSProperties {
  if (column === "full_name") {
    return { width: "15%" };
  } else if (column === "work_position") {
    return { width: "15%" };
  }
  return {};
}

const allEditableSettings: { [column in keyof IWorkingManYearPlan]?: ITableCellProps } = {
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input" },
  jan_plan_norm_time: { cellType: "input" },
  feb_plan_norm_time: { cellType: "input" },
  mar_plan_norm_time: { cellType: "input" },
  apr_plan_norm_time: { cellType: "input" },
  may_plan_norm_time: { cellType: "input" },
  june_plan_norm_time: { cellType: "input" },
  july_plan_norm_time: { cellType: "input" },
  aug_plan_norm_time: { cellType: "input" },
  sept_plan_norm_time: { cellType: "input" },
  oct_plan_norm_time: { cellType: "input" },
  nov_plan_norm_time: { cellType: "input" },
  dec_plan_norm_time: { cellType: "input" },
  jan_plan_tabel_time: { cellType: "input" },
  feb_plan_tabel_time: { cellType: "input" },
  mar_plan_tabel_time: { cellType: "input" },
  apr_plan_tabel_time: { cellType: "input" },
  may_plan_tabel_time: { cellType: "input" },
  june_plan_tabel_time: { cellType: "input" },
  july_plan_tabel_time: { cellType: "input" },
  aug_plan_tabel_time: { cellType: "input" },
  sept_plan_tabel_time: { cellType: "input" },
  oct_plan_tabel_time: { cellType: "input" },
  nov_plan_tabel_time: { cellType: "input" },
  dec_plan_tabel_time: { cellType: "input" },
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

const getPlanEditableSettings = (
  planNormField: keyof IPlanNormTimePeriods,
  planTabelField: keyof IPlanTabelTimePeriods
): { [column in keyof IWorkingManYearPlan]?: ITableCellProps } => ({
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input" },
  [planNormField]: { cellType: "input" },
  [planTabelField]: { cellType: "input" },
});

const getFactEditableSettings = (
  factField: keyof IFactTimePeriods
): { [column in keyof IWorkingManYearPlan]?: ITableCellProps } => ({
  full_name: { cellType: "textarea" },
  work_position: { cellType: "textarea" },
  participation: { cellType: "input" },
  [factField]: { cellType: "input" },
});

export function getColumnSettings(
  field: keyof IWorkingManYearPlan,
  pprYearStatus: TYearPprStatus,
  timePeriod: TTimePeriod,
  pprMonthStatuses?: TAllMonthStatuses
): ITableCellProps {
  if (pprYearStatus === "plan_creating") {
    return allEditableSettings[field] || {};
  }
  if (timePeriod === "year" || !pprMonthStatuses) {
    return {};
  }

  const planNormField: keyof IPlanNormTimePeriods = `${timePeriod}_plan_norm_time`;
  const planTabelField: keyof IPlanTabelTimePeriods = `${timePeriod}_plan_tabel_time`;
  const factField: keyof IFactTimePeriods = `${timePeriod}_fact_time`;

  const planEditableSettings = getPlanEditableSettings(planNormField, planTabelField);
  const factEditableSettings = getFactEditableSettings(factField);

  if (pprMonthStatuses[timePeriod] === "plan_creating") {
    return planEditableSettings[field] || {};
  }
  if (pprMonthStatuses[timePeriod] === "fact_filling") {
    return factEditableSettings[field] || {};
  }
  return {};
}
