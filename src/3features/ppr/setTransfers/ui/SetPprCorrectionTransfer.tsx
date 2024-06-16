"use client";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { FC, useCallback, useMemo } from "react";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPlanWorkPeriods, TTransfer, planWorkFields } from "@/2entities/ppr";
import { SelectTransferParams, TOption } from "./SelectTransferParams";
import { SelectTransferStrategy, TTransferStrategyOption } from "./SelectTransferStrategy";
import { createNewTransferInstance } from "../lib/createNewTransferInstance";

interface ISetPprCorrectionTransferProps<T> {
  transferType: "plan" | "undone";
  transfers: TTransfer<IPlanWorkPeriods>[] | null | undefined;
  rowIndex: number;
  fieldFrom: keyof T;
}

const monthPlanPeriods = planWorkFields.filter((field) => field !== "year_plan_work");

export const SetPprCorrectionTransfer: FC<ISetPprCorrectionTransferProps<IPlanWorkPeriods>> = ({
  transferType,
  fieldFrom,
  transfers = null,
  rowIndex,
}) => {
  const { updateTransfers } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();
  const monthIndex = useMemo(
    () => monthPlanPeriods.findIndex((planWorkPeriod) => planWorkPeriod?.startsWith(currentTimePeriod)),
    [currentTimePeriod]
  );
  const nearestPlanPeriod = monthPlanPeriods[monthIndex + 1];

  const selectOptions: TOption<IPlanWorkPeriods>[] = useMemo(
    () =>
      monthPlanPeriods.map((field, index) => {
        if (index <= monthIndex) {
          return { value: field, label: stringToTimePeriodIntlRu(field || ""), disabled: true };
        }
        return { value: field, label: stringToTimePeriodIntlRu(field || "") };
      }),
    [monthIndex]
  );

  const handleTransfersChange = useCallback(
    (fieldTo: keyof IPlanWorkPeriods | null, value?: number, transferIndex?: number) => {
      let newTransfers: TTransfer<IPlanWorkPeriods>[] | null = null;
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
      updateTransfers(transferType, rowIndex, fieldFrom, newTransfers);
    },
    [rowIndex, fieldFrom, transferType, transfers, updateTransfers]
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
        transferType,
        rowIndex,
        fieldFrom,
        transfers?.filter((_, i) => i !== index)
      );
    },
    [updateTransfers, transferType, transfers, fieldFrom, rowIndex]
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
