import { IPprData } from "@/1shared/api/pprTable";
import { months, monthsIntlRu } from "@/1shared/types/date";
import { TableCell } from "@/1shared/ui/table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnsDefault: Array<keyof IPprData> = [
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

function findPlanFactTitle(string: string) {
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

export const createDefaultColumns = (): ColumnDef<IPprData, any>[] => {
  const columnHelper = createColumnHelper<IPprData>();
  return [
    ...columnsDefault.map((column) => {
      return columnHelper.accessor(column, {
        header: (info) => (
          <div className="[writing-mode:vertical-rl] rotate-180 max-h-[200px]">
            {columnsTitles[info.header.id as keyof IPprData]}
          </div>
        ),
      });
    }),
    ...months.map((month) => {
      return columnHelper.group({
        header: monthsIntlRu[month],
        columns: [
          columnHelper.accessor(`${month}_plan_work`, {
            header: (info) => (
              <div className="[writing-mode:vertical-rl] rotate-180">{findPlanFactTitle(info.header.id)}</div>
            ),
            cell: (info)=><TableCell cellType="input" isVertical value={info.getValue()}/>
          }),
          columnHelper.accessor(`${month}_plan_time`, {
            header: (info) => (
              <div className="[writing-mode:vertical-rl] rotate-180">{findPlanFactTitle(info.header.id)}</div>
            ),
          }),
          columnHelper.accessor(`${month}_fact_work`, {
            header: (info) => (
              <div className="[writing-mode:vertical-rl] rotate-180">{findPlanFactTitle(info.header.id)}</div>
            ),
          }),
          columnHelper.accessor(`${month}_fact_norm_time`, {
            header: (info) => (
              <div className="[writing-mode:vertical-rl] rotate-180">{findPlanFactTitle(info.header.id)}</div>
            ),
          }),
          columnHelper.accessor(`${month}_fact_time`, {
            header: (info) => (
              <div className="[writing-mode:vertical-rl] rotate-180">{findPlanFactTitle(info.header.id)}</div>
            ),
          }),
        ],
      });
    }),
  ];
};
