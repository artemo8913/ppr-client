import { PlannedWorkWithCorrections, PlannedWorkBranch } from "../model/ppr.types";
import { PprField } from "../model/PprField";

const PPR_BRANCHES_RU: { [key in PlannedWorkBranch]: string } = {
  additional: "Дополнительные работы",
  exploitation: "Основные (плановые) работы",
  unforeseen: "Непредвиденные работы",
};

export function translateRuPprBranchName(branch: string): string {
  if (branch in PPR_BRANCHES_RU) {
    return PPR_BRANCHES_RU[branch as PlannedWorkBranch];
  }
  return branch;
}

const FIELDS_NAMES_RU: { [key in keyof PlannedWorkWithCorrections]?: string } = {
  name: "Наименования работ",
  location: "Место работ (тип оборудования)",
  line_class: "Класс участка / вид ТОиР",
  total_count: "Количество измерителей (всего)",
  entry_year: "Год ввода в эксплуатацию",
  periodicity_normal: "Периодичность согласно нормативным документам",
  periodicity_fact: "Периодичность (факт)",
  last_maintenance_year: "Дата последнего выполнения",
  norm_of_time: "Норма времени на измеритель, чел.-ч",
  norm_of_time_document: "Обоснование нормы времени",
  measure: "Измеритель",
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

export function translateRuPprFieldName(field: keyof PlannedWorkWithCorrections | string): string {
  if (!PprField.isYearPlanField(field)) {
    return field;
  }
  return FIELDS_NAMES_RU[field] || findPlanFactTitle(field) || "";
}
