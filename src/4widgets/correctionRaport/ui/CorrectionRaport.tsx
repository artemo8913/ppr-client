"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import { checkIsPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";
import { translateRuTimePeriod } from "@/1shared/lib/date";
import { TPlanWorkPeriodsFields, IPlanWorkValues, getFactWorkFieldByTimePeriod } from "@/2entities/ppr";
import { DoneWorksCorrectionItem } from "./DoneWorksCorrectionItem";
import { PlanCorrectionItem } from "./PlanCorrectionItem";

export interface TCorrectionItem {
  rowIndex: number;
  objectId: string;
  firstCompareValue: number;
  secondCompareValue: number;
  plan: IPlanWorkValues | null;
}

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const { data: userData } = useSession();

  if (!userData?.user) {
    return "Не авторизирован пользователь";
  }

  const { idDirection, idDistance, idSubdivision } = userData?.user;

  if (currentTimePeriod === "year") {
    return "Рапорт доступен только при просмотре ППР за конкретный месяц";
  }

  const fieldFrom: keyof TPlanWorkPeriodsFields = `${currentTimePeriod}_plan_work`;
  const monthStatus = ppr?.months_statuses[currentTimePeriod];

  const undoneWorks: TCorrectionItem[] = [];
  const welldoneWorks: TCorrectionItem[] = [];
  const planCorrections: TCorrectionItem[] = [];

  ppr?.data.forEach((pprData, rowIndex) => {
    const plan = pprData[fieldFrom];
    const objectId = pprData.id;

    if (plan.handCorrection !== null) {
      const planWorkValue = plan.original + plan.outsideCorrectionsSum;
      const correctedValue = plan.handCorrection;

      planCorrections.push({
        objectId,
        rowIndex,
        plan,
        firstCompareValue: planWorkValue,
        secondCompareValue: correctedValue,
      });
    }

    const planWorkValue =
      plan.handCorrection !== null ? plan.handCorrection : plan.original + plan.outsideCorrectionsSum;
    const factWorkValue = pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)];

    if (planWorkValue > factWorkValue) {
      undoneWorks.push({
        objectId,
        rowIndex,
        plan,
        firstCompareValue: planWorkValue,
        secondCompareValue: factWorkValue,
      });
    } else if (planWorkValue < factWorkValue) {
      welldoneWorks.push({
        objectId,
        rowIndex,
        plan,
        firstCompareValue: planWorkValue,
        secondCompareValue: factWorkValue,
      });
    }
  });

  const isPprUnderControl = checkIsPprInUserControl(ppr?.created_by, userData?.user).isForSubdivision;
  const isEditablePlanCorrections = monthStatus === "plan_creating" && isPprUnderControl;
  const isEditableDoneWorkCorrections = monthStatus === "fact_filling" && isPprUnderControl;
  const isShowPlanCorrections = planCorrections.length > 0;
  const isShowDoneWorkCorrections =
    monthStatus === "fact_filling" ||
    monthStatus === "fact_on_agreement_sub_boss" ||
    monthStatus === "fact_verification_time_norm" ||
    monthStatus === "fact_verification_engineer" ||
    monthStatus === "done";
  const isShowUndoneCorrections = undoneWorks.length > 0 && isShowDoneWorkCorrections;
  const isShowWellDoneCorrections = welldoneWorks.length > 0 && isShowDoneWorkCorrections;

  return (
    <div>
      <p className="text-right">
        Начальнику{" "}
        {Boolean(idDirection && idDistance) && directionsMock[idDirection!].distances[idDistance!].short_name}
        <br />
        XXX
        <br />
        начальника района контактной сети ЭЧК-{idSubdivision}
        <br />
        ХХХ
      </p>
      <h2 className="text-center font-bold">Рапорт</h2>
      {isShowPlanCorrections && (
        <>
          <p className="font-bold indent-4 text-justify">
            При планировании ведомости выполненных работ (форма ЭУ-99) на {translateRuTimePeriod(currentTimePeriod)}{" "}
            месяц {ppr?.year} г. возникла необходимости корректировки годового плана технического обслуживания и
            ремонта:
          </p>
          <ol className="list-decimal pl-[revert]">
            {planCorrections.map((correction) => (
              <PlanCorrectionItem
                isEditable={isEditablePlanCorrections}
                key={correction.objectId}
                correction={correction}
                fieldFrom={fieldFrom}
                measure={ppr?.data[correction.rowIndex].measure}
                name={ppr?.data[correction.rowIndex].name}
              />
            ))}
          </ol>
        </>
      )}
      {isShowUndoneCorrections && (
        <>
          <p className="font-bold indent-4 text-justify">
            За {translateRuTimePeriod(currentTimePeriod)} месяц не в полном объеме выполнены следующие работы:
          </p>
          <ol className="list-decimal pl-[revert] indent-4 text-justify">
            {undoneWorks.map((correction) => (
              <DoneWorksCorrectionItem
                isEditable={isEditableDoneWorkCorrections}
                key={correction.objectId}
                correction={correction}
                fieldFrom={fieldFrom}
                measure={ppr?.data[correction.rowIndex].measure}
                name={ppr?.data[correction.rowIndex].name}
              />
            ))}
          </ol>
        </>
      )}
      {isShowWellDoneCorrections && (
        <>
          <p className="font-bold indent-4 text-justify">
            В тоже время были выполнены (перевыполнены) следующие работы:
          </p>
          <ol className="list-decimal pl-[revert] indent-4 text-justify">
            {welldoneWorks.map((correction) => (
              <DoneWorksCorrectionItem
                isEditable={isEditableDoneWorkCorrections}
                key={correction.objectId}
                correction={correction}
                fieldFrom={fieldFrom}
                measure={ppr?.data[correction.rowIndex].measure}
                name={ppr?.data[correction.rowIndex].name}
              />
            ))}
          </ol>
        </>
      )}
    </div>
  );
};
