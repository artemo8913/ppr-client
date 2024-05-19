"use client";
import Select from "antd/es/select";
import { FC, useEffect } from "react";
import { TPprTimePeriod, monthsIntlRu, pprTimePeriods } from "@/1shared/types/date";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { findPossibleCurrentPprPeriod } from "@/1shared/providers/pprTableProvider/lib/findPossibleCurrentPprPeriod";

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { currentTimePeriod, setTimePeriod } = usePprTableViewSettings();
  const { pprData } = usePprTableData();

  useEffect(() => {
    setTimePeriod(findPossibleCurrentPprPeriod(pprData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(pprData?.months_statuses)]);

  return (
    <Select<TPprTimePeriod>
      className="min-w-24"
      options={pprTimePeriods.map((period) => ({ value: period, label: monthsIntlRu[period] }))}
      value={currentTimePeriod}
      onChange={setTimePeriod}
    />
  );
};
