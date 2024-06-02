import { months } from "@/1shared/lib/date";
import { TAllMonthStatuses, TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";

export function isAllMonthsPprStatusesIsDone(monthsStatuses: TAllMonthStatuses) {
  let result = true;
  months.forEach((month) => {
    if (monthsStatuses[month] !== "done") {
      result = false;
    }
  });
  return result;
}

const nextPprYearStatus: { [key in TYearPprStatus]?: TYearPprStatus | undefined } = {
  template: undefined,
  plan_on_correction: "plan_creating",
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_security_engineer",
  plan_on_agreement_security_engineer: "plan_on_agreement_sub_boss",
  plan_on_agreement_sub_boss: "plan_on_aprove",
  plan_on_aprove: "plan_aproved",
  plan_aproved: "in_process",
  in_process: "done",
  done: undefined,
};

const nextPprMonthStatus: { [key in TMonthPprStatus]?: TMonthPprStatus | undefined } = {
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

export function getNextPprYearStatus(currentStatus: TYearPprStatus): TYearPprStatus | undefined {
  return nextPprYearStatus[currentStatus];
}

export function getNextPprMonthStatus(currentStatus: TMonthPprStatus): TMonthPprStatus | undefined {
  return nextPprMonthStatus[currentStatus];
}

const monthStatusIntlRu: { [status in TMonthPprStatus]: string } = {
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

export function stringToMonthStatusIntlRu(status: TMonthPprStatus): string {
  return monthStatusIntlRu[status];
}
