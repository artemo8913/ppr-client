"use client";
import { ChangeEvent, FC, useState } from "react";
import Input from "antd/es/input/Input";
import Select, { DefaultOptionType } from "antd/es/select";
import { stringToMonthIntlRu } from "@/1shared/types/date";
import { IPlanWorkPeriods, planWorkPeriods } from "@/2entities/pprTable";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IPprTableSelectTransfersProps<T> {
  objectId: string;
  fieldFrom: keyof T;
}

const planWorkCopy: (keyof IPlanWorkPeriods | null)[] = [...planWorkPeriods];
planWorkCopy.push(null);
const optionsValueArray = planWorkCopy.filter((el) => el !== "year_plan_work");

export const PprTableSelectTransfers: FC<IPprTableSelectTransfersProps<IPlanWorkPeriods>> = ({
  fieldFrom,
  objectId,
}) => {
  const { getTransfers, updateTransfers } = usePprTableData();
  const [value, setValue] = useState(0);
  const transfers = getTransfers(objectId, fieldFrom);

  if (transfers === null) {
  } else if (transfers?.length === 0) {
  } else if (Number(transfers?.length) > 0) {
  }

  return (
    <div className="inline w-8">
      <Input
        value={value}
        type="number"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setValue(Number(e.target.value));
        }}
        onBlur={(e: ChangeEvent<HTMLInputElement>) => {}}
      />
      <Select<keyof IPlanWorkPeriods, { value: keyof IPlanWorkPeriods | null } & DefaultOptionType>
        className="min-w-24"
        defaultValue={undefined}
        options={optionsValueArray.map((field) => {
          if (field === null) {
            return { value: null, label: "Не переносить" };
          }
          return { value: field, label: stringToMonthIntlRu(field || "") };
        })}
        onChange={(value) => {
          console.log(value);
        }}
      />
    </div>
  );
};
