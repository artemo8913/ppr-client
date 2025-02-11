"use client";
import { FC } from "react";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

import { usePprTableSettings } from "@/2entities/ppr";

interface IPprTableBacklightCommonWorkProps {}

export const PprTableBacklightNotCommonWork: FC<IPprTableBacklightCommonWorkProps> = () => {
  const { isBacklightNotCommonWork, setIsBacklightNotCommonWork } = usePprTableSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsBacklightNotCommonWork(e.target.checked);
  };
  return <Checkbox checked={isBacklightNotCommonWork} onChange={handleChange} />;
};
