"use client";
import Select from "antd/es/select";
import { FC } from "react";

import { OptionType } from "@/1shared/lib/form/TOptionType";
import { TPprView, usePprTableSettings } from "@/2entities/ppr";

interface IPprTableSelectCorrectionViewProps {}

export const PprTableSelectCorrectionView: FC<IPprTableSelectCorrectionViewProps> = () => {
  const { pprView, setPprView } = usePprTableSettings();

  return (
    <Select<TPprView, OptionType<TPprView>>
      className="min-w-24"
      options={[
        { value: "INITIAL_PLAN", label: "Исходный план" },
        { value: "INITIAL_PLAN_WITH_ARROWS", label: "Исходный план со стрелками" },
        { value: "CORRECTED_PLAN", label: "Откорректированный план" },
        { value: "CORRECTED_PLAN_WITH_ARROWS", label: "Откорректированный план со стрелками" },
      ]}
      value={pprView}
      onChange={setPprView}
    />
  );
};
