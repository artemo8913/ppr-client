"use client";
import Select from "antd/es/select";
import { FC, useEffect, useMemo } from "react";
import { TTimePeriod, stringToTimePeriodIntlRu, timePeriods } from "@/1shared/lib/date";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { usePpr, findPossibleCurrentPprPeriod } from "@/1shared/providers/pprProvider";

interface IPprTableSelectTimePeriodProps {}

export const PprTableSelectTimePeriod: FC<IPprTableSelectTimePeriodProps> = () => {
  const { currentTimePeriod, setTimePeriod } = usePprTableSettings();
  const { ppr } = usePpr();

  useEffect(() => {
    setTimePeriod(findPossibleCurrentPprPeriod(ppr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(ppr?.months_statuses)]);

  const options = useMemo(
    () => timePeriods.map((period) => ({ value: period, label: stringToTimePeriodIntlRu(period) })),
    []
  );

  return (
    <Select<TTimePeriod> className="min-w-24" options={options} value={currentTimePeriod} onChange={setTimePeriod} />
  );
};
