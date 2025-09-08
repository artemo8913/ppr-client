import { PlannedWorkWithCorrections, PlannedWorkBranch, MonthPlanStatus, YearPlanStatus } from "../model/ppr.types";
import { PprField } from "../model/service/PprField";

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

const MONTH_STATUS_RU: { [status in MonthPlanStatus]: string } = {
  none: "не запланирован",
  plan_creating: "план создаётся",
  plan_on_agreement_engineer: "план на согласовании инженера ПТО",
  plan_on_agreement_time_norm: "план на согласовании инженера по нормированию труда",
  plan_on_aprove: "план на утверждении",
  in_process: "план в работе",
  fact_filling: "заполнение выполненных работ",
  fact_verification_engineer: "проверка выполненных работ инженером ПТО",
  fact_verification_time_norm: "проверка выполненных работ инженером по нормированию труда",
  fact_on_agreement_sub_boss: "проверка выполненных работ заместителем начальника",
  done: "завершен",
};

const YEAR_STATUS_RU: { [status in YearPlanStatus]: string } = {
  done: "Выполнен",
  in_process: "Выполняется",
  plan_creating: "Создается",
  plan_on_agreement_engineer: "На согласовании инженера ПТО",
  plan_on_agreement_time_norm: "На согласовании инженера по нормированию труда",
  plan_on_agreement_sub_boss: "На согласовании заместителя начальника дистанции",
  plan_on_aprove: "На утверждении",
  template: "Шаблон",
};

export function translateRuPprMonthStatus(status: MonthPlanStatus): string {
  return MONTH_STATUS_RU[status];
}

export function translateRuPprYearStatus(status: YearPlanStatus): string {
  return YEAR_STATUS_RU[status];
}
