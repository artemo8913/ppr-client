"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";
import { timePeriodIntlRu } from "@/1shared/lib/date";
import {
  IPlanWorkPeriods,
  IPprData,
  getFactTimeFieldByTimePeriod,
  getFactWorkFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
} from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { ppr, workBasicInfo, getCorrectionValue } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const { data: userData } = useSession();

  const { id_direction, id_distance, id_subdivision } = userData?.user!;

  const fieldFrom: keyof IPlanWorkPeriods = `${currentTimePeriod}_plan_work`;

  const undoneWorks: IPprData[] = [];
  const welldoneWorks: IPprData[] = [];

  ppr?.data.forEach((pprData) => {
    const correctionValue = getCorrectionValue(pprData.id, getPlanWorkFieldByTimePeriod(currentTimePeriod));
    const planWorkValue = Number(pprData[getPlanWorkFieldByTimePeriod(currentTimePeriod)] + correctionValue);
    const factWorkValue = Number(pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)]);
    if (planWorkValue > factWorkValue) {
      undoneWorks.push(pprData);
    } else if (planWorkValue < factWorkValue) {
      welldoneWorks.push(pprData);
    }
  });

  const worksCorrections = Object.entries(ppr?.corrections.works || {})
    .filter(([_, value]) => value && `${currentTimePeriod}_plan_work` in value)
    .map(([id, value]) => ({ id, data: value ? value![fieldFrom] : undefined }));

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
        возникла необходимости корректировки годового плана технического обслуживания и ремонта в части:
      </p>
      <p className="indent-4 text-justify">Состава персонала чел.-ч:</p>
      <ol className="list-decimal pl-[revert]">
        <li>XXX</li>
      </ol>
      <p className="indent-4 text-justify">Набора работ:</p>
      <ol className="list-decimal pl-[revert]">
        {worksCorrections.map((correction) => {
          return (
            <li key={correction.id}>
              <span>{workBasicInfo[correction.id].name}:</span> <span>план</span>{" "}
              <span>
                {Number(correction.data?.newValue) -
                  Number(correction.data?.diff) +
                  getCorrectionValue(correction.id, getPlanWorkFieldByTimePeriod(currentTimePeriod))}
              </span>{" "}
              <span>{workBasicInfo[correction.id].measure}</span> <span>изменить на</span>{" "}
              <span>{Number(correction.data?.newValue)}</span> <span>{workBasicInfo[correction.id].measure}</span>
              {". "}
              <span>Разницу</span> <span>{-Number(correction.data?.diff)}</span>{" "}
              <span>{workBasicInfo[correction.id].measure}</span>{" "}
              <SetPprCorrectionTransfer transferType="plan" objectId={correction.id} fieldFrom={fieldFrom} />;
            </li>
          );
        })}
      </ol>
      <p className="indent-4 text-justify">
        <span className="font-bold">
          За {timePeriodIntlRu[currentTimePeriod]} месяц не в полном объеме выполнены следующие работы:
        </span>
        <ol className="list-decimal pl-[revert]">
          {undoneWorks.map((pprData) => {
            const correctionValue = getCorrectionValue(pprData.id, getPlanWorkFieldByTimePeriod(currentTimePeriod));
            const planWorkValue = Number(pprData[getPlanWorkFieldByTimePeriod(currentTimePeriod)] + correctionValue);
            const planTimeValue = Number((planWorkValue * pprData.norm_of_time).toFixed(2));
            const factWorkValue = Number(pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)]);
            const factTimeValue = Number(pprData[getFactTimeFieldByTimePeriod(currentTimePeriod)]);

            return (
              <li key={pprData.id}>
                <span>{pprData.name}:</span>{" "}
                <span>
                  при плане {planWorkValue} {pprData.measure} ({planTimeValue} чел.-ч)
                </span>{" "}
                <span>
                  факт составил {factWorkValue} ({factTimeValue} чел.-ч).
                </span>{" "}
                <span>Разницу</span>{" "}
                <span>
                  {Number(planWorkValue - factWorkValue)} {pprData.measure}
                </span>{" "}
                <SetPprCorrectionTransfer transferType="undone" objectId={pprData.id} fieldFrom={fieldFrom} />
              </li>
            );
          })}
        </ol>
      </p>
      <p className="indent-4 text-justify">
        <span className="font-bold">В тоже время были выполнены (перевыполнены) следующие работы:</span>
        <ol className="list-decimal pl-[revert]">
          {welldoneWorks.map((pprData) => {
            const planWorkValue = Number(pprData[getPlanWorkFieldByTimePeriod(currentTimePeriod)]);
            const planTimeValue = Number(pprData[getPlanTimeFieldByTimePeriod(currentTimePeriod)]);
            const factWorkValue = Number(pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)]);
            const factTimeValue = Number(pprData[getFactTimeFieldByTimePeriod(currentTimePeriod)]);

            return (
              <li key={pprData.id}>
                <span>{pprData.name}:</span>{" "}
                <span>
                  при плане {planWorkValue} {pprData.measure} ({planTimeValue} чел.-ч)
                </span>{" "}
                <span>
                  факт составил {factWorkValue} ({factTimeValue} чел.-ч).
                </span>{" "}
                <span>Разницу</span>{" "}
                <span>
                  {Number(planWorkValue - factWorkValue)} {pprData.measure}
                </span>{" "}
                <SetPprCorrectionTransfer transferType="plan" objectId={pprData.id} fieldFrom={fieldFrom} />
              </li>
            );
          })}
        </ol>
      </p>
    </div>
  );
};
