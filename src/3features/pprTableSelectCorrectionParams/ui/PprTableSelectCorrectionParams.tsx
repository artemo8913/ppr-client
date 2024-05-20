"use client";
import { TMonth, months, monthsIntlRu } from "@/1shared/types/date";
import Select, { DefaultOptionType } from "antd/es/select";
import { FC } from "react";

type TCorrection = { value: number; month: TMonth };

interface IPprTableSelectCorrectionParamsProps {}

export const PprTableSelectCorrectionParams: FC<IPprTableSelectCorrectionParamsProps> = () => {
  return (
    <Select<TMonth, { value: TMonth } & DefaultOptionType>
      className="min-w-24"
      options={months.map((month) => ({ value: month, label: monthsIntlRu[month] }))}
    />
  );
};
