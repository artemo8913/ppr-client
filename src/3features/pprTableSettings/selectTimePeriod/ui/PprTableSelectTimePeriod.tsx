"use client";
import Select from "antd/es/select";
import { FC, useEffect, useMemo } from "react";
import { TPprTimePeriod, timePeriodIntlRu, pprTimePeriods } from "@/1shared/lib/date";
import { findPossibleCurrentPprPeriod } from "@/1shared/providers/pprProvider/lib/findPossibleCurrentPprPeriod";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { usePpr } from "@/1shared/providers/pprProvider";

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { currentTimePeriod, setTimePeriod } = usePprTableSettings();
  const { ppr } = usePpr();

  useEffect(() => {
    setTimePeriod(findPossibleCurrentPprPeriod(ppr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(ppr?.months_statuses)]);

  const options = useMemo(
    () => pprTimePeriods.map((period) => ({ value: period, label: timePeriodIntlRu[period] })),
    []
  );

  return (
    <Select<TPprTimePeriod> className="min-w-24" options={options} value={currentTimePeriod} onChange={setTimePeriod} />
  );
};
