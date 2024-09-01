"use client";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { FC, useCallback, useMemo } from "react";

import { translateRuTimePeriod } from "@/1shared/lib/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { TPlanWorkPeriods, TPlanWorkPeriodsFields, TTransfer, planWorkFields } from "@/2entities/ppr";

import { SelectTransferParams, TOption } from "./SelectTransferParams";
import { SelectTransferStrategy, TTransferStrategyOption } from "./SelectTransferStrategy";
import { createNewTransferInstance } from "../lib/createNewTransferInstance";

interface ISetPprCorrectionTransferProps {
  id: string;
  fieldFrom: TPlanWorkPeriods;
  transfers?: TTransfer[] | null;
  transferType: "plan" | "undone";
}

const monthPlanPeriods = planWorkFields.filter((field) => field !== "year_plan_work");

export const SetPprCorrectionTransfer: FC<ISetPprCorrectionTransferProps> = ({
  id,
  fieldFrom,
  transfers = null,
  transferType,
}) => {
  const { updateTransfers } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();
  const monthIndex = useMemo(
    () => monthPlanPeriods.findIndex((planWorkPeriod) => planWorkPeriod?.startsWith(currentTimePeriod)),
    [currentTimePeriod]
  );
  const nearestPlanPeriod = monthPlanPeriods[monthIndex + 1];

  const selectOptions: TOption<TPlanWorkPeriods>[] = useMemo(
    () =>
      monthPlanPeriods.map((field, index) => {
        if (index <= monthIndex) {
          return { value: field, label: translateRuTimePeriod(field || ""), disabled: true };
        }
        return { value: field, label: translateRuTimePeriod(field || "") };
      }),
    [monthIndex]
  );

  const handleTransfersChange = useCallback(
    (fieldTo: keyof TPlanWorkPeriodsFields | null, value?: number, transferIndex?: number) => {
      let newTransfers: TTransfer[] | null = null;
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
      updateTransfers(id, fieldFrom, newTransfers, transferType);
    },
    [id, fieldFrom, transferType, transfers, updateTransfers]
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
        id,
        fieldFrom,
        transfers?.filter((_, i) => i !== index),
        transferType
      );
    },
    [updateTransfers, transferType, transfers, fieldFrom, id]
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
          handleDeleteTransfer={transferIndex === 0 ? null : () => deleteTransfer(transferIndex)}
        />
      ))}
      {transfers && <Button icon={<PlusOutlined />} onClick={addTransfer} />}
    </div>
  );
};
