import { FC } from "react";
import { TCorrectionItem } from "./CorrectionRaport";
import { TPlanWorkPeriodsFields } from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";
import { translateRuTimePeriod } from "@/1shared/lib/date";

interface IPlanCorrectionItemProps {
  correction: TCorrectionItem;
  fieldFrom: keyof TPlanWorkPeriodsFields;
  name?: string;
  measure?: string;
  isEditable?: boolean;
}

export const PlanCorrectionItem: FC<IPlanCorrectionItemProps> = ({
  correction,
  fieldFrom,
  measure,
  name,
  isEditable,
}) => {
  const planValue = correction.firstCompareValue;
  const correctedValue = correction.secondCompareValue;
  const objectId = correction.objectId;
  const transfers = correction.plan?.planTransfers;
  const isHaveTransfers = Boolean(transfers);

  return (
    <li key={objectId}>
      <span>
        {name}: план {planValue} {measure} изменить на {correctedValue} {measure}. Разницу {planValue - correctedValue}{" "}
        {measure}{" "}
      </span>
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
        <SetPprCorrectionTransfer transferType="plan" transfers={transfers} id={objectId} fieldFrom={fieldFrom} />
      )}
    </li>
  );
};
