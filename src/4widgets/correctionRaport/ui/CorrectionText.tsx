import { FC } from "react";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { translateRuTimePeriod } from "@/1shared/lib/date/locale";
import { TPlanWorkPeriodsFields } from "@/2entities/ppr";

import { ICorrectionSummary, TCorrectionItem } from "../model/correctionReport.types";

interface ICorrectionTextProps {
  type: "undone" | "plan";
  summary: ICorrectionSummary;
  corrections: TCorrectionItem[];
  fieldFrom: keyof TPlanWorkPeriodsFields;
}

export const CorrectionText: FC<ICorrectionTextProps> = ({ type, fieldFrom, summary, corrections }) => {
  return (
    <ol>
      {corrections.map((correction, index) => {
        const firstValue = correction.firstCompareValue;

        const firstTime = roundToFixed(firstValue * correction.pprData.norm_of_time);

        const secondValue = correction.secondCompareValue;

        const secondTime = roundToFixed(secondValue * correction.pprData.norm_of_time);

        const transfers =
          type === "plan" ? correction.pprData[fieldFrom].planTransfers : correction.pprData[fieldFrom].undoneTransfers;

        const isHaveTransfers = Boolean(transfers);

        const infoText =
          type === "plan"
            ? `${correction.pprData.name} (${correction.pprData.location}), ${
                correction.pprData.measure
              } - план ${firstValue} (${firstTime} чел.-ч) изменить на ${secondValue} (${secondTime} чел.-ч). Разницу ${roundToFixed(
                firstValue - secondValue
              )}`
            : `${correction.pprData.name} (${correction.pprData.location}), ${
                correction.pprData.measure
              } - при плане ${firstValue} (${firstTime} чел.-ч) факт составил ${secondValue} (${secondTime} чел.-ч). Разницу ${roundToFixed(
                firstValue - secondValue
              )}`;

        return (
          <li key={correction.pprData.id}>
            {`${index + 1}. `}
            <span>{infoText}</span>
            {!isHaveTransfers && " не переносить"}
            {isHaveTransfers && (
              <>
                {" перенести: "}
                {transfers?.map((transfer, index, arr) => {
                  const month = translateRuTimePeriod(transfer.fieldTo);
                  const text = transfer.value >= 0 ? `${transfer.value} на ${month}` : `${transfer.value} с ${month}`;
                  return (
                    <span key={index}>
                      {text}
                      {arr.length - 1 === index ? "." : ", "}
                    </span>
                  );
                })}
              </>
            )}
          </li>
        );
      })}
      <div className="font-semibold">
        Итоговая разница в трудозатратах составляет: {roundToFixed(summary.fact - summary.plan)} чел.-ч.
      </div>
    </ol>
  );
};
