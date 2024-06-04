"use client";
import { FC } from "react";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

interface IPprTableCombineSameWorkProps {}

export const PprTableCombineSameWork: FC<IPprTableCombineSameWorkProps> = () => {
  const { isCombineSameWorks, setIsCombineSameWorks } = usePprTableSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsCombineSameWorks(e.target.checked);
  };
  return <Checkbox value={isCombineSameWorks} onChange={handleChange} />;
};
