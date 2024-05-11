"use client";
import Select, { DefaultOptionType } from "antd/es/select";
import { FC } from "react";
import { TCorrectionView, usePprTableSettings } from "@/1shared/providers/pprTableProvider";

interface IPprTableSelectCorrectionViewProps {}

export const PprTableSelectCorrectionView: FC<IPprTableSelectCorrectionViewProps> = () => {
  const { correctionView, setCorrectionView } = usePprTableSettings();
  return (
    <Select<TCorrectionView, { value: TCorrectionView } & DefaultOptionType>
      className="min-w-24"
      options={[
        { value: "INITIAL_PLAN", label: "Исходный план" },
        { value: "INITIAL_PLAN_WITH_ARROWS", label: "Исходный план со стрелками" },
        { value: "CORRECTED_PLAN", label: "Откорректированный план" },
        { value: "CORRECTED_PLAN_WITH_ARROWS", label: "Откорректированный план со стрелками" },
      ]}
      value={correctionView}
      onChange={setCorrectionView}
    />
  );
};
