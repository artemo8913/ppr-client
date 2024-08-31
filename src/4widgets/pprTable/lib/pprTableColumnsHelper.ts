import { IPprData, checkIsPprDataField } from "@/2entities/ppr";

export const FIELDS_NAMES_RU: { [key in keyof IPprData]?: string } = {
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

export function translateRuFieldName(column: keyof IPprData | string): string {
  if (!checkIsPprDataField(column)) {
    return "";
  }
  return FIELDS_NAMES_RU[column] || findPlanFactTitle(column) || "";
}
