import { getCurrentQuartal, getQuartalMonths } from "@/1shared/lib/date";
import { ITableCell } from "@/1shared/ui/table";
import { TPprTimePeriod, pprTimePeriods } from "@/1shared/lib/date";
import { TFilterTimePeriodOption, TFilterPlanFactOption } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData, TAllMonthStatuses, TYearPprStatus, pprTableColumnsSet } from "@/2entities/ppr";

export function findPlanFactTitle(string: string) {
  if (string.endsWith("plan_work")) {
    return "план, кол-во";
  } else if (string.endsWith("fact_work")) {
    return "факт, кол-во";
  } else if (string.endsWith("plan_time")) {
    return "норм. время на плановый объем, чел.-ч";
  } else if (string.endsWith("fact_norm_time")) {
    return "трудозатраты по норме времени, чел.-ч";
  } else if (string.endsWith("fact_time")) {
    return "фактические трудозатраты, чел.-ч";
  }
}

export const columnsDefault: Array<keyof IPprData> = [
  "name",
  "location",
  "line_class",
  "total_count",
  "entry_year",
  "periodicity_normal",
  "periodicity_fact",
  "last_maintenance_year",
  "norm_of_time",
  "norm_of_time_document",
  "measure",
  "unity",
] as const;

export function getTimePeriodsColumns(
  currentTimePeriod?: TPprTimePeriod,
  option?: TFilterTimePeriodOption
): TPprTimePeriod[] {
  switch (option) {
    case "SHOW_ONLY_CURRENT_MONTH":
      return pprTimePeriods.filter((timePeriod) => timePeriod === "year" || timePeriod === currentTimePeriod);
    case "SHOW_CURRENT_QUARTAL":
      const result: TPprTimePeriod[] = ["year"];
      return result.concat(getQuartalMonths(getCurrentQuartal(currentTimePeriod)));
    default:
      return pprTimePeriods;
  }
}

export function getPlanFactColumns(
  pprTimePeriod: TPprTimePeriod,
  option?: TFilterPlanFactOption
): Array<keyof IPprData> {
  switch (option) {
    case "SHOW_ONLY_PLAN":
      return [`${pprTimePeriod}_plan_work`, `${pprTimePeriod}_plan_time`];
    case "SHOW_ONLY_FACT":
      return [`${pprTimePeriod}_fact_work`, `${pprTimePeriod}_fact_norm_time`, `${pprTimePeriod}_fact_time`];
    case "SHOW_ONLY_VALUES":
      return [`${pprTimePeriod}_plan_work`, `${pprTimePeriod}_fact_work`];
    default:
      return [
        `${pprTimePeriod}_plan_work`,
        `${pprTimePeriod}_plan_time`,
        `${pprTimePeriod}_fact_work`,
        `${pprTimePeriod}_fact_norm_time`,
        `${pprTimePeriod}_fact_time`,
      ];
  }
}

const columnsTitles: { [key in keyof IPprData]?: string } = {
  name: "Наименования и условия выполнения технологических операций, испытаний и измерений",
  location: "Наименование места проведения работ / тип оборудования",
  line_class: "Класс участка / вид технического обслуживания и ремонта",
  total_count: "Количество измерителей (всего)",
  entry_year: "Год ввода в эксплуатацию",
  periodicity_normal: "Периодичность выполнения работ (в соответствии с действующими правилами)",
  periodicity_fact: "Периодичность выполнения работ (факт)",
  last_maintenance_year: "Дата последнего выполнения (для работ с периодичностью более 1 года)",
  norm_of_time: "Норма времени на измеритель, чел.-ч",
  norm_of_time_document: "Обоснование нормы времени",
  measure: "Единица измерения",
  unity: "Подразделение / исполнитель",
};

function isColumnName(column: keyof IPprData | string): column is keyof IPprData {
  return pprTableColumnsSet.has(column);
}

export function getColumnTitle(column: keyof IPprData | string): string {
  if (isColumnName(column)) {
    return columnsTitles[column] || "";
  }
  return "";
}

export function getColumnSettings(
  coulumnName: keyof Partial<IPprData> | string,
  pprYearStatus: TYearPprStatus,
  timePeriod: TPprTimePeriod,
  pprMonthStatuses?: TAllMonthStatuses
): ITableCell | undefined {
  if (!isColumnName(coulumnName)) {
    return;
  }
  if (pprYearStatus === "plan_creating") {
    const settings: { [key in keyof IPprData]?: ITableCell } = {
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
    };
    return settings[coulumnName];
  }
  if (pprYearStatus !== "in_process" || timePeriod === "year" || !pprMonthStatuses) {
    return {};
  }
  if (pprMonthStatuses[timePeriod] === "plan_creating" && coulumnName === `${timePeriod}_plan_work`) {
    return { cellType: "input" };
  }
  if (pprMonthStatuses[timePeriod] === "fact_filling" && coulumnName === `${timePeriod}_fact_work`) {
    return { cellType: "input" };
  }
  return {};
}
