import { FC } from "react";
import { TCorrectionItem } from "./CorrectionRaport";
import { IPlanWorkPeriods, IPprData } from "@/2entities/ppr";
import { SetPprCorrectionTransfer } from "@/3features/ppr/setTransfers";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";

interface IPlanCorrectionItemProps {
  correction: TCorrectionItem;
  fieldFrom: keyof IPlanWorkPeriods;
  name: string | undefined;
  measure: string | undefined;
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
  const rowIndex = correction.rowIndex;
  const transfers = correction.correctionData?.planTransfers;
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
              {transfer.value} {measure} {stringToTimePeriodIntlRu(transfer.fieldTo)}
              <span>{arr.length - 1 === index ? "." : ","}</span>
            </span>
          ))}
        </>
      )}
      {isEditable && (
        <SetPprCorrectionTransfer transferType="plan" transfers={transfers} rowIndex={rowIndex} fieldFrom={fieldFrom} />
      )}
    </li>
  );
};
