"use client";
import { FC } from "react";
import clsx from "clsx";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { TimePeriod } from "@/1shared/lib/date";
import {
  getFactTimeFieldByTimePeriod,
  getPlanNormTimeFieldByTimePeriod,
  getPlanTabelTimeFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  IPprMeta,
  IWorkingManYearPlan,
} from "@/2entities/ppr";

import style from "./MonthPlan.module.scss";

function getWorkingMansMonthPlanFields(timePeriod: TimePeriod): Array<keyof IWorkingManYearPlan | null> {
  return [
    "full_name",
    "work_position",
    getPlanNormTimeFieldByTimePeriod(timePeriod),
    getPlanTabelTimeFieldByTimePeriod(timePeriod),
    "participation",
    getPlanTimeFieldByTimePeriod(timePeriod),
  ];
}

interface IMonthWorkingMansTableProps {
  monthPprMeta: IPprMeta;
  globalPprMeta: IPprMeta;
  currentTimePeriod: TimePeriod;
  workingMans: IWorkingManYearPlan[];
}

export const MonthWorkingMansTable: FC<IMonthWorkingMansTableProps> = ({
  workingMans,
  monthPprMeta,
  globalPprMeta,
  currentTimePeriod,
}) => {
  const totalMansPlanNormTime =
    globalPprMeta.totalValues.final.peoples[getPlanNormTimeFieldByTimePeriod(currentTimePeriod)];

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

  const totalFactTime = globalPprMeta.totalValues.final.works[getFactTimeFieldByTimePeriod(currentTimePeriod)];

  const totalFactTimePercent =
    totalFactTime && totalMansPlanTime ? `${roundToFixed((totalFactTime / totalMansPlanTime) * 100, 0)}%` : "-";

  return (
    <>
      <table className={clsx(style.table, "mb-4")}>
        <thead>
          <tr>
            <th colSpan={6}>Сведения о составе бригады</th>
          </tr>
          <tr>
            <th rowSpan={2}>Ф.И.О.</th>
            <th rowSpan={2}>Должность, профессия</th>
            <th colSpan={2}>Настой часов</th>
            <th colSpan={2}>Плановое задание</th>
          </tr>
          <tr>
            <th>по штатному расписанию</th>
            <th>по табелю</th>
            <th>в %</th>
            <th>часы</th>
          </tr>
        </thead>
        <tbody>
          {workingMans.map((man) => {
            return (
              <tr key={man.id}>
                {getWorkingMansMonthPlanFields(currentTimePeriod).map((field, index) => {
                  return (
                    <td key={man.id + String(index)}>
                      {field && man[field] ? (field === "participation" ? `${man[field] * 100} %` : man[field]) : ""}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td>ИТОГО</td>
            <td>-</td>
            <td>{totalMansPlanNormTime}</td>
            <td>{totalMansPlanTabelTime}</td>
            <td>-</td>
            <td>{totalMansPlanTime}</td>
          </tr>
        </tfoot>
      </table>
      <table className={style.table}>
        <thead>
          <tr>
            <th colSpan={2}>Настой часов, чел.-ч</th>
            <th rowSpan={2}>Заданно по эксплуатационному плану, чел.-ч</th>
            <th colSpan={2}>Выполнение эксплуатационного плана</th>
            <th colSpan={2}>Выполнение эксплуатационного плана с учетом всех выполненных работ</th>
          </tr>
          <tr>
            <th>по штатному расписанию</th>
            <th>по табелю</th>
            <th>чел.-ч</th>
            <th>%</th>
            <th>чел.-ч</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>-</td>
            <td>-</td>
            <td>
              всего по плану: <b>{totalMansPlanTime}</b>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>{totalMansPlanNormTime}</td>
            <td>{totalMansPlanTabelTime}</td>
            <td>
              в т.ч. по экспл.: <b>{planTimeExploitationTotal}</b>
            </td>
            <td>{factTimeExploitationTotal}</td>
            <td>{exploitationPercent}</td>
            <td>{totalFactTime}</td>
            <td>{totalFactTimePercent}</td>
          </tr>
          <tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
