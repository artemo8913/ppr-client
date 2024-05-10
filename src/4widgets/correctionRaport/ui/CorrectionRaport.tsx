"use client";
import React, { FC } from "react";
import { usePprTableData, usePprTableSettings } from "@/1shared/providers/pprTableProvider";
import { useSession } from "next-auth/react";
import { directions } from "@/1shared/types/transEnergoDivisions";
import { findMonthByStart, monthsIntlRu } from "@/1shared/types/date";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { pprData, worksDataInPpr } = usePprTableData();
  const { currentTimePeriod } = usePprTableSettings();
  const { data: userData } = useSession();

  const { id, id_direction, id_distance, id_subdivision, role } = userData?.user!;

  const worksCorrections = Object.entries(pprData?.corrections.works || {})
    .filter(([id, value]) => value && `${currentTimePeriod}_plan_work` in value)
    .map(([id, value]) => ({ id, data: value ? value![`${currentTimePeriod}_plan_work`] : undefined }));
  return (
    <div>
      <p className="text-right">
        Начальнику{" "}
        {Boolean(id_direction && id_distance) && directions[id_direction!].distances[id_distance!].short_name}
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
          const notTransfer = correction.data?.fieldsTo === null ? correction.data?.fieldsTo : null;
          const transfer =
            correction.data?.fieldsTo !== null && correction.data?.fieldsTo !== undefined
              ? correction.data?.fieldsTo!
              : [];
          return (
            <li key={correction.id}>
              <span>{worksDataInPpr[correction.id].name}:</span> <span>план</span>{" "}
              <span>{Number(correction.data?.newValue) - Number(correction.data?.diff)}</span>{" "}
              <span>{worksDataInPpr[correction.id].measure}</span> <span>изменить на</span>{" "}
              <span>{Number(correction.data?.newValue)}</span> <span>{worksDataInPpr[correction.id].measure}</span>
              {". "}
              <span>Разницу</span> <span>{Number(correction.data?.diff)}</span>{" "}
              <span>{worksDataInPpr[correction.id].measure}</span> <span>перенести на/с</span>{" "}
              {transfer.map((trans) => {
                return (
                  <>
                    {findMonthByStart(trans.fieldNameTo)} ({trans.value} {worksDataInPpr[correction.id].measure})
                  </>
                );
              })}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
