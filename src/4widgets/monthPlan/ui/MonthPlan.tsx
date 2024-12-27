"use client";
import { FC } from "react";

import { roundToFixed } from "@/1shared/lib/math";
import { createPprMeta, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { getPlanTimeFieldByTimePeriod, getPlanWorkFieldByTimePeriod } from "@/2entities/ppr";

import { MonthPlanTable } from "./MonthPlanTable";
import { MonthWorkingMansTable } from "./MonthWorkingMansTable";

interface IMonthPlanProps {}

export const MonthPlan: FC<IMonthPlanProps> = () => {
  const { ppr, pprMeta: globalPprMeta } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  if (!ppr) {
    return null;
  }

  const planWorkField = getPlanWorkFieldByTimePeriod(currentTimePeriod);

  const planTimeField = getPlanTimeFieldByTimePeriod(currentTimePeriod);

  const filteredPprData = ppr.data
    .filter((pprData) => {
      const plan = pprData[planWorkField];

      const planValue = plan.handCorrection !== null ? plan.handCorrection : plan.original + plan.outsideCorrectionsSum;

      return Boolean(Number(pprData[`${currentTimePeriod}_fact_work`])) || Boolean(planValue);
    })
    .map((pprData) => {
      const newPprData = { ...pprData };

      const planWork = pprData[planWorkField];

      const planWorkValue =
        planWork.handCorrection !== null ? planWork.handCorrection : planWork.original + planWork.outsideCorrectionsSum;

      const planTimeValue = roundToFixed(planWorkValue * pprData.norm_of_time);
      // Меняю final только потому, что расчеты в createPprMeta ведется по finalValue
      newPprData[planWorkField].final = planWorkValue;
      newPprData[planTimeField].final = planTimeValue;

      return newPprData;
    });

  const monthPprMeta = createPprMeta({
    pprData: filteredPprData,
  });

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
      <p className="text-center font-bold m-4">УТВЕРЖДАЮ: _______________________</p>
      <h2 className="text-center font-bold text-xl mb-2">
        ВЕДОМОСТЬ
        <br />
        учета выполнения работ
        <br />
        за {translateRuTimePeriod(currentTimePeriod)} месяц {ppr.year} г.
      </h2>
      <MonthWorkingMansTable
        monthPprMeta={monthPprMeta}
        globalPprMeta={globalPprMeta}
        workingMans={ppr.workingMans}
        currentTimePeriod={currentTimePeriod}
      />
      <br />
      <MonthPlanTable
        monthPprMeta={monthPprMeta}
        globalPprMeta={globalPprMeta}
        filteredPprData={filteredPprData}
        currentTimePeriod={currentTimePeriod}
      />
      <p className="ml-[33%] my-4">__________________________________</p>
      <p className="ml-[33%] mb-4">__________________________________</p>
      <p className="ml-[33%] mb-4">__________________________________</p>
    </div>
  );
};
