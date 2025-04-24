"use client";
import clsx from "clsx";
import { FC, Fragment } from "react";
import { useSearchParams } from "next/navigation";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { translateRuTimePeriod } from "@/1shared/lib/date/locale";
import { getQuartal, TIME_PERIODS } from "@/1shared/lib/date";
import { getFactTimeFieldByTimePeriod, getPlanTimeFieldByTimePeriod, TPprDataForReport } from "@/2entities/ppr";
import { TDivisionType } from "@/2entities/division";

import { calculateLaborCost } from "../lib/calculateLaborCost";

import style from "./ReportTable.module.scss";

interface ILaborCostReportProps {
  dataForReport?: TPprDataForReport[];
  filterLevel?: TDivisionType;
}

export const LaborCostReport: FC<ILaborCostReportProps> = ({ dataForReport = [] }) => {
  const searchParams = useSearchParams();

  const divisionType = (searchParams.get("divisionType") as TDivisionType) || undefined;

  const { report, reportSettings } = calculateLaborCost(dataForReport, divisionType);

  return (
    <table className={style.ReportTable}>
      <thead>
        <tr>
          <th rowSpan={2}>Наименование</th>
          <th rowSpan={2}>Подразделение</th>
          {TIME_PERIODS.map((month) => (
            <th key={month} colSpan={2}>
              {translateRuTimePeriod(month)}
            </th>
          ))}
        </tr>
        <tr>
          {TIME_PERIODS.map((timePeriod) => (
            <Fragment key={timePeriod}>
              <th className={style.isVertical}>план</th>
              <th className={style.isVertical}>факт</th>
            </Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {report.map((data, index) => (
          <tr key={data.branch + data.name + data.divisionType + data.divisionId}>
            {index in reportSettings && <td rowSpan={reportSettings[index].rowSpan}>{data.name}</td>}
            <td>{data.divisionData.shortName}</td>
            {TIME_PERIODS.map((timePeriod) => {
              const plantimeField = getPlanTimeFieldByTimePeriod(timePeriod);
              const factTimeField = getFactTimeFieldByTimePeriod(timePeriod);

              const quartalNumber = timePeriod !== "year" && getQuartal(timePeriod);

              return (
                <Fragment key={timePeriod}>
                  <td className={clsx(style.isVertical, "font-bold", style[`Q${quartalNumber}`])}>
                    {roundToFixed(data.divisionData[plantimeField], 0) || ""}
                  </td>
                  <td className={clsx(style.isVertical, style.transparent, style[`Q${quartalNumber}`])}>
                    {roundToFixed(data.divisionData[factTimeField], 0) || ""}
                  </td>
                </Fragment>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
