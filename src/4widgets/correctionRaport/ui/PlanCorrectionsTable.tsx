import { FC } from "react";

import { TPlanWorkPeriodsFields } from "@/2entities/ppr";
import { IPprMeta } from "@/1shared/providers/pprProvider";
import { roundToFixed } from "@/1shared/lib/math";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";

import { ICorrectionSummary, TCorrectionItem } from "./CorrectionRaport";

import style from "./CorrectionTable.module.scss";

interface IPlanCorrectionsTableProps {
  pprMeta: IPprMeta;
  isEditable?: boolean;
  summary: ICorrectionSummary;
  planCorrections: TCorrectionItem[];
  fieldFrom: keyof TPlanWorkPeriodsFields;
}

export const PlanCorrectionsTable: FC<IPlanCorrectionsTableProps> = ({
  pprMeta,
  summary,
  fieldFrom,
  isEditable,
  planCorrections,
}) => {
  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th rowSpan={2}>№ п.п</th>
          <th className={style.name} rowSpan={2}>
            Работа
          </th>
          <th className={style.location} rowSpan={2}>
            Место производства работ
          </th>
          <th className={style.measure} rowSpan={2}>
            Единица измерения
          </th>
          <th colSpan={2}>План</th>
          <th colSpan={2}>Откорректированный план</th>
          <th rowSpan={2}>+/-</th>
          <th className={style.correction} rowSpan={2}>
            Корректировка
          </th>
        </tr>
        <tr>
          <th>кол-во</th>
          <th>чел.-ч</th>
          <th>кол-во</th>
          <th>чел.-ч</th>
        </tr>
      </thead>
      <tbody>
        {planCorrections.map((correction) => {
          const planTransfers = correction.pprData[fieldFrom].planTransfers;

          return (
            <tr key={correction.pprData.id}>
              <td>{pprMeta.worksOrderForRowSpan[correction.pprData.id]}</td>
              <td>{correction.pprData.name}</td>
              <td>{correction.pprData.location}</td>
              <td>{correction.pprData.measure}</td>
              <td>{correction.firstCompareValue}</td>
              <td>{roundToFixed(correction.firstCompareValue * correction.pprData.norm_of_time)}</td>
              <td>{correction.secondCompareValue}</td>
              <td>{roundToFixed(correction.secondCompareValue * correction.pprData.norm_of_time)}</td>
              <td>{correction.firstCompareValue - correction.secondCompareValue}</td>
              <td>
                {isEditable ? (
                  <SetPprCorrectionTransfer
                    transferType="plan"
                    transfers={planTransfers}
                    workId={correction.pprData.id}
                    fieldFrom={fieldFrom}
                  />
                ) : (
                  <div>
                    {planTransfers?.map((transfer, index) => {
                      const month = translateRuTimePeriod(transfer.fieldTo);
                      const text =
                        transfer.value >= 0 ? `${transfer.value} на ${month}` : `${transfer.value} с ${month}`;
                      return <div key={index}>{text}</div>;
                    })}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot className="font-bold">
        <tr>
          <td colSpan={4}>Итого</td>
          <td>-</td>
          <td>{summary.plan}</td>
          <td>-</td>
          <td>{summary.fact}</td>
          <td>{roundToFixed(summary.fact - summary.plan)} чел.-ч</td>
          <td>-</td>
        </tr>
      </tfoot>
    </table>
  );
};
