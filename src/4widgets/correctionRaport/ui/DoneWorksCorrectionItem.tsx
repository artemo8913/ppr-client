import { FC } from "react";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { TPlanWorkPeriodsFields } from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";

import { TCorrectionItem } from "./CorrectionRaport";

interface IDoneWorksCorrectionItemProps {
  correction: TCorrectionItem;
  fieldFrom: keyof TPlanWorkPeriodsFields;
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
  const transfers = correction.plan?.undoneTransfers;
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
        <SetPprCorrectionTransfer transferType="undone" transfers={transfers} id={objectId} fieldFrom={fieldFrom} />
      )}
    </li>
  );
};
