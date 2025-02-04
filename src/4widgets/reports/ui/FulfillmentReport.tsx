import clsx from "clsx";
import { FC, Fragment } from "react";

import { translateRuTimePeriod } from "@/1shared/locale/date";
import { getQuartal, TIME_PERIODS } from "@/1shared/const/date";
import { IFulfillmentReportData, IFulfillmentReportSettings } from "@/1shared/providers/pprProvider";
import { getFactWorkFieldByTimePeriod, getPlanWorkFieldByTimePeriod } from "@/2entities/ppr";

import style from "./ReportTable.module.scss";

interface IFulfillmentReportProps {
  reportData: IFulfillmentReportData[];
  reportSettings: IFulfillmentReportSettings;
}

export const FulfillmentReport: FC<IFulfillmentReportProps> = ({ reportData, reportSettings }) => {
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
        {reportData.map((data, index) => (
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

              const quartalNumber = getQuartal(timePeriod);

              return (
                <Fragment key={timePeriod}>
                  <td className={clsx(style.isVertical, "font-bold", style[`Q${quartalNumber}`])}>
                    {data[planWorkField] || ""}
                  </td>
                  <td className={clsx(style.isVertical, style.transparent, style[`Q${quartalNumber}`])}>
                    {data[factWorkField] || ""}
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
