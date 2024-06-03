"use client";
import { FC } from "react";
import { usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

interface IPprTableCombineSameWorkProps {}

export const PprTableCombineSameWork: FC<IPprTableCombineSameWorkProps> = () => {
  const { isCombineSameWorks, setIsCombineSameWorks } = usePprTableViewSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsCombineSameWorks(e.target.checked);
  };
  return <Checkbox value={isCombineSameWorks} onChange={handleChange} />;
};
