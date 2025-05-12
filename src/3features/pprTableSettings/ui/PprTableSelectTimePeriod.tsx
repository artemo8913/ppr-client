"use client";
import Select from "antd/es/select";
import { FC, useEffect } from "react";

import { OptionType } from "@/1shared/lib/form/TOptionType";
import { TimePeriod, TIME_PERIODS, translateRuTimePeriod } from "@/1shared/lib/date";
import {
  findFirstUndonePprPeriod,
  translateRuPprMonthStatus,
  translateRuPprYearStatus,
  usePpr,
  usePprTableSettings,
} from "@/2entities/ppr";

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod, setTimePeriod } = usePprTableSettings();

  useEffect(() => {
    setTimePeriod(findFirstUndonePprPeriod(ppr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(ppr?.months_statuses)]);

  if (!ppr) {
    return null;
  }

  const options: OptionType<TimePeriod>[] = TIME_PERIODS.map((period) => ({
    value: period,
    label: `${translateRuTimePeriod(period)} (${
      period !== "year" ? translateRuPprMonthStatus(ppr.months_statuses[period]) : translateRuPprYearStatus(ppr.status)
    })`,
  }));

  return (
    <Select<TimePeriod, OptionType<TimePeriod>>
      className="min-w-80"
      options={options}
      value={currentTimePeriod}
      onChange={setTimePeriod}
    />
  );
};
