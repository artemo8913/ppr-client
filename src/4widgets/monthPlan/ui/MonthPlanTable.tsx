"use client";
import { FC, Fragment } from "react";

import { TTimePeriod } from "@/1shared/const/date";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { IPprMeta } from "@/1shared/providers/pprProvider";
import { translateRuPprBranchName } from "@/1shared/locale/pprBranches";
import {
  getFactTimeFieldByTimePeriod,
  getFactWorkFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
  IPprData,
  SummaryTableRow,
} from "@/2entities/ppr";

import style from "./MonthPlan.module.scss";

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
    "entry_year",
    getPlanTimeFieldByTimePeriod(timePeriod),
    getFactWorkFieldByTimePeriod(timePeriod),
    getFactTimeFieldByTimePeriod(timePeriod),
    "location",
  ];
}

const SUMMARY_ROW_NAME_COL_SPAN = 4;

const TITLE_BRANCHES_COL_SPAN = 10;

interface IMonthPlanTableProps {
  monthPprMeta: IPprMeta;
  globalPprMeta: IPprMeta;
  filteredPprData: IPprData[];
  currentTimePeriod: TTimePeriod;
}

export const MonthPlanTable: FC<IMonthPlanTableProps> = ({
  monthPprMeta,
  globalPprMeta,
  filteredPprData,
  currentTimePeriod,
}) => {
  const { worksOrderForRowSpan } = globalPprMeta;
  const { worksRowSpan, branchesAndSubbrunchesOrder, totalValues, branchesMeta } = monthPprMeta;

  const columnsForTotalValues = getMonthPlanFieldsForTotalRow(currentTimePeriod);

  const planWorkField = getPlanWorkFieldByTimePeriod(currentTimePeriod);
  const planTimeField = getPlanTimeFieldByTimePeriod(currentTimePeriod);

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th rowSpan={2}>№ п.п</th>
          <th colSpan={3}>Работа</th>
          <th colSpan={3}>План</th>
          <th colSpan={2}>Выполнение</th>
          <th rowSpan={2}>Примечание</th>
        </tr>
        <tr>
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
        {filteredPprData?.map((pprData, index, data) => {
          const [branchOrder, subbranchOrder] = worksOrderForRowSpan[pprData.id].split(".");

          const [prevBranchOrder, prevSubbranchOrder] = data[index - 1]?.id
            ? worksOrderForRowSpan[data[index - 1].id].split(".")
            : ["-", "-"];

          return (
            <Fragment key={pprData.id}>
              {pprData.id in branchesAndSubbrunchesOrder && (
                <>
                  {branchesAndSubbrunchesOrder[pprData.id].subbranch.prev && (
                    <SummaryTableRow
                      isVertical={false}
                      fields={columnsForTotalValues}
                      summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
                      name={`Итого по пункту ${prevBranchOrder}.${prevSubbranchOrder}`}
                      totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].subbranch.prev?.total}
                    />
                  )}
                  {branchesAndSubbrunchesOrder[pprData.id].branch?.prev && (
                    <SummaryTableRow
                      isVertical={false}
                      fields={columnsForTotalValues}
                      name={`Итого по разделу ${prevBranchOrder}`}
                      summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
                      totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].branch?.prev?.total}
                    />
                  )}
                  {branchesAndSubbrunchesOrder[pprData.id].branch && (
                    <tr>
                      <td colSpan={TITLE_BRANCHES_COL_SPAN}>
                        {`${branchOrder}. `}
                        {translateRuPprBranchName(branchesAndSubbrunchesOrder[pprData.id].branch?.name || "")}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={TITLE_BRANCHES_COL_SPAN}>
                      {`${branchOrder}.${subbranchOrder}. `}
                      {branchesAndSubbrunchesOrder[pprData.id].subbranch?.name}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                {worksRowSpan[index] === 0 ? null : (
                  <td rowSpan={worksRowSpan[index]}>{worksOrderForRowSpan[pprData.id]}</td>
                )}
                {getMonthPlanFields(currentTimePeriod).map((field) => {
                  let displayValue;

                  if (field === planWorkField) {
                    displayValue = pprData[planWorkField].final;
                  } else if (field === planTimeField) {
                    displayValue = pprData[planTimeField].final;
                  } else {
                    displayValue = String(pprData[field]);
                  }

                  const note = field === "name" && pprData.note ? ` (прим. ${pprData.note})` : null;

                  if (field === "name" && worksRowSpan[index] === 0) {
                    return null;
                  }

                  return (
                    <td rowSpan={field === "name" ? worksRowSpan[index] : undefined} key={pprData.id + field}>
                      {displayValue}
                      {note && <span className="block font-semibold">{note}</span>}
                    </td>
                  );
                })}
                <td>
                  {pprData[planWorkField].undoneTransfers?.map((transfer, index) => {
                    const month = translateRuTimePeriod(transfer.fieldTo);
                    const text = transfer.value >= 0 ? `${transfer.value} на ${month}` : `${transfer.value} с ${month}`;
                    return <div key={index}>{text}</div>;
                  })}
                </td>
              </tr>
              {index === data.length - 1 && (
                <>
                  <SummaryTableRow
                    isVertical={false}
                    fields={columnsForTotalValues}
                    summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
                    name={`Итого по пункту ${branchOrder}.${subbranchOrder}.`}
                    totalFieldsValues={branchesMeta.slice(-1)[0].subbranches.slice(-1)[0].total}
                  />
                  <SummaryTableRow
                    isVertical={false}
                    fields={columnsForTotalValues}
                    name={`Итого по разделу ${branchOrder}.`}
                    summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
                    totalFieldsValues={branchesMeta.slice(-1)[0].total}
                  />
                </>
              )}
            </Fragment>
          );
        })}
        <SummaryTableRow
          isVertical={false}
          fields={columnsForTotalValues}
          name={`Итого по разделам 1-3`}
          totalFieldsValues={totalValues.works}
          summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
        />
      </tbody>
    </table>
  );
};
