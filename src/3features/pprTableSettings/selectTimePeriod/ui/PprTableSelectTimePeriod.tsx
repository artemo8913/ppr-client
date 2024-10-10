"use client";
import Select, { DefaultOptionType } from "antd/es/select";
import { FC, useEffect } from "react";

import { translateRuTimePeriod } from "@/1shared/locale/date";
import { TTimePeriod, TIME_PERIODS } from "@/1shared/lib/date";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { usePpr, findFirstUndonePprPeriod, checkIsTimePeriodAvailableToSelect } from "@/1shared/providers/pprProvider";

type TOption = { value: TTimePeriod } & DefaultOptionType;

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod, setTimePeriod } = usePprTableSettings();

  const options: TOption[] = TIME_PERIODS.map((period) => ({
    value: period,
    label: translateRuTimePeriod(period),
    disabled: ppr !== null ? !checkIsTimePeriodAvailableToSelect(period, ppr.status, ppr.months_statuses) : true,
  }));

  useEffect(() => {
    setTimePeriod(findFirstUndonePprPeriod(ppr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(ppr?.months_statuses)]);

  return (
    <Select<TTimePeriod, TOption>
      className="min-w-24"
      options={options}
      value={currentTimePeriod}
      onChange={setTimePeriod}
    />
  );
};
