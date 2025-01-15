import { TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";

const MONTH_STATUS_RU: { [status in TMonthPprStatus]: string } = {
  none: "не запланирован",
  plan_creating: "план создаётся",
  plan_on_agreement_engineer: "на согласовании инженера ПТО",
  plan_on_agreement_time_norm: "на согласовании инженера по нормированию труда",
  plan_on_aprove: "на утверждении",
  in_process: "план в работе",
  fact_filling: "заполнение выполненных работ",
  fact_verification_engineer: "проверка выполненных работ инженером ПТО",
  fact_verification_time_norm: "проверка выполненных работ инженером по нормированию труда",
  fact_on_agreement_sub_boss: "проверка выполненных работ заместителем начальника",
  done: "завершен",
};

const YEAR_STATUS_RU: { [status in TYearPprStatus]: string } = {
  done: "Выполнен",
  in_process: "Выполняется",
  plan_creating: "Создается",
  plan_on_agreement_engineer: "На огласовании инженера ПТО",
  plan_on_agreement_sub_boss: "На согласовании заместителя начальника дистанции",
  plan_on_agreement_time_norm: "На согласовании инженера по нормированию труда",
  plan_on_aprove: "На утверждении заместителем начальника",
  template: "Шаблон",
};

export function translateRuMonthStatus(status: TMonthPprStatus): string {
  return MONTH_STATUS_RU[status];
}

export function translateRuYearStatus(status: TYearPprStatus): string {
  return YEAR_STATUS_RU[status];
}
