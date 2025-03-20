"use client";
import Select, { DefaultOptionType } from "antd/es/select";
import { FC, useEffect } from "react";

import { translateRuTimePeriod } from "@/1shared/lib/date/locale";
import { TTimePeriod, TIME_PERIODS } from "@/1shared/lib/date";
import {
  findFirstUndonePprPeriod,
  translateRuPprMonthStatus,
  translateRuPprYearStatus,
  usePpr,
  usePprTableSettings,
} from "@/2entities/ppr";

type TOption = { value: TTimePeriod } & DefaultOptionType;

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

  const options: TOption[] = TIME_PERIODS.map((period) => ({
    value: period,
    label: `${translateRuTimePeriod(period)} (${
      period !== "year" ? translateRuPprMonthStatus(ppr.months_statuses[period]) : translateRuPprYearStatus(ppr.status)
    })`,
  }));

  return (
    <Select<TTimePeriod, TOption>
      className="min-w-80"
      options={options}
      value={currentTimePeriod}
      onChange={setTimePeriod}
    />
  );
};
