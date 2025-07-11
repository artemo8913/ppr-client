"use client";
import { FC, Fragment } from "react";

import { getTimePeriodFromString, TimePeriod, translateRuTimePeriod } from "@/1shared/lib/date";
import { PprField, IPprData, IPprMeta, SummaryTableRow, translateRuPprBranchName } from "@/2entities/ppr";

import style from "./MonthPlan.module.scss";

function getMonthPlanFields(timePeriod: TimePeriod): Array<keyof IPprData> {
  return [
    "name",
    "location",
    "measure",
    PprField.getPlanWorkFieldByTimePeriod(timePeriod),
    "norm_of_time",
    PprField.getPlanTimeFieldByTimePeriod(timePeriod),
    PprField.getFactWorkFieldByTimePeriod(timePeriod),
    PprField.getFactNormTimeFieldByTimePeriod(timePeriod),
    PprField.getFactTimeFieldByTimePeriod(timePeriod),
  ];
}

function getMonthPlanFieldsForTotalRow(timePeriod: TimePeriod): Array<keyof IPprData> {
  return [
    "name",
    "entry_year",
    PprField.getPlanTimeFieldByTimePeriod(timePeriod),
    PprField.getFactWorkFieldByTimePeriod(timePeriod),
    PprField.getFactNormTimeFieldByTimePeriod(timePeriod),
    PprField.getFactTimeFieldByTimePeriod(timePeriod),
    "location",
  ];
}

const SUMMARY_ROW_NAME_COL_SPAN = 4;

const TITLE_BRANCHES_COL_SPAN = 11;

interface IMonthPlanTableProps {
  monthPprMeta: IPprMeta;
  globalPprMeta: IPprMeta;
  filteredPprData: IPprData[];
  currentTimePeriod: TimePeriod;
}

export const MonthPlanTable: FC<IMonthPlanTableProps> = ({
  monthPprMeta,
  globalPprMeta,
  filteredPprData,
  currentTimePeriod,
}) => {
  const { worksOrder } = globalPprMeta;
  const { worksRowSpan, branchesAndSubbrunchesOrder, totalValues, branchesMeta } = monthPprMeta;

  const columnsForTotalValues = getMonthPlanFieldsForTotalRow(currentTimePeriod);

  const planWorkField = PprField.getPlanWorkFieldByTimePeriod(currentTimePeriod);
  const planTimeField = PprField.getPlanTimeFieldByTimePeriod(currentTimePeriod);

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th rowSpan={2}>№ п.п</th>
          <th colSpan={3}>Работа</th>
          <th colSpan={3}>План</th>
          <th colSpan={3}>Выполнение</th>
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
          <th>Нормир. время на факт.вып. объем работ, чел.-ч</th>
          <th>Фактически затрачено, чел.-ч</th>
        </tr>
      </thead>
      <tbody>
        {filteredPprData?.map((pprData, index, data) => {
          const [branchOrder, subbranchOrder] = worksOrder[pprData.id].split(".");

          const [prevBranchOrder, prevSubbranchOrder] = data[index - 1]?.id
            ? worksOrder[data[index - 1].id].split(".")
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
                      totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].subbranch.prev?.total.final}
                    />
                  )}
                  {branchesAndSubbrunchesOrder[pprData.id].branch?.prev && (
                    <SummaryTableRow
                      isVertical={false}
                      fields={columnsForTotalValues}
                      name={`Итого по разделу ${prevBranchOrder}`}
                      summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
                      totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].branch?.prev?.total.final}
                    />
                  )}
                  {branchesAndSubbrunchesOrder[pprData.id].branch && (
                    <tr className={style.titleRow}>
                      <td colSpan={TITLE_BRANCHES_COL_SPAN}>
                        {`${branchOrder}. `}
                        {translateRuPprBranchName(branchesAndSubbrunchesOrder[pprData.id].branch?.name || "")}
                      </td>
                    </tr>
                  )}
                  <tr className={style.titleRow}>
                    <td colSpan={TITLE_BRANCHES_COL_SPAN}>
                      {`${branchOrder}.${subbranchOrder}. `}
                      {branchesAndSubbrunchesOrder[pprData.id].subbranch?.name}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                {worksRowSpan[index] === 0 ? null : <td rowSpan={worksRowSpan[index]}>{worksOrder[pprData.id]}</td>}
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
                    const timePeriod = getTimePeriodFromString(transfer.fieldTo);
                    const month = timePeriod && translateRuTimePeriod(timePeriod);
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
                    totalFieldsValues={branchesMeta.slice(-1)[0].subbranches.slice(-1)[0].total.final}
                  />
                  <SummaryTableRow
                    isVertical={false}
                    fields={columnsForTotalValues}
                    name={`Итого по разделу ${branchOrder}.`}
                    summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
                    totalFieldsValues={branchesMeta.slice(-1)[0].total.final}
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
          totalFieldsValues={totalValues.final.works}
          summaryNameColSpan={SUMMARY_ROW_NAME_COL_SPAN}
        />
      </tbody>
    </table>
  );
};
