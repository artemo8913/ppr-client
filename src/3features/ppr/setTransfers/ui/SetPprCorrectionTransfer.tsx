"use client";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { FC, useCallback, useMemo } from "react";

import { TOptionType } from "@/1shared/types/TOptionType";
import { getTimePeriodFromString } from "@/1shared/const/date";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { checkIsTimePeriodAvailableToTransfer, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { TPlanWorkPeriods, TPlanWorkPeriodsFields, TTransfer, PLAN_WORK_FIELDS, TPprDataWorkId } from "@/2entities/ppr";

import { SelectTransferParams } from "./SelectTransferParams";
import { SelectTransferStrategy, TTransferStrategyOption } from "./SelectTransferStrategy";
import { createNewTransferInstance } from "../lib/createNewTransferInstance";

interface ISetPprCorrectionTransferProps {
  workId: TPprDataWorkId;
  fieldFrom: TPlanWorkPeriods;
  transfers?: TTransfer[] | null;
  transferType: "plan" | "undone";
}

const MONTH_PLAN_WORK_FIELDS = PLAN_WORK_FIELDS.filter((field) => field !== "year_plan_work");

export const SetPprCorrectionTransfer: FC<ISetPprCorrectionTransferProps> = ({
  workId,
  fieldFrom,
  transfers = null,
  transferType,
}) => {
  const { ppr, updateTransfers } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  const monthIndex = useMemo(
    () => MONTH_PLAN_WORK_FIELDS.findIndex((planWorkPeriod) => planWorkPeriod?.startsWith(currentTimePeriod)),
    [currentTimePeriod]
  );

  const nextPlanPeriodField = MONTH_PLAN_WORK_FIELDS[monthIndex + 1];

  const selectOptions: TOptionType<TPlanWorkPeriods>[] = MONTH_PLAN_WORK_FIELDS.map((field) => {
    const timePeriod = getTimePeriodFromString(field);

    const disabled =
      ppr !== null && timePeriod ? !checkIsTimePeriodAvailableToTransfer(timePeriod, ppr.months_statuses) : true;

    return {
      value: field,
      label: translateRuTimePeriod(field),
      disabled,
    };
  });

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
      updateTransfers(workId, fieldFrom, newTransfers, transferType);
    },
    [workId, fieldFrom, transferType, transfers, updateTransfers]
  );

  const addTransfer = useCallback(() => {
    handleTransfersChange(nextPlanPeriodField, 0, transfers?.length || 0 + 1);
  }, [transfers, nextPlanPeriodField, handleTransfersChange]);

  const deleteTransfer = useCallback(
    (index: number) => {
      if (transfers === null) {
        return;
      }
      updateTransfers(
        workId,
        fieldFrom,
        transfers?.filter((_, i) => i !== index),
        transferType
      );
    },
    [updateTransfers, transferType, transfers, fieldFrom, workId]
  );

  const handleStrategy = useCallback(
    (strategy: TTransferStrategyOption) => {
      if (strategy === "NULL") {
        handleTransfersChange(null);
      } else if (strategy === "PERIOD") {
        handleTransfersChange(nextPlanPeriodField);
      }
    },
    [handleTransfersChange, nextPlanPeriodField]
  );

  return (
    <div className="flex-wrap gap-2">
      <SelectTransferStrategy defaultValue={!transfers ? "NULL" : "PERIOD"} handleChange={handleStrategy} />
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
