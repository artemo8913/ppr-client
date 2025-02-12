"use client";
import { FC } from "react";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

import { usePprTableSettings } from "@/2entities/ppr";

interface IPprTableCombineSameWorkProps {}

export const PprTableCombineSameWork: FC<IPprTableCombineSameWorkProps> = () => {
  const { isUniteSameWorks, setIsUniteSameWorks } = usePprTableSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsUniteSameWorks(e.target.checked);
  };
  return <Checkbox checked={isUniteSameWorks} onChange={handleChange} />;
};
