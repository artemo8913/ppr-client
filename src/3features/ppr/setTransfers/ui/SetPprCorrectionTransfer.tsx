"use client";
import { FC, useCallback, useMemo } from "react";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPlanWorkPeriods, TCorrectionTransfer, planWorkPeriods } from "@/2entities/ppr";
import { SelectTransferParams, TOption } from "./SelectTransferParams";
import { SelectTransferStrategy, TTransferStrategyOption } from "./SelectTransferStrategy";
import { createNewTransferInstance } from "../lib/createNewTransferInstance";
import { PlusOutlined } from "@ant-design/icons";
import Button from "antd/es/button";

interface ISetPprCorrectionTransferProps<T> {
  objectId: string;
  fieldFrom: keyof T;
}

export const SetPprCorrectionTransfer: FC<ISetPprCorrectionTransferProps<IPlanWorkPeriods>> = ({
  fieldFrom,
  objectId,
}) => {
  const { getTransfers, updateTransfers } = usePpr();
  const transfers = getTransfers(objectId, fieldFrom);

  const { currentTimePeriod } = usePprTableSettings();
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
        null;
      } else if (!transfers) {
        newTransfers = [createNewTransferInstance(fieldTo, value)];
      } else if (transferIndex !== undefined) {
        newTransfers = [
          ...transfers.slice(0, transferIndex),
          createNewTransferInstance(fieldTo, value),
          ...transfers.slice(transferIndex + 1),
        ];
      }
      updateTransfers(objectId, fieldFrom, newTransfers);
    },
    [objectId, fieldFrom, transfers, updateTransfers]
  );

  const addTransfer = useCallback(() => {
    handleTransfersChange(nearestPlanPeriod, 0, transfers?.length || 0 + 1);
  }, [transfers, nearestPlanPeriod, handleTransfersChange]);

  const deleteTransfer = useCallback(
    (index: number) => {
      if (transfers === null) {
        return;
      }
      updateTransfers(
        objectId,
        fieldFrom,
        transfers?.filter((_, i) => i !== index)
      );
    },
    [updateTransfers, transfers, fieldFrom, objectId]
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
    <div className="inline-flex flex-wrap gap-4">
      <SelectTransferStrategy defaultValue={!transfers ? "NULL" : "PERIOD"} handleChange={handleStratagy} />
      {transfers?.map((oneTransfer, transferIndex) => (
        <SelectTransferParams
          key={oneTransfer.fieldTo + transferIndex}
          options={selectOptions}
          value={oneTransfer.value}
          fieldTo={oneTransfer.fieldTo}
          handleChange={(fieldTo, value) => handleTransfersChange(fieldTo, value, transferIndex)}
          handleAddTransfer={addTransfer}
          handleDeleteTransfer={transferIndex === 0 ? undefined : () => deleteTransfer(transferIndex)}
        />
      ))}
      {transfers && <Button icon={<PlusOutlined />} onClick={addTransfer} />}
    </div>
  );
};
