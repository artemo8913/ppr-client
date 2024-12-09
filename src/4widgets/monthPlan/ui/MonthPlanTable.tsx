"use client";
import { FC, Fragment } from "react";

import { TTimePeriod } from "@/1shared/const/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { translateRuPprBranchName } from "@/1shared/locale/pprBranches";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  getFactTimeFieldByTimePeriod,
  getFactWorkFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
  IPprData,
} from "@/2entities/ppr";

function getMonthPlanFields(timePeriod: TTimePeriod): Array<keyof IPprData> {
  return [
    "name",
    "location",
    "measure",
    getPlanWorkFieldByTimePeriod(timePeriod),
    "norm_of_time",
    getPlanTimeFieldByTimePeriod(timePeriod),
    getFactWorkFieldByTimePeriod(timePeriod),
    getFactTimeFieldByTimePeriod(timePeriod),
  ];
}

interface IMonthPlanTableProps {}

export const MonthPlanTable: FC<IMonthPlanTableProps> = () => {
  const { ppr, pprMeta } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  const columns = getMonthPlanFields(currentTimePeriod);

  return (
    <table className="w-full">
      <thead>
        <tr className="*:border *:border-black *:">
          <th rowSpan={2}>№ п.п</th>
          <th colSpan={3}>Работа</th>
          <th colSpan={3}>План</th>
          <th colSpan={2}>Выполнение</th>
          <th rowSpan={2}>Примечание</th>
        </tr>
        <tr className="*:border *:border-black">
          <th className="w-2/3">Наименование работ</th>
          <th>Место работ (тип оборудования)</th>
          <th>Измеритель</th>
          <th>Количество</th>
          <th>Норма времени на измеритель, чел.-ч</th>
          <th>Всего трудозатрат по норме, чел.-ч</th>
          <th>Количество</th>
          <th>Фактически затрачено чел.-ч</th>
        </tr>
      </thead>
      <tbody>
        {ppr?.data
          .filter((pprData) => {
            const planValue = pprData[`${currentTimePeriod}_plan_work`].final;

            return Boolean(Number(pprData[`${currentTimePeriod}_fact_work`])) || Boolean(planValue);
          })
          .map((pprData, index) => (
            <Fragment key={pprData.id}>
              {index in pprMeta.branchesAndSubbrunchesOrder &&
                "branch" in pprMeta.branchesAndSubbrunchesOrder[index] && (
                  <tr>
                    <td colSpan={columns.length} className="border font-bold border-black cursor-default">
                      {pprMeta.branchesAndSubbrunchesOrder[index].branch!.orderIndex}{" "}
                      {translateRuPprBranchName(pprMeta.branchesAndSubbrunchesOrder[index].branch!.name)}
                    </td>
                  </tr>
                )}
              {index in pprMeta.branchesAndSubbrunchesOrder &&
                "subbranch" in pprMeta.branchesAndSubbrunchesOrder[index] && (
                  <tr>
                    <td colSpan={columns.length} className="border font-bold border-black cursor-default">
                      {pprMeta.branchesAndSubbrunchesOrder[index].subbranch?.orderIndex}{" "}
                      {pprMeta.branchesAndSubbrunchesOrder[index].subbranch?.name}
                    </td>
                  </tr>
                )}
              <tr>
                {/* TODO: Когда научусь считать номера пунктов работ, то буду их писать вместо индекса */}
                {pprMeta.worksRowSpan[index] === 0 ? null : (
                  <td rowSpan={pprMeta.worksRowSpan[index]} className="border border-black text-center">
                    {pprMeta.worksOrderForRowSpan[index]}
                  </td>
                )}
                {columns.map((field) => {
                  const value = pprData[field];
                  const showValue = value && typeof value === "object" ? value.final : value;
                  const note = field === "name" && pprData.note ? ` (прим. ${pprData.note})` : null;

                  if (pprMeta.worksRowSpan[index] === 0) {
                    return null;
                  }

                  return (
                    <td
                      rowSpan={pprMeta.worksRowSpan[index]}
                      className="border border-black text-center"
                      key={pprData.id + field}
                    >
                      {showValue}
                      {note}
                    </td>
                  );
                })}
                <td className="border border-black text-center" />
              </tr>
            </Fragment>
          ))}
      </tbody>
    </table>
  );
};
