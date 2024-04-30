import { getCurrentQuartal, getQuartalMonths } from "@/1shared/lib/date";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TFilterMonthsOption, TFilterPlanFactOption } from "@/1shared/providers/pprTableProvider";
import { TMonths, TPprTimePeriod, pprTimePeriods } from "@/1shared/types/date";
import { ITableCell } from "@/1shared/ui/table";
import { IHandlePprData, IPprData, TYearPprStatus } from "@/2entities/pprTable";

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

export function getTimePeriodsColumns(currentMonth?: TMonths, option?: TFilterMonthsOption): TPprTimePeriod[] {
  switch (option) {
    case "SHOW_ONLY_CURRENT_MONTH":
      return pprTimePeriods.filter((timePeriod) => timePeriod === "year" || timePeriod === currentMonth);
    case "SHOW_CURRENT_QUARTAL":
      return getQuartalMonths(getCurrentQuartal(currentMonth));
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

export const columnsTitles: { [key in keyof IPprData]?: string } = {
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
  return { backgroundColor: setBgColor(key) };
}

export function getColumnSettings(
  status: TYearPprStatus,
  month?: TPprTimePeriod
): { [name in keyof IPprData]?: ITableCell } {
  if (status === "plan_creating") {
    return {
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
    };
  } else if (status === "in_process" && month) {
    return {
      [`${month}_fact_work`]: { type: "input" },
      [`${month}_fact_time`]: { type: "input" },
    };
  }
  return {};
}

export function findPlanFactTitle(string: string) {
  if (string.endsWith("work")) {
    return "кол-во";
  } else if (string.endsWith("plan_time")) {
    return "норм. время на плановый объем, чел.-ч";
  } else if (string.endsWith("fact_norm_time")) {
    return "трудозатраты по норме времени, чел.-ч";
  } else if (string.endsWith("fact_time")) {
    return "фактические трудозатраты, чел.-ч";
  }
}

export function handlePprData(data: IPprData[]): IHandlePprData[] {
  let name: string;
  let id: string;
  let firstIndex: number;
  let lastIndex: number;

  function clearTempData(datum: IPprData, index: number) {
    id = datum.id;
    name = datum.name;
    firstIndex = index;
    lastIndex = index;
  }

  const rowSpanData: { [id: string]: number | undefined } = {};

  data.forEach((datum, index, arr) => {
    if (index === 0) {
      clearTempData(datum, index);
      return;
    }
    lastIndex = index;
    const diff = lastIndex - firstIndex;
    if (name !== datum.name) {
      if (diff > 1) {
        rowSpanData[id] = diff;
      }
      clearTempData(datum, index);
      return;
    }
    if (arr.length - 1 === index && diff >= 1) {
      rowSpanData[id] = diff + 1;
    }
  });

  return data.map((datum) => {
    return { ...datum, rowSpan: rowSpanData[datum.id] };
  });
}
