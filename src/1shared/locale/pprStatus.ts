import { TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";

const MONTH_STATUS_RU: { [status in TMonthPprStatus]: string } = {
  none: "не запланирован",
  plan_creating: "план создаётся",
  plan_on_agreement_engineer: "на согласовании инженера",
  plan_on_agreement_time_norm: "на согласовании нормировщика труда",
  plan_on_aprove: "на утверждении",
  in_process: "план в работе",
  fact_filling: "заполнение выполненных работ",
  fact_verification_engineer: "проверка объемов выполненных работ",
  fact_verification_time_norm: "проверка соответствия нормам времени",
  fact_on_agreement_sub_boss: "проверка выполненных работ",
  done: "завершен",
};

const YEAR_STATUS_RU: { [status in TYearPprStatus]: string } = {
  done: "Выполнен",
  in_process: "Выполняется",
  plan_creating: "Создается",
  plan_on_agreement_engineer: "На согласовании отраслевого инженера",
  plan_on_agreement_sub_boss: "На согласовании отраслевого заместителя дистанции",
  plan_on_agreement_time_norm: "На согласовании инженера по нормированию труда",
  plan_on_aprove: "На утверждении",
  template: "Шаблон",
};

export function translateRuMonthStatus(status: TMonthPprStatus): string {
  return MONTH_STATUS_RU[status];
}

export function translateRuYearStatus(status: TYearPprStatus): string {
  return YEAR_STATUS_RU[status];
}
