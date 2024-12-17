"use client";
import { FC, Fragment } from "react";

import { TTimePeriod } from "@/1shared/const/date";
import { createPprMeta, usePpr } from "@/1shared/providers/pprProvider";
import { translateRuPprBranchName } from "@/1shared/locale/pprBranches";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  getFactTimeFieldByTimePeriod,
  getFactWorkFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
  IPprData,
  SummaryTableRow,
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

function getMonthPlanFieldsForTotalRow(timePeriod: TTimePeriod): Array<keyof IPprData> {
  return [
    "name",
    getPlanTimeFieldByTimePeriod(timePeriod),
    getFactWorkFieldByTimePeriod(timePeriod),
    getFactTimeFieldByTimePeriod(timePeriod),
    "measure",
    "measure",
  ];
}

interface IMonthPlanTableProps {}

export const MonthPlanTable: FC<IMonthPlanTableProps> = () => {
  const {
    ppr,
    pprMeta: { worksOrderForRowSpan, branchesAndSubbrunchesOrder, totalValues },
  } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  const columns = getMonthPlanFields(currentTimePeriod);

  const columnsForTotalValues = getMonthPlanFieldsForTotalRow(currentTimePeriod);

  const monthPlanData = ppr?.data.filter((pprData) => {
    const planValue = pprData[`${currentTimePeriod}_plan_work`].final;

    return Boolean(Number(pprData[`${currentTimePeriod}_fact_work`])) || Boolean(planValue);
  });

  const { worksRowSpan } = createPprMeta({ pprData: monthPlanData });

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
        {monthPlanData?.map((pprData, index) => (
          <Fragment key={pprData.id}>
            {pprData.id in branchesAndSubbrunchesOrder && (
              <>
                {branchesAndSubbrunchesOrder[pprData.id].subbranch.prev && (
                  <SummaryTableRow
                    fields={columnsForTotalValues}
                    summaryNameColSpan={4}
                    isVertical={false}
                    name={`Итого по пункту ${branchesAndSubbrunchesOrder[pprData.id].subbranch.prev?.orderIndex}`}
                    totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].subbranch.prev?.total}
                  />
                )}
                {branchesAndSubbrunchesOrder[pprData.id].branch?.prev && (
                  <SummaryTableRow
                    fields={columnsForTotalValues}
                    summaryNameColSpan={4}
                    isVertical={false}
                    name={`Итого по разделу ${branchesAndSubbrunchesOrder[pprData.id].branch?.prev?.orderIndex}`}
                    totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].branch?.prev?.total}
                  />
                )}
                {branchesAndSubbrunchesOrder[pprData.id].branch && (
                  <tr>
                    <td colSpan={10} className="border font-bold border-black cursor-default">
                      {branchesAndSubbrunchesOrder[pprData.id].branch?.orderIndex}{" "}
                      {translateRuPprBranchName(branchesAndSubbrunchesOrder[pprData.id].branch?.name || "")}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={10} className="border font-bold border-black cursor-default">
                    {branchesAndSubbrunchesOrder[pprData.id].subbranch?.orderIndex}{" "}
                    {branchesAndSubbrunchesOrder[pprData.id].subbranch?.name}
                  </td>
                </tr>
              </>
            )}
            <tr>
              {/* TODO: Когда научусь считать номера пунктов работ, то буду их писать вместо индекса */}
              {worksRowSpan[index] === 0 ? null : (
                <td rowSpan={worksRowSpan[index]} className="border border-black text-center">
                  {worksOrderForRowSpan[pprData.id]}
                </td>
              )}
              {columns.map((field) => {
                const value = pprData[field];
                const showValue = value && typeof value === "object" ? value.final : value;
                const note = field === "name" && pprData.note ? ` (прим. ${pprData.note})` : null;

                if (field === "name" && worksRowSpan[index] === 0) {
                  return null;
                }

                return (
                  <td
                    rowSpan={field === "name" ? worksRowSpan[index] : undefined}
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
      <tfoot>
        <SummaryTableRow
          fields={columnsForTotalValues}
          summaryNameColSpan={4}
          isVertical={false}
          name={`Итого по разделам 1-3`}
          totalFieldsValues={totalValues.works}
        />
      </tfoot>
    </table>
  );
};
