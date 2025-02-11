"use client";
import { FC } from "react";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

import { usePprTableSettings } from "@/2entities/ppr";

interface IPprTableBacklightNotApprovedWorkProps {}

export const PprTableBacklightNotApprovedWork: FC<IPprTableBacklightNotApprovedWorkProps> = () => {
  const { isBacklightNotApprovedWork, setIsBacklightNotApprovedWork } = usePprTableSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsBacklightNotApprovedWork(e.target.checked);
  };
  return <Checkbox checked={isBacklightNotApprovedWork} onChange={handleChange} />;
};
