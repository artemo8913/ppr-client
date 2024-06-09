"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";
import { timePeriodIntlRu } from "@/1shared/lib/date";
import { IPlanWorkPeriods } from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { ppr, workBasicInfo } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const { data: userData } = useSession();

  const { id_direction, id_distance, id_subdivision } = userData?.user!;

  const fieldFrom: keyof IPlanWorkPeriods = `${currentTimePeriod}_plan_work`;

  const worksCorrections = Object.entries(ppr?.corrections.works || {})
    .filter(([id, value]) => value && `${currentTimePeriod}_plan_work` in value)
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
      <p className="indent-4 text-justify">
        При планировании ведомости выполненных работ (форма ЭУ-99) на {timePeriodIntlRu[currentTimePeriod]} месяц
        возникла необходимости корректировки годового плана технического обслуживания ремонта в части:
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
              <span>{Number(correction.data?.newValue) - Number(correction.data?.diff)}</span>{" "}
              <span>{workBasicInfo[correction.id].measure}</span> <span>изменить на</span>{" "}
              <span>{Number(correction.data?.newValue)}</span> <span>{workBasicInfo[correction.id].measure}</span>
              {". "}
              <span>Разницу</span> <span>{Number(correction.data?.diff)}</span>{" "}
              <span>{workBasicInfo[correction.id].measure}</span>{" "}
              <SetPprCorrectionTransfer objectId={correction.id} fieldFrom={fieldFrom} />;
            </li>
          );
        })}
      </ol>
    </div>
  );
};
