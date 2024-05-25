"use client";
import { FC, useCallback, useMemo } from "react";
import { stringToTimePeriodIntlRu } from "@/1shared/types/date";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { IPlanWorkPeriods, TCorrectionTransfer, planWorkPeriods } from "@/2entities/pprTable";
import { SelectTransferParams, TOption } from "./SelectTransferParams";
import { SelectTransferStrategy, TTransferStrategyOption } from "./SelectTransferStrategy";

interface ITransfersControlProps<T> {
  objectId: string;
  fieldFrom: keyof T;
}

export const TransfersControl: FC<ITransfersControlProps<IPlanWorkPeriods>> = ({ fieldFrom, objectId }) => {
  const { getTransfers, updateTransfers } = usePprTableData();
  const transfers = getTransfers(objectId, fieldFrom);

  const { currentTimePeriod } = usePprTableViewSettings();
  const monthIndex = useMemo(
    () => planWorkPeriods.findIndex((planWorkPeriod) => planWorkPeriod?.startsWith(currentTimePeriod)),
    [currentTimePeriod]
  );
  const nearestPlanPeriod = planWorkPeriods[monthIndex + 1];

  const selectOptions: TOption<IPlanWorkPeriods>[] = useMemo(
    () =>
      planWorkPeriods.map((field, index) => {
        if (index <= monthIndex && field !== "year_plan_work") {
          return { value: field, label: stringToTimePeriodIntlRu(field || ""), disabled: true };
        }
        return { value: field, label: stringToTimePeriodIntlRu(field || "") };
      }),
    [monthIndex]
  );

  const handleTransfersChange = useCallback(
    (fieldTo: keyof IPlanWorkPeriods | null, value?: number, transferIndex?: number) => {
      let newTransfers: TCorrectionTransfer<IPlanWorkPeriods>[] | null = null;
      if (!fieldTo) {
      } else if (!transfers) {
        newTransfers = [{ fieldTo, is_approved: false, value: value || 0 }];
      } else if (transfers.length >= 0) {
        newTransfers = [
          ...transfers.slice(0, transferIndex),
          { fieldTo, is_approved: false, value: value || 0 },
          ...transfers.slice(transferIndex || 0 + 1),
        ];
      }
      updateTransfers(objectId, fieldFrom, newTransfers);
    },
    [objectId, fieldFrom, transfers, updateTransfers]
  );

  const handleStratagy = useCallback(
    (strategy: TTransferStrategyOption) => {
      if (strategy === "NULL") {
        handleTransfersChange(null);
      } else if (strategy === "PERIOD") {
        handleTransfersChange(nearestPlanPeriod);
      }
    },
    [handleTransfersChange, nearestPlanPeriod]
  );

  return (
    <div>
      <SelectTransferStrategy defaultValue={!transfers ? "NULL" : "PERIOD"} handleChange={handleStratagy} />
      {Boolean(Number(transfers?.length) > 0)
        ? transfers?.map((oneTransfer, index) => (
            <SelectTransferParams
              key={oneTransfer.fieldTo + index}
              options={selectOptions}
              value={oneTransfer.value}
              fieldTo={oneTransfer.fieldTo}
              handleChange={(fieldTo, value) => handleTransfersChange(fieldTo, value, index)}
            />
          ))
        : transfers && (
            <SelectTransferParams
              value={0}
              fieldTo={nearestPlanPeriod}
              options={selectOptions}
              handleChange={handleTransfersChange}
            />
          )}
    </div>
  );
};
