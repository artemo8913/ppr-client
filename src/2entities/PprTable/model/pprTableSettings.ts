import { ITableColumn } from "@/1shared/ui/Table/model/tableSchema";
import { IPprData } from "./ppr.schema";
import { TMonths } from "@/1shared/types/date";
import { setQuartaerBgColor } from "../lib/setBgColor";

const fullWorkAndTimeDataList = (mounth: TMonths): ITableColumn<IPprData>[] => [
  {
    isTdVertical: true,
    isThVertical: true,
    name: `${mounth}_plan_work`,
    cell: { cellType: "input", style: { backgroundColor: setQuartaerBgColor(mounth) } },
    titleText: "кол-во",
  },
  {
    isTdVertical: true,
    isThVertical: true,
    name: `${mounth}_plan_time`,
    cell: { style: { backgroundColor: setQuartaerBgColor(mounth) } },
    titleText: "норм. время на плановый объем, чел.-ч",
  },
  {
    isTdVertical: true,
    isThVertical: true,
    name: `${mounth}_fact_work`,
    cell: { style: { backgroundColor: setQuartaerBgColor(mounth, true) } },
    titleText: "кол-во",
  },
  {
    isTdVertical: true,
    isThVertical: true,
    name: `${mounth}_fact_norm_time`,
    cell: { style: { backgroundColor: setQuartaerBgColor(mounth, true) } },
    titleText: "трудозатраты по норме времени, чел.-ч",
  },
  {
    isTdVertical: true,
    isThVertical: true,
    name: `${mounth}_fact_time`,
    cell: { style: { backgroundColor: setQuartaerBgColor(mounth, true) } },
    titleText: "фактические трудозатраты, чел.-ч",
  },
];

export const fullColumnsList: ITableColumn<IPprData>[] = [
  {
    name: "section",
    titleText: "Наименования и условия выполнения технологических операций, испытаний и измерений",
    isThVertical: true,
    cell: {
      width: "10%",
      cellType: "textarea",
    },
  },
  {
    name: "subsection_first",
    titleText: "",
    isThVertical: true,
    cell: {
      width: "5%",
    },
  },
  {
    name: "location",
    titleText: "Наименование места проведения работ / тип оборудования",
    isThVertical: true,
    cell: {
      width: "10%",
    },
  },
  {
    name: "line_class",
    titleText: "Класс участка / вид технического обслуживания и ремонта",
    isThVertical: true,
  },
  {
    name: "measure",
    titleText: "Измеритель",
    isThVertical: true,
    cell: {
      width: "2%",
    },
  },
  {
    name: "total_count",
    titleText: "Количество измерителей (всего)",
    isThVertical: true,
    cell: {
      width: "2%",
    },
  },
  {
    name: "entry_year",
    titleText: "Год ввода в эксплуатацию",
    isThVertical: true,
    cell: {
      width: "2%",
    },
  },
  {
    name: "periodicity_normal",
    titleText: "Периодичность выполнения работ (в соответствии с действующими правилами)",
    isThVertical: true,
    cell: {
      width: "2%",
    },
  },
  {
    name: "periodicity_fact",
    titleText: "Периодичность выполнения работ (факт)",
    isThVertical: true,
    cell: {
      width: "2%",
    },
  },
  {
    name: "last_maintenance_year",
    titleText: "Дата последнего выполнения (для работ с периодичностью более 1 года)",
    isThVertical: true,
    cell: {
      width: "2%",
    },
  },
  {
    name: "norm_of_time",
    titleText: "Норма времени на измеритель, чел.-ч",
    isThVertical: true,
    cell: {
      width: "3%",
    },
  },
  {
    name: "norm_of_time_document",
    titleText: "Обоснование нормы времени",
    isThVertical: true,
    cell: {
      width: "3%",
      style: { fontSize: "0.5vw" },
    },
  },
  {
    name: "unity",
    titleText: "Подразделение / исполнитель",
    isThVertical: true,
    cell: {
      width: "3%",
    },
  },
  { name: "year", titleText: "Всего за год", subColumns: fullWorkAndTimeDataList("year") },
  {
    name: "jan",
    titleText: "Январь",
    subColumns: fullWorkAndTimeDataList("jan"),
  },
  {
    name: "feb",
    titleText: "Февраль",
    subColumns: fullWorkAndTimeDataList("feb"),
  },
  {
    name: "mar",
    titleText: "Март",
    subColumns: fullWorkAndTimeDataList("mar"),
  },
  { name: "apr", titleText: "Апрель", subColumns: fullWorkAndTimeDataList("apr") },
  { name: "may", titleText: "Май", subColumns: fullWorkAndTimeDataList("may") },
  { name: "june", titleText: "Июнь", subColumns: fullWorkAndTimeDataList("june") },
  { name: "july", titleText: "Июль", subColumns: fullWorkAndTimeDataList("july") },
  { name: "aug", titleText: "Август", subColumns: fullWorkAndTimeDataList("aug") },
  { name: "sept", titleText: "Сентябрь", subColumns: fullWorkAndTimeDataList("sept") },
  { name: "oct", titleText: "Октябрь", subColumns: fullWorkAndTimeDataList("oct") },
  { name: "nov", titleText: "Ноябрь", subColumns: fullWorkAndTimeDataList("nov") },
  { name: "dec", titleText: "Декабрь", subColumns: fullWorkAndTimeDataList("dec") },
];

// *****************************************************************************************************************************
//перенести всё, что связано с состоянием UI или данных в redux! здесь оставить общие настройки (темы и т.д.)
//в заголовок перенести настройки, связанные с заголовком таблицы (title)??? с другой стороны, здесь хранятся настройки для vText
//vText - создать массив, в котором будут перечисленны столбы для которых текст будет вертикальным
const settings = {
  cellSize: {
    small: { width: "30px", height: "50px" },
  },
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em",
  },
  hiddenPprColumns: {
    none: [],
    planning: ["fact_work", "fact_norm_time", "fact_time"],
    fulfilling: [],
    only_work: ["plan_time", "fact_norm_time", "fact_time"],
  },
  editablePprColumns: {
    none: [],
    planning: [
      "section",
      "subsection_first",
      "location",
      "line_class",
      "measure",
      "total_count",
      "entry_year",
      "periodicity_normal",
      "last_maintenance_year",
      "periodicity_fact",
      "norm_of_time",
      "norm_of_time_document",
      "unity",
      "plan_work",
    ],
    fulfilling: ["fact_work", "fact_time"],
  },
};
export default settings;
export const pprStatuses = ["none", "template", "creating", "on_agreement", "on_aprove", "fulfilling", "done"];
export const pprHidingColumnsStates = ["none", "planning", "fulfilling", "only_work"];
export const pprEditableCellsStates = ["none", "planning", "fulfilling"];
export const fullMonthsList = [
  "year",
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "june",
  "july",
  "aug",
  "sept",
  "oct",
  "nov",
  "dec",
];
export const fullInfoColumnsList = [
  "section",
  "subsection_first",
  "location",
  "line_class",
  "measure",
  "total_count",
  "entry_year",
  "periodicity_normal",
  "last_maintenance_year",
  "periodicity_fact",
  "norm_of_time",
  "norm_of_time_document",
  "unity",
];
export const fullWorkAndTimeColumnsList = ["plan_work", "plan_time", "fact_work", "fact_norm_time", "fact_time"];
export const databaseColumns = [
  "id",
  "index",
  "work_id",
  "branch",
  "subbranch",
  "section",
  "subsection_first",
  "subsection_second",
  "location",
  "line_class",
  "measure",
  "total_count",
  "entry_year",
  "periodicity_normal",
  "periodicity_fact",
  "last_maintenance_year",
  "norm_of_time",
  "norm_of_time_document",
  "plan_work",
  "plan_time",
  "fact_work",
  "fact_norm_time",
  "fact_time",
];
