"use client";
import { FC } from "react";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";

import { usePprTableSettings } from "@/2entities/ppr";

interface IPprTableBacklightRowAndCellOnHoverProps {}

export const PprTableBacklightRowAndCellOnHover: FC<IPprTableBacklightRowAndCellOnHoverProps> = () => {
  const { isBacklightRowAndCellOnHover, setIsBacklightRowAndCellOnHover } = usePprTableSettings();

  const handleChange: CheckboxProps["onChange"] = (e) => {
    setIsBacklightRowAndCellOnHover(e.target.checked);
  };
  return <Checkbox checked={isBacklightRowAndCellOnHover} onChange={handleChange} />;
};
