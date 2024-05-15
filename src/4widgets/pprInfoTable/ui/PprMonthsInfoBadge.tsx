import { FC } from "react";
import Badge from "antd/es/badge";
import Tooltip from "antd/es/tooltip";
import { TMonth, monthsIntlRu } from "@/1shared/types/date";
import { TMonthPprStatus } from "@/2entities/pprTable";

interface IPprMonthsInfoBadgeProps {
  month: TMonth;
  monthStatus: TMonthPprStatus;
}

export const PprMonthsInfoBadge: FC<IPprMonthsInfoBadgeProps> = ({ month, monthStatus }) => {
  return (
    <Tooltip
      className="cursor-default"
      key={month}
      title={
        monthStatus === "none"
          ? "не запланирован"
          : monthStatus === "plan_creating"
          ? "план создаётся"
          : monthStatus === "plan_on_agreement_engineer"
          ? "на согласовании инженера"
          : monthStatus === "plan_on_agreement_time_norm"
          ? "на согласовании нормировщика труда"
          : monthStatus === "plan_on_correction"
          ? "на исправлении"
          : monthStatus === "plan_on_aprove"
          ? "на утверждении"
          : monthStatus === "plan_aproved"
          ? "план утвержден"
          : monthStatus === "in_process"
          ? "план в работе"
          : monthStatus === "fact_filling"
          ? "заполнение выполненных работ"
          : monthStatus === "fact_verification_engineer"
          ? "проверка объемов выполненных работ"
          : monthStatus === "fact_verification_time_norm"
          ? "проверка соответствия нормам времени"
          : monthStatus === "fact_on_agreement_sub_boss"
          ? "проверка выполненных работ"
          : monthStatus === "done"
          ? "завершен"
          : ""
      }
    >
      <div className="flex min-w-3 flex-col justify-center items-center">
        <span>{monthsIntlRu[month][0]}</span>
        <Badge
          key={month}
          color={
            monthStatus === "plan_creating"
              ? "yellow"
              : monthStatus === "plan_on_agreement_engineer" ||
                monthStatus === "plan_on_agreement_time_norm" ||
                monthStatus === "plan_on_aprove"
              ? "cyan"
              : monthStatus === "plan_aproved" || monthStatus === "in_process" || monthStatus === "fact_filling"
              ? "blue"
              : monthStatus === "fact_verification_engineer" ||
                monthStatus === "fact_verification_time_norm" ||
                monthStatus === "fact_on_agreement_sub_boss"
              ? "purple"
              : monthStatus === "plan_on_correction"
              ? "red"
              : monthStatus === "done"
              ? "green"
              : ""
          }
        />
      </div>
    </Tooltip>
  );
};
