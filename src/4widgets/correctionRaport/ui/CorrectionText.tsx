import { FC } from "react";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { translateRuTimePeriod } from "@/1shared/lib/date/locale";
import { TPlanWorkPeriodsFields } from "@/2entities/ppr";

import { ICorrectionRaportMeta, TCorrectionItem } from "../model/correctionRaport.types";

interface ICorrectionTextProps {
  type: "undone" | "plan";
  meta: ICorrectionRaportMeta;
  corrections: TCorrectionItem[];
  fieldFrom: keyof TPlanWorkPeriodsFields;
}

export const CorrectionText: FC<ICorrectionTextProps> = ({ type, fieldFrom, meta: summary, corrections }) => {
  return (
    <ol>
      {corrections.map((correction, index) => {
        const transfers =
          type === "plan" ? correction.pprData[fieldFrom].planTransfers : correction.pprData[fieldFrom].undoneTransfers;

        const isHaveTransfers = Boolean(transfers);

        const infoText =
          type === "plan"
            ? `${correction.pprData.name} (${correction.pprData.location}), ${correction.pprData.measure} - план ${correction.planWork} (${correction.planTime} чел.-ч) изменить на ${correction.factWork} (${correction.factWork} чел.-ч). Разницу ${correction.workDiff}`
            : `${correction.pprData.name} (${correction.pprData.location}), ${correction.pprData.measure} - при плане ${correction.planWork} (${correction.planTime} чел.-ч) факт составил ${correction.factWork} (${correction.factWork} чел.-ч). Разницу ${correction.workDiff}`;

        return (
          <li key={correction.pprData.id}>
            {`${index + 1}. `}
            <span>{infoText}</span>
            {!isHaveTransfers && " не переносить."}
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
      <div className="font-semibold">Итого: {roundToFixed(summary.total.timeDiff)} чел.-ч.</div>
    </ol>
  );
};
