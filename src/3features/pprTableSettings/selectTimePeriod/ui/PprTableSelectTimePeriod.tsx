"use client";
import Select from "antd/es/select";
import { FC, useEffect } from "react";
import { TPprTimePeriod, tymePeriodIntlRu, pprTimePeriods } from "@/1shared/lib/date";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { findPossibleCurrentPprPeriod } from "@/1shared/providers/pprTableProvider/lib/findPossibleCurrentPprPeriod";

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { currentTimePeriod, setTimePeriod } = usePprTableViewSettings();
  const { ppr } = usePprTableData();

  useEffect(() => {
    setTimePeriod(findPossibleCurrentPprPeriod(ppr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(ppr?.months_statuses)]);

  return (
    <Select<TPprTimePeriod>
      className="min-w-24"
      options={pprTimePeriods.map((period) => ({ value: period, label: tymePeriodIntlRu[period] }))}
      value={currentTimePeriod}
      onChange={setTimePeriod}
    />
  );
};
