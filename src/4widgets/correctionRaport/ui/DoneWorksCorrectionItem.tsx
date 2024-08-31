import { FC } from "react";
import { TCorrectionItem } from "./CorrectionRaport";
import { IPlanWorkPeriods, IPprData } from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";
import { translateRuTimePeriod } from "@/1shared/lib/date";

interface IDoneWorksCorrectionItemProps {
  correction: TCorrectionItem;
  fieldFrom: keyof IPlanWorkPeriods;
  name?: string;
  measure?: string;
  isEditable?: boolean;
}

export const DoneWorksCorrectionItem: FC<IDoneWorksCorrectionItemProps> = ({
  correction,
  fieldFrom,
  measure,
  name,
  isEditable,
}) => {
  const planWorkValue = correction.firstCompareValue;
  const factWorkValue = correction.secondCompareValue;
  const objectId = correction.objectId;
  const rowIndex = correction.rowIndex;
  const transfers = correction.correctionData?.undoneTransfers;
  const isHaveTransfers = Boolean(transfers);

  return (
    <li key={objectId}>
      <span>
        {name}: при плане {planWorkValue} {measure} факт составил {factWorkValue}. Разницу{" "}
        {Number(planWorkValue - factWorkValue)} {measure}
      </span>{" "}
      {!isEditable && !isHaveTransfers && "не переносить"}
      {!isEditable && isHaveTransfers && (
        <>
          <span>перенести на/с: </span>
          {transfers?.map((transfer, index, arr) => (
            <span key={transfer.fieldTo + index}>
              {transfer.value} {measure} {translateRuTimePeriod(transfer.fieldTo)}
              <span>{arr.length - 1 === index ? "." : ","}</span>
            </span>
          ))}
        </>
      )}
      {isEditable && (
        <SetPprCorrectionTransfer
          transferType="undone"
          transfers={transfers}
          rowIndex={rowIndex}
          fieldFrom={fieldFrom}
        />
      )}
    </li>
  );
};
