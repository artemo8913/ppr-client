"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import { isPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";
import { timePeriodIntlRu } from "@/1shared/lib/date";
import {
  IPlanWorkPeriods,
  TCorrection,
  getFactWorkFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
} from "@/2entities/ppr";
import { DoneWorksCorrectionItem } from "./DoneWorksCorrectionItem";
import { PlanCorrectionItem } from "./PlanCorrectionItem";

export interface TCorrectionItem {
  rowIndex: number;
  objectId: string;
  firstCompareValue: number;
  secondCompareValue: number;
  correctionData: TCorrection<IPlanWorkPeriods> | null;
}

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { ppr, getWorkCorrection } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const { data: userData } = useSession();
  if (!userData?.user) {
    return "Не авторизирован пользователь";
  }
  const { id_direction, id_distance, id_subdivision } = userData?.user;

  if (currentTimePeriod === "year") {
    return "Рапорт доступен только при просмотре ППР за конкретный месяц";
  }
  const fieldFrom: keyof IPlanWorkPeriods = `${currentTimePeriod}_plan_work`;
  const monthStatus = ppr?.months_statuses[currentTimePeriod];

  const undoneWorks: TCorrectionItem[] = [];
  const welldoneWorks: TCorrectionItem[] = [];
  const planCorrections: TCorrectionItem[] = [];

  ppr?.data.forEach((pprData, rowIndex) => {
    const objectId = pprData.id;
    const correctionData = getWorkCorrection(rowIndex, getPlanWorkFieldByTimePeriod(currentTimePeriod));

    if (correctionData?.isHandCorrected) {
      const planWorkValue = Number(correctionData?.basicValue) + Number(correctionData?.outsideCorrectionsSum);
      const correctedValue = Number(correctionData?.planValueAfterCorrection);

      planCorrections.push({
        rowIndex,
        correctionData,
        objectId,
        firstCompareValue: planWorkValue,
        secondCompareValue: correctedValue,
      });
    }

    const planWorkValue =
      correctionData !== undefined
        ? correctionData.planValueAfterCorrection
        : Number(pprData[getPlanWorkFieldByTimePeriod(currentTimePeriod)]);
    const factWorkValue = Number(pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)]);

    if (planWorkValue > factWorkValue) {
      undoneWorks.push({
        rowIndex,
        firstCompareValue: planWorkValue,
        secondCompareValue: factWorkValue,
        objectId,
        correctionData: correctionData || null,
      });
    } else if (planWorkValue < factWorkValue) {
      welldoneWorks.push({
        rowIndex,
        firstCompareValue: planWorkValue,
        secondCompareValue: factWorkValue,
        objectId,
        correctionData: correctionData || null,
      });
    }
  });

  const isPprUnderControl = isPprInUserControl(ppr?.created_by, userData?.user).isForSubdivision;
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
        {Boolean(id_direction && id_distance) && directionsMock[id_direction!].distances[id_distance!].short_name}
        <br />
        XXX
        <br />
        начальника района контактной сети ЭЧК-{id_subdivision}
        <br />
        ХХХ
      </p>
      <h2 className="text-center font-bold">Рапорт</h2>
      {isShowPlanCorrections && (
        <>
          <p className="font-bold indent-4 text-justify">
            При планировании ведомости выполненных работ (форма ЭУ-99) на {timePeriodIntlRu[currentTimePeriod]} месяц{" "}
            {ppr?.year} г. возникла необходимости корректировки годового плана технического обслуживания и ремонта:
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
            За {timePeriodIntlRu[currentTimePeriod]} месяц не в полном объеме выполнены следующие работы:
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
