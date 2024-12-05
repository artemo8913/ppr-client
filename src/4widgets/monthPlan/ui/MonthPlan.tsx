"use client";
import { FC } from "react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { translateRuTimePeriod } from "@/1shared/locale/date";

import { MonthPlanTable } from "./MonthPlanTable";
import { MonthWorkingMansTable } from "./MonthWorkingMansTable";

interface IMonthPlanProps {}

export const MonthPlan: FC<IMonthPlanProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();

  if (!ppr) {
    return null;
  }

  return (
    <div>
      <p className="float-right text-end">
        Форма ЭУ-99 <span className="border border-black">0361847</span>
        <br />
        Утверждена ОАО РЖД в 2024 г.
      </p>
      <p>Дорога {ppr.directionShortName}</p>
      <p>Предприятие {ppr.distanceShortName}</p>
      <p>Цех {ppr.subdivisionShortName}</p>
      <p className="text-center font-bold m-4">УТВЕРЖДАЮ: _______________________ Д.А.Грицак</p>
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
