//перенести всё, что связано с состоянием UI или данных в redux! здесь оставить общие настройки (темы и т.д.)
//в заголовок перенести настройки, связанные с заголовком таблицы (title)??? с другой стороны, здесь хранятся настройки для vText
//vText - создать массив, в котором будут перечисленны столбы для которых текст будет вертикальным
const settings: any = {
  colors: {
    firstQuarter: "rgba(0,26,255,0.5)",
    secondQuarter: "rgba(1,129,16,0.5)",
    thirdQuarter: "rgba(6,180,154,0.5)",
    fourthQuarter: "rgba(255,132,0,0.5)",
    firstQuarterTransparent: "rgba(0,26,255,0.2)",
    secondQuarterTransparent: "rgba(1,129,16,0.2)",
    thirdQuarterTransparent: "rgba(6,180,154,0.2)",
    fourthQuarterTransparent: "rgba(255,132,0,0.2)",
  },
  cellSize: {
    small: { width: "30px", height: "50px" },
  },
  fonts: ["sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em",
  },
  hiddenPprColumns: {
    none: [],
    planning: ["factWork", "factNormTime", "factTime"],
    fulfilling: [],
    only_work: ["planTime", "factNormTime", "factTime"],
  },
  editablePprColumns: {
    none: [],
    planning: [
      "section",
      "subsection",
      "location",
      "lineClass",
      "meter",
      "totalCount",
      "yearOfLaunch",
      "periodicityNormal",
      "periodicityFact",
      "periodicityLast",
      "normOfTime",
      "normOfTimeDocumentSource",
      "unity",
      "planWork",
    ],
    fulfilling: ["factWork", "factTime"],
  },
  pprColumnSettings: {
    textareaRows: 6,
    textareaCols: 10,
    fullPlanwidthPercent: 30,
    section: {
      title: "Наименования и условия выполнения технологических операций, испытаний и измерений",
      widthPercent: 10,
      titleRowSpan: 4,
      titleColSpan: 2,
    },
    subsection: { title: "" },
    location: { title: "Наименование места проведения работ / тип оборудования", widthPercent: 4, titleRowSpan: 4 },
    lineClass: { title: "Класс участка / вид технического обслуживания и ремонта", widthPercent: 1, titleRowSpan: 4, vText: true },
    meter: { title: "Измеритель", widthPercent: 1, titleRowSpan: 4, vText: true },
    totalCount: { title: "Количество измерителей (всего)", widthPercent: 1, titleRowSpan: 4, vText: true },
    yearOfLaunch: { title: "Год ввода в эксплуатацию", widthPercent: 1, titleRowSpan: 4, vText: true },
    periodicityNormal: {
      title: "Периодичность выполнения работ (в соответствии с действующими правилами)",
      widthPercent: 1,
      titleRowSpan: 4,
      vText: true,
    },
    periodicityFact: { title: "Периодичность выполнения работ (факт)", widthPercent: 1, titleRowSpan: 4, vText: true },
    periodicityLast: {
      title: "Дата последнего выполнения (для работ с периодичностью более 1 года)",
      widthPercent: 1,
      titleRowSpan: 4,
      vText: true,
    },
    normOfTime: { title: "Норма времени на измеритель, чел.-ч", widthPercent: 1, titleRowSpan: 4, vText: true },
    normOfTimeDocumentSource: { title: "Обоснование нормы времени", widthPercent: 2, titleRowSpan: 4 },
    unity: { title: "Подразделение / исполнитель", widthPercent: 1, titleRowSpan: 4, vText: true },
    planWork: { title: "кол-во", vText: true },
    planTime: { title: "норм. время на плановый объем, чел.-ч", vText: true },
    factWork: { title: "кол-во", vText: true },
    factNormTime: { title: "трудозатраты по норме времени, чел.-ч", vText: true },
    factTime: { title: "фактические трудозатраты, чел.-ч", vText: true },
    year: { title: "Всего за год", titleColSpan: 5 },
    jan: { title: "Январь", titleColSpan: 5 },
    feb: { title: "Февраль", titleColSpan: 5 },
    mar: { title: "Март", titleColSpan: 5 },
    apr: { title: "Апрель", titleColSpan: 5 },
    may: { title: "Май", titleColSpan: 5 },
    june: { title: "Июнь", titleColSpan: 5 },
    july: { title: "Июль", titleColSpan: 5 },
    aug: { title: "Август", titleColSpan: 5 },
    sept: { title: "Сентябрь", titleColSpan: 5 },
    oct: { title: "Октябрь", titleColSpan: 5 },
    nov: { title: "Ноябрь", titleColSpan: 5 },
    dec: { title: "Декабрь", titleColSpan: 5 },
  },
};
export default settings;
export const pprStatuses = ["none", "creating", "on_agreement", "on_aprove", "fulfilling", "done"];
export const pprHidingColumnsStates = ["none", "planning", "fulfilling", "only_work"];
export const pprEditableCellsStates = ["none", "planning", "fulfilling"];
export const fullMounthsList = ["year", "jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"];
export const fullInfoColumnsList = [
  "section",
  "subsection",
  "location",
  "lineClass",
  "meter",
  "totalCount",
  "yearOfLaunch",
  "periodicityNormal",
  "periodicityFact",
  "periodicityLast",
  "normOfTime",
  "normOfTimeDocumentSource",
  "unity",
];
export const fullWorkAndTimeColumnsList = ["planWork", "planTime", "factWork", "factNormTime", "factTime"];
