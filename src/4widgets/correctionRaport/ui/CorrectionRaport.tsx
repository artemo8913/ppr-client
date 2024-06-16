"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";
import { timePeriodIntlRu } from "@/1shared/lib/date";
import {
  IPlanWorkPeriods,
  TCorrection,
  getFactWorkFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
} from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { ppr, getWorkCorrection } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const { data: userData } = useSession();

  const { id_direction, id_distance, id_subdivision } = userData?.user!;

  const fieldFrom: keyof IPlanWorkPeriods = `${currentTimePeriod}_plan_work`;

  const undoneWorks: {
    rowIndex: number;
    objectId: string;
    planWorkValue: number;
    factWorkValue: number;
  }[] = [];
  const welldoneWorks: {
    rowIndex: number;
    objectId: string;
    planWorkValue: number;
    factWorkValue: number;
  }[] = [];
  const worksCorrections: {
    rowIndex: number;
    objectId: string;
    correctionData: TCorrection<IPlanWorkPeriods> | undefined;
  }[] = [];

  ppr?.data.forEach((pprData, rowIndex) => {
    const objectId = pprData.id;
    const correctionData = getWorkCorrection(rowIndex, getPlanWorkFieldByTimePeriod(currentTimePeriod));
    const factWorkValue = Number(pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)]);
    if (correctionData) {
      worksCorrections.push({ rowIndex, correctionData, objectId });
    }
    const planWorkValue =
      correctionData?.correctedValue !== undefined
        ? correctionData?.correctedValue
        : Number(pprData[getPlanWorkFieldByTimePeriod(currentTimePeriod)]);
    if (planWorkValue > factWorkValue) {
      undoneWorks.push({ rowIndex, planWorkValue, factWorkValue, objectId });
    } else if (planWorkValue < factWorkValue) {
      welldoneWorks.push({ rowIndex, planWorkValue, factWorkValue, objectId });
    }
  });

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
      <p className="font-bold indent-4 text-justify">
        При планировании ведомости выполненных работ (форма ЭУ-99) на {timePeriodIntlRu[currentTimePeriod]} месяц
        возникла необходимости корректировки годового плана технического обслуживания и ремонта:
      </p>
      <ol className="list-decimal pl-[revert]">
        {worksCorrections.map((correction) => {
          const name = ppr?.data[correction.rowIndex].name;
          const planValue =
            Number(correction.correctionData?.basicValue) + Number(correction.correctionData?.outsideCorrectionsSum);
          const measure = ppr?.data[correction.rowIndex].measure;
          const correctedValue = Number(correction.correctionData?.correctedValue);
          return (
            <li key={correction.rowIndex}>
              <span>{name}:</span> <span>план</span> <span>{planValue}</span> <span>{measure}</span>{" "}
              <span>изменить на</span> <span>{correctedValue}</span> <span>{measure}</span>. <span>Разницу</span>{" "}
              <span>{planValue - correctedValue}</span> <span>{measure}</span>{" "}
              <SetPprCorrectionTransfer
                transferType="plan"
                objectId={correction.objectId}
                rowIndex={correction.rowIndex}
                fieldFrom={fieldFrom}
              />
            </li>
          );
        })}
      </ol>
      <p className="font-bold indent-4 text-justify">
        За {timePeriodIntlRu[currentTimePeriod]} месяц не в полном объеме выполнены следующие работы:
      </p>
      <ol className="list-decimal pl-[revert] indent-4 text-justify">
        {undoneWorks.map((correction) => {
          const name = ppr?.data[correction.rowIndex].name;
          const measure = ppr?.data[correction.rowIndex].measure;
          const { factWorkValue, objectId, planWorkValue, rowIndex } = correction;

          return (
            <li key={objectId}>
              <span>{name}:</span>{" "}
              <span>
                при плане {planWorkValue} {measure}
              </span>{" "}
              <span>факт составил {factWorkValue}.</span> <span>Разницу</span>{" "}
              <span>
                {Number(planWorkValue - factWorkValue)} {measure}
              </span>{" "}
              <SetPprCorrectionTransfer
                transferType="undone"
                objectId={objectId}
                rowIndex={rowIndex}
                fieldFrom={fieldFrom}
              />
            </li>
          );
        })}
      </ol>
      <p className="font-bold indent-4 text-justify">В тоже время были выполнены (перевыполнены) следующие работы:</p>
      <ol className="list-decimal pl-[revert] indent-4 text-justify">
        {welldoneWorks.map((correction) => {
          const name = ppr?.data[correction.rowIndex].name;
          const measure = ppr?.data[correction.rowIndex].measure;
          const { factWorkValue, objectId, planWorkValue, rowIndex } = correction;

          return (
            <li key={objectId}>
              <span>{name}:</span>{" "}
              <span>
                при плане {planWorkValue} {measure}
              </span>{" "}
              <span>факт составил {factWorkValue} .</span> <span>Разницу</span>{" "}
              <span>
                {Number(planWorkValue - factWorkValue)} {measure}
              </span>{" "}
              <SetPprCorrectionTransfer
                transferType="plan"
                objectId={objectId}
                rowIndex={rowIndex}
                fieldFrom={fieldFrom}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};
