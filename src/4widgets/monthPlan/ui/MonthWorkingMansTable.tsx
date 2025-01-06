"use client";
import { FC } from "react";

import { roundToFixed } from "@/1shared/lib/math";
import { TTimePeriod } from "@/1shared/const/date";
import { IPprMeta } from "@/1shared/providers/pprProvider";
import {
  getFactTimeFieldByTimePeriod,
  getPlanNormTimeFieldByTimePeriod,
  getPlanTabelTimeFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  IWorkingManYearPlan,
} from "@/2entities/ppr";

import style from "./MonthPlan.module.scss";

function getWorkingMansMonthPlanFields(timePeriod: TTimePeriod): Array<keyof IWorkingManYearPlan | null> {
  return [
    "full_name",
    "work_position",
    "participation",
    getPlanNormTimeFieldByTimePeriod(timePeriod),
    getPlanTabelTimeFieldByTimePeriod(timePeriod),
    getPlanTimeFieldByTimePeriod(timePeriod),
    null,
    null,
    null,
    getFactTimeFieldByTimePeriod(timePeriod),
    null,
  ];
}

interface IMonthWorkingMansTableProps {
  monthPprMeta: IPprMeta;
  globalPprMeta: IPprMeta;
  currentTimePeriod: TTimePeriod;
  workingMans: IWorkingManYearPlan[];
}

export const MonthWorkingMansTable: FC<IMonthWorkingMansTableProps> = ({
  workingMans,
  monthPprMeta,
  globalPprMeta,
  currentTimePeriod,
}) => {
  const totalMansPlanNormTime = globalPprMeta.totalValues.final.peoples[getPlanNormTimeFieldByTimePeriod(currentTimePeriod)];

  const totalMansPlanTabelTime =
    globalPprMeta.totalValues.final.peoples[getPlanTabelTimeFieldByTimePeriod(currentTimePeriod)];

  const totalMansPlanTime = globalPprMeta.totalValues.final.peoples[getPlanTimeFieldByTimePeriod(currentTimePeriod)];

  const planTimeExploitationTotal = monthPprMeta.branchesMeta.reduce((sum, val) => {
    if (val.type === "branch" && val.name === "exploitation") {
      return sum + (val.total.final[getPlanTimeFieldByTimePeriod(currentTimePeriod)] || 0);
    }
    return sum;
  }, 0);

  const factTimeExploitationTotal = monthPprMeta.branchesMeta.reduce((sum, val) => {
    if (val.type === "branch" && val.name === "exploitation") {
      return sum + (val.total.final[getFactTimeFieldByTimePeriod(currentTimePeriod)] || 0);
    }
    return sum;
  }, 0);

  const exploitationPercent =
    factTimeExploitationTotal && planTimeExploitationTotal
      ? `${roundToFixed((factTimeExploitationTotal / planTimeExploitationTotal) * 100, 0)}%`
      : "-";

  const totalFactTime = monthPprMeta.totalValues.final.works[getFactTimeFieldByTimePeriod(currentTimePeriod)];

  const totalFactTimePercent =
    totalFactTime && totalMansPlanTime ? `${roundToFixed((totalFactTime / totalMansPlanTime) * 100, 0)}%` : "-";

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th colSpan={3}>Данные о работнике</th>
          <th colSpan={3}>Настой часов</th>
          <th rowSpan={2}>Заданно по эксплуатационному плану, чел.-ч</th>
          <th colSpan={2}>Выполнение эксплуатационного плана</th>
          <th colSpan={2}>Выполнение эксплуатационного плана с учетом всех выполненных работ</th>
        </tr>
        <tr>
          <th>фамилия, имя, отчество</th>
          <th>должность, профессия, разряд рабочих, совмещаемые профессии</th>
          <th>доля участия</th>
          <th>по норме</th>
          <th>по табелю</th>
          <th>нормированное задание</th>
          <th>чел.-ч</th>
          <th>%</th>
          <th>факт, чел.-ч</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
        {workingMans.map((man) => {
          return (
            <tr key={man.id}>
              {getWorkingMansMonthPlanFields(currentTimePeriod).map((field, index) => {
                return <td key={man.id + String(index)}>{field && man[field] ? man[field] : ""}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="font-bold">
          <td colSpan={3}>ИТОГО</td>
          <td>{totalMansPlanNormTime}</td>
          <td>{totalMansPlanTabelTime}</td>
          <td>{totalMansPlanTime}</td>
          <td>{planTimeExploitationTotal}</td>
          <td>{factTimeExploitationTotal}</td>
          <td>{exploitationPercent}</td>
          <td>{totalFactTime}</td>
          <td>{totalFactTimePercent}</td>
        </tr>
      </tfoot>
    </table>
  );
};
