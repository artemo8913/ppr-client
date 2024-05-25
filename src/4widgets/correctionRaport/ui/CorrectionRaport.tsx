"use client";
import React, { FC } from "react";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { useSession } from "next-auth/react";
import { directionsMock } from "@/1shared/types/transEnergoDivisions";
import { monthsIntlRu } from "@/1shared/types/date";
import { IPlanWorkPeriods } from "@/2entities/pprTable";
import { PprTableTransfersControl } from "@/3features/pprTableTransfersControl";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { pprData, workBasicInfo } = usePprTableData();
  const { currentTimePeriod } = usePprTableViewSettings();
  const { data: userData } = useSession();

  const { id_direction, id_distance, id_subdivision } = userData?.user!;

  const fieldFrom: keyof IPlanWorkPeriods = `${currentTimePeriod}_plan_work`;

  const worksCorrections = Object.entries(pprData?.corrections.works || {})
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
        При планировании ведомости выполненных работ (форма ЭУ-99) на {monthsIntlRu[currentTimePeriod]} месяц возникла
        необходимости корректировки годового плана технического обслуживания ремонта в части:
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
              <span>{workBasicInfo[correction.id].measure}</span> <span>перенести на/с:</span>{" "}
              <PprTableTransfersControl objectId={correction.id} fieldFrom={fieldFrom} />;
            </li>
          );
        })}
      </ol>
    </div>
  );
};
