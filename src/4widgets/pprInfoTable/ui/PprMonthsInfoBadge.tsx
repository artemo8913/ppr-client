import { FC } from "react";
import Badge from "antd/es/badge";
import Tooltip from "antd/es/tooltip";
import { TMonth, tymePeriodIntlRu } from "@/1shared/types/date";
import { TMonthPprStatus } from "@/2entities/pprTable";
import { stringToMonthStatusIntlRu } from "@/1shared/providers/pprTableProvider";

interface IPprMonthsInfoBadgeProps {
  month: TMonth;
  monthStatus: TMonthPprStatus;
}

const badgeColorByStatus: { [status in TMonthPprStatus]: string } = {
  none: "grey",
  plan_creating: "yellow",
  plan_on_agreement_engineer: "cyan",
  plan_on_agreement_time_norm: "cyan",
  plan_on_aprove: "cyan",
  plan_aproved: "blue",
  in_process: "blue",
  fact_filling: "blue",
  fact_verification_engineer: "purple",
  fact_verification_time_norm: "purple",
  fact_on_agreement_sub_boss: "purple",
  plan_on_correction: "red",
  done: "green",
};

export const PprMonthsInfoBadge: FC<IPprMonthsInfoBadgeProps> = ({ month, monthStatus }) => {
  return (
    <Tooltip className="cursor-default" key={month} title={stringToMonthStatusIntlRu(monthStatus)}>
      <div className="flex min-w-3 flex-col justify-center items-center">
        <span>{tymePeriodIntlRu[month][0]}</span>
        <Badge key={month} color={badgeColorByStatus[monthStatus]} />
      </div>
    </Tooltip>
  );
};
