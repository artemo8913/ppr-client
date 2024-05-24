"use client";
import { ChangeEvent, FC, useCallback, useMemo } from "react";
import Input from "antd/es/input/Input";
import Select, { DefaultOptionType } from "antd/es/select";
import { stringToMonthIntlRu } from "@/1shared/types/date";
import { IPlanWorkPeriods, TCorrectionTransfer, planWorkPeriods } from "@/2entities/pprTable";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";

interface IPprTableTransfersControlProps<T> {
  objectId: string;
  fieldFrom: keyof T;
}
type TOption = { value: keyof IPlanWorkPeriods | null } & DefaultOptionType;

const planWorkCopy: (keyof IPlanWorkPeriods | null)[] = [...planWorkPeriods, null];
const optionsValueArray = planWorkCopy.filter((el) => el !== "year_plan_work");

export const PprTableTransfersControl: FC<IPprTableTransfersControlProps<IPlanWorkPeriods>> = ({
  fieldFrom,
  objectId,
}) => {
  const { getTransfers, updateTransfers } = usePprTableData();
  const transfers = getTransfers(objectId, fieldFrom);
  const { currentTimePeriod } = usePprTableViewSettings();
  const monthIndex = useMemo(
    () => optionsValueArray.findIndex((planWorkPeriod) => planWorkPeriod?.startsWith(currentTimePeriod)),
    [currentTimePeriod]
  );
  const nearestMonth = optionsValueArray[monthIndex + 1];
  const selectOptions: TOption[] = useMemo(
    () =>
      optionsValueArray.map((field, index) => {
        if (field === null) {
          return { value: null, label: "Не переносить" };
        }
        if (index <= monthIndex) {
          return { value: field, label: stringToMonthIntlRu(field || ""), disabled: true };
        }
        return { value: field, label: stringToMonthIntlRu(field || "") };
      }),
    [monthIndex]
  );
  const handleChange = useCallback(
    (transferIndex: number, value: number, fieldTo: keyof IPlanWorkPeriods | null) => {
      let newTransfers: TCorrectionTransfer<IPlanWorkPeriods>[] | null = null;
      if (!fieldTo) {
      } else if (!transfers) {
        newTransfers = [{ fieldTo, is_approved: false, value }];
      } else if (transfers.length >= 0) {
        newTransfers = [
          ...transfers.slice(0, transferIndex),
          { fieldTo, is_approved: false, value },
          ...transfers.slice(transferIndex + 1),
        ];
      }
      updateTransfers(objectId, fieldFrom, newTransfers);
    },
    [objectId, fieldFrom, transfers, updateTransfers]
  );

  if (transfers === null) {
    return (
      <PprTableSelectTransfer
        value={0}
        fieldTo={null}
        options={selectOptions}
        handleChange={(value, option) => handleChange(0, value, option)}
      />
    );
  } else if (Number(transfers?.length) > 0) {
    return transfers?.map((oneTransfer, index) => (
      <PprTableSelectTransfer
        key={oneTransfer.fieldTo + index}
        options={selectOptions}
        value={oneTransfer.value}
        fieldTo={oneTransfer.fieldTo}
        handleChange={(value, option) => handleChange(index, value, option)}
      />
    ));
  }
  return (
    <PprTableSelectTransfer
      value={0}
      fieldTo={nearestMonth}
      options={selectOptions}
      handleChange={(value, option) => handleChange(0, value, option)}
    />
  );
};

interface IPprTableSelectTransferProps {
  value: number;
  options: TOption[];
  fieldTo: keyof IPlanWorkPeriods | null;
  handleChange: (value: number, fieldTo: keyof IPlanWorkPeriods | null) => void;
}

export const PprTableSelectTransfer: FC<IPprTableSelectTransferProps> = ({ fieldTo, handleChange, value, options }) => {
  return (
    <div className="inline w-8">
      {Boolean(fieldTo !== null) && (
        <Input
          value={value}
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const newValue = Number(e.target.value);
            handleChange(newValue, fieldTo);
          }}
        />
      )}
      <Select
        className="min-w-24"
        value={fieldTo}
        options={options}
        onChange={(fieldTo) => handleChange(value, fieldTo)}
      />
    </div>
  );
};
