"use client";
import { FC } from "react";
import { MonthPlanTable } from "./MonthPlanTable";
import { MonthWorkingMansTable } from "./MonthWorkingMansTable";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { getShortNamesForAllDivisions } from "@/1shared/lib/transEnergoDivisions";
import { translateRuTimePeriod } from "@/1shared/lib/date";

interface IMonthPlanProps {}

export const MonthPlan: FC<IMonthPlanProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  if (!ppr) {
    return null;
  }
  const names = getShortNamesForAllDivisions(ppr);
  return (
    <div>
      <p className="float-right">Форма ЭУ-99 0361847. Утверждена ОАО РЖД в 2024 г.</p>
      <p>Дорога {names.directionShortName}</p>
      <p>Предприятие {names.distanceShortName}</p>
      <p>Цех {names.subdivisionShortName}</p>
      <h2 className="text-center font-bold text-xl mb-2">
        ВЕДОМОСТЬ
        <br />
        учета выполнения работ
        <br />
        за {translateRuTimePeriod(currentTimePeriod)} месяц {ppr.year} г.
      </h2>
      <MonthWorkingMansTable />
      <br />
      <MonthPlanTable />
    </div>
  );
};
