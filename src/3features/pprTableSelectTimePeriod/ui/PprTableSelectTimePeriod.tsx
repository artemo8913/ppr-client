"use client";
import Select from "antd/es/select";
import { FC } from "react";
import { TPprTimePeriod, monthsIntlRu, pprTimePeriods } from "@/1shared/types/date";
import { usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { currentTimePeriod, setTimePeriod } = usePprTableViewSettings();
  
  return (
    <Select<TPprTimePeriod>
      className="min-w-24"
      options={pprTimePeriods.map((period) => ({ value: period, label: monthsIntlRu[period] }))}
      value={currentTimePeriod}
      onChange={setTimePeriod}
    />
  );
};
