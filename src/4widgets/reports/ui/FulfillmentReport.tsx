"use client";
import clsx from "clsx";
import { FC, Fragment } from "react";
import { useSearchParams } from "next/navigation";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { getQuartal, TIME_PERIODS, translateRuTimePeriod } from "@/1shared/lib/date";
import { TDirection, TDistance, TDivisionType, TSubdivision } from "@/2entities/division";
import { getFactWorkFieldByTimePeriod, getPlanWorkFieldByTimePeriod, TPprDataForReport } from "@/2entities/ppr";

import { calculateFulfillmentReport } from "../lib/calculateFulfillmentReport";

import style from "./ReportTable.module.scss";

interface IFulfillmentReportProps {
  dataForReport?: TPprDataForReport[];
  divisions: {
    subdivisionsMap: Map<number, TSubdivision>;
    distancesMap: Map<number, TDistance>;
    directionsMap: Map<number, TDirection>;
  };
}

export const FulfillmentReport: FC<IFulfillmentReportProps> = ({ dataForReport = [], divisions }) => {
  const searchParams = useSearchParams();

  const divisionType = searchParams.get("divisionType");

  const { report, reportSettings } = calculateFulfillmentReport(
    dataForReport,
    divisions,
    (divisionType as TDivisionType) || undefined
  );

  return (
    <table className={style.ReportTable}>
      <thead>
        <tr>
          <th rowSpan={2}>Наименование работы</th>
          <th rowSpan={2}>Единица измерения</th>
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
          <tr key={data.common_work_id + data.divisionId}>
            {index in reportSettings && (
              <>
                <td rowSpan={reportSettings[index].rowSpan}>{data.name}</td>
                <td rowSpan={reportSettings[index].rowSpan}>{data.measure}</td>
              </>
            )}
            <td>{data.divisionId}</td>
            {TIME_PERIODS.map((timePeriod) => {
              const planWorkField = getPlanWorkFieldByTimePeriod(timePeriod);
              const factWorkField = getFactWorkFieldByTimePeriod(timePeriod);

              const quartalNumber = timePeriod !== "year" && getQuartal(timePeriod);

              return (
                <Fragment key={timePeriod}>
                  <td className={clsx(style.isVertical, "font-bold", style[`Q${quartalNumber}`])}>
                    {roundToFixed(data[planWorkField]) || ""}
                  </td>
                  <td className={clsx(style.isVertical, style.transparent, style[`Q${quartalNumber}`])}>
                    {roundToFixed(data[factWorkField]) || ""}
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
