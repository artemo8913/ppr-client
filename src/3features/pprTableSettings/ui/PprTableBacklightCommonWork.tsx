"use client";
import { FC } from "react";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

interface IPprTableBacklightCommonWorkProps {}

export const PprTableBacklightCommonWork: FC<IPprTableBacklightCommonWorkProps> = () => {
  const { isBacklightNotCommonWork, setIsBacklightNotCommonWork } = usePprTableSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsBacklightNotCommonWork(e.target.checked);
  };
  return <Checkbox checked={isBacklightNotCommonWork} onChange={handleChange} />;
};
