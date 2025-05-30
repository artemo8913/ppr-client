import { FC } from "react";
import Badge from "antd/es/badge";
import Tooltip from "antd/es/tooltip";

import { Month, translateRuTimePeriod } from "@/1shared/lib/date";
import { TMonthPprStatus, translateRuPprMonthStatus } from "@/2entities/ppr";

interface IPprMonthsInfoBadgeProps {
  month: Month;
  monthStatus: TMonthPprStatus;
}

const badgeColorByStatus: { [status in TMonthPprStatus]: string } = {
  none: "grey",
  plan_creating: "yellow",
  plan_on_agreement_engineer: "cyan",
  plan_on_agreement_time_norm: "cyan",
  plan_on_aprove: "cyan",
  in_process: "blue",
  fact_filling: "blue",
  fact_verification_engineer: "purple",
  fact_verification_time_norm: "purple",
  fact_on_agreement_sub_boss: "purple",
  done: "green",
};

const FIRST_LETTER_INDEX = 0;

export const PprMonthsInfoBadge: FC<IPprMonthsInfoBadgeProps> = ({ month, monthStatus }) => {
  return (
    <Tooltip className="cursor-default" key={month} title={translateRuPprMonthStatus(monthStatus)}>
      <div className="flex min-w-3 flex-col justify-center items-center">
        <span>{translateRuTimePeriod(month)[FIRST_LETTER_INDEX]}</span>
        <Badge key={month} color={badgeColorByStatus[monthStatus]} />
      </div>
    </Tooltip>
  );
};
