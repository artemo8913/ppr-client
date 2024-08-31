import { MONTHS, TTimePeriod } from "@/1shared/lib/date";
import { IPpr, TAllMonthStatuses, TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";

export function isAllMonthsPprStatusesIsDone(monthsStatuses: TAllMonthStatuses) {
  let result = true;
  MONTHS.forEach((month) => {
    if (monthsStatuses[month] !== "done") {
      result = false;
    }
  });
  return result;
}


export function findFirstUndonePprPeriod(ppr: IPpr | null): TTimePeriod {
  if (!ppr) {
    return "year";
  }
  const { status, months_statuses } = ppr;
  if (status !== "in_process") {
    return "year";
  }
  for (const month of MONTHS) {
    if (months_statuses[month] !== "done") {
      return month;
    }
  }
  return "year";
}

const NEXT_PPR_YEAR_STATUS: { [key in TYearPprStatus]: TYearPprStatus | null } = {
  template: null,
  plan_on_correction: "plan_creating",
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_security_engineer",
  plan_on_agreement_security_engineer: "plan_on_agreement_sub_boss",
  plan_on_agreement_sub_boss: "plan_on_aprove",
  plan_on_aprove: "plan_aproved",
  plan_aproved: "in_process",
  in_process: "done",
  done: null,
};

const NEXT_PPR_MONTH_STATUS: { [key in TMonthPprStatus]: TMonthPprStatus } = {
  none: "plan_creating",
  plan_on_correction: "plan_creating",
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_aprove",
  plan_on_aprove: "plan_aproved",
  plan_aproved: "in_process",
  in_process: "fact_filling",
  fact_filling: "fact_verification_engineer",
  fact_verification_engineer: "fact_verification_time_norm",
  fact_verification_time_norm: "fact_on_agreement_sub_boss",
  fact_on_agreement_sub_boss: "done",
  done: "plan_on_correction",
};

export function getNextPprYearStatus(currentStatus: TYearPprStatus): TYearPprStatus | null {
  return NEXT_PPR_YEAR_STATUS[currentStatus];
}

export function getNextPprMonthStatus(currentStatus: TMonthPprStatus): TMonthPprStatus {
  return NEXT_PPR_MONTH_STATUS[currentStatus];
}

const MONTH_STATUS_RU: { [status in TMonthPprStatus]: string } = {
  none: "не запланирован",
  plan_creating: "план создаётся",
  plan_on_agreement_engineer: "на согласовании инженера",
  plan_on_agreement_time_norm: "на согласовании нормировщика труда",
  plan_on_correction: "на исправлении",
  plan_on_aprove: "на утверждении",
  plan_aproved: "план утвержден",
  in_process: "план в работе",
  fact_filling: "заполнение выполненных работ",
  fact_verification_engineer: "проверка объемов выполненных работ",
  fact_verification_time_norm: "проверка соответствия нормам времени",
  fact_on_agreement_sub_boss: "проверка выполненных работ",
  done: "завершен",
};

const YEAR_STATUS_RU: { [status in TYearPprStatus]: string } = {
  done: "Выполнен",
  in_process: "В процессе выполнения",
  plan_aproved: "Утвержден",
  plan_creating: "Создается",
  plan_on_agreement_engineer: "На согласовании отраслевого инженера",
  plan_on_agreement_security_engineer: "На согласовании инженера по охране труда",
  plan_on_agreement_sub_boss: "На согласовании отраслевого заместителя",
  plan_on_agreement_time_norm: "На согласовании инженера по нормированию труда",
  plan_on_aprove: "На утверждении",
  plan_on_correction: "На исправлении",
  template: "Шаблон",
};

export function translateRuMonthStatus(status: TMonthPprStatus): string {
  return MONTH_STATUS_RU[status];
}

export function translateRuYearStatus(status: TYearPprStatus): string {
  return YEAR_STATUS_RU[status];
}
