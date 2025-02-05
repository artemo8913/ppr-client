"use client";
import { FC } from "react";

import { roundToFixed } from "@/1shared/lib/math";
import { createPprMeta, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { getPlanTimeFieldByTimePeriod, getPlanWorkFieldByTimePeriod, IPprData } from "@/2entities/ppr";

import { MonthPlanTable } from "./MonthPlanTable";
import { MonthWorkingMansTable } from "./MonthWorkingMansTable";

interface IMonthPlanProps {}

export const MonthPlan: FC<IMonthPlanProps> = () => {
  const { ppr, pprMeta: globalPprMeta } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  if (!ppr) {
    return null;
  }

  if (currentTimePeriod === "year") {
    return "Месячный план доступен только при просмотре ППР за конкретный месяц";
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
      const newPprData: IPprData = JSON.parse(JSON.stringify(pprData));

      const planWork = pprData[planWorkField];

      const planWorkValue =
        planWork.handCorrection !== null ? planWork.handCorrection : planWork.original + planWork.outsideCorrectionsSum;

      const planTimeValue = roundToFixed(planWorkValue * pprData.norm_of_time);
      // Меняю final так как расчеты в createPprMeta ведутся по finalValue,
      // в дальнейшем в таблице месячного планирования также берутся значения finalValue
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
