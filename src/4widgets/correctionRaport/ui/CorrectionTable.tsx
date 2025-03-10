import { FC, Fragment } from "react";

import { translateRuTimePeriod } from "@/1shared/lib/date/locale";
import { IPprMeta, TPlanWorkPeriodsFields, translateRuPprBranchName } from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";

import { CorrectionTableSummaryRow } from "./CorrectionTableSummaryRow";
import { ICorrectionRaportMeta, TCorrectionItem } from "../model/correctionRaport.types";

import style from "./CorrectionTable.module.scss";

interface ICorrectionTableProps {
  pprMeta: IPprMeta;
  isEditable?: boolean;
  transferType: "plan" | "undone";
  raportMeta: ICorrectionRaportMeta;
  planCorrections: TCorrectionItem[];
  fieldFrom: keyof TPlanWorkPeriodsFields;
  isShowSubtotal?: {
    branch: boolean;
    subbranch: boolean;
  };
}

export const CorrectionTable: FC<ICorrectionTableProps> = ({
  pprMeta,
  isShowSubtotal: showTotal,
  fieldFrom,
  raportMeta,
  isEditable,
  transferType,
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
          <th colSpan={2}>{transferType === "undone" ? "Факт" : "Откорректированный план"}</th>
          <th rowSpan={2}>+/-, ед.изм</th>
          <th rowSpan={2}>+/-, чел.-ч</th>
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
        {planCorrections.map((correction, index) => {
          const transfers =
            transferType === "undone"
              ? correction.pprData[fieldFrom].undoneTransfers
              : correction.pprData[fieldFrom].planTransfers;

          return (
            <Fragment key={correction.pprData.id}>
              <tr>
                <td>{pprMeta.worksOrderForRowSpan[correction.pprData.id]}</td>
                <td>{correction.pprData.name}</td>
                <td>{correction.pprData.location}</td>
                <td>{correction.pprData.measure}</td>
                <td>{correction.planWork}</td>
                <td>{correction.planTime}</td>
                <td>{correction.factWork}</td>
                <td>{correction.factTime}</td>
                <td>{correction.workDiff}</td>
                <td>{correction.timeDiff}</td>
                <td>
                  {isEditable ? (
                    <SetPprCorrectionTransfer
                      transfers={transfers}
                      fieldFrom={fieldFrom}
                      transferType={transferType}
                      pprData={correction.pprData}
                      workId={correction.pprData.id}
                    />
                  ) : (
                    <div>
                      {transfers?.map((transfer, index) => {
                        const month = translateRuTimePeriod(transfer.fieldTo);
                        const text =
                          transfer.value >= 0 ? `${transfer.value} на ${month}` : `${transfer.value} с ${month}`;
                        return <div key={index}>{text}</div>;
                      })}
                    </div>
                  )}
                </td>
              </tr>
              {index in raportMeta.subbranches && showTotal?.subbranch && (
                <CorrectionTableSummaryRow
                  text={`Итог подраздела "${raportMeta.subbranches[index].name}"`}
                  planTime={raportMeta.subbranches[index].planTime}
                  factTime={raportMeta.subbranches[index].factTime}
                  timeDiff={raportMeta.subbranches[index].timeDiff}
                />
              )}
              {index in raportMeta.branches && showTotal?.branch && (
                <CorrectionTableSummaryRow
                  text={`Итог раздела "${translateRuPprBranchName(raportMeta.branches[index].name)}"`}
                  planTime={raportMeta.branches[index].planTime}
                  factTime={raportMeta.branches[index].factTime}
                  timeDiff={raportMeta.branches[index].timeDiff}
                />
              )}
            </Fragment>
          );
        })}
      </tbody>
      <tfoot className="font-bold">
        <CorrectionTableSummaryRow
          text="Итого"
          planTime={raportMeta.total.planTime}
          factTime={raportMeta.total.factTime}
          timeDiff={raportMeta.total.timeDiff}
        />
      </tfoot>
    </table>
  );
};
