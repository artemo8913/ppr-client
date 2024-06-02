"use client";
import { FC } from "react";
import { usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import Slider from "antd/es/slider";

interface IPprTableSelectWidthProps {}

export const PprTableSelectWidth: FC<IPprTableSelectWidthProps> = () => {
  const { tableWidthPercent, setTableWidthPercent } = usePprTableViewSettings();
  return (
    <Slider
    className="w-52"
      value={tableWidthPercent}
      marks={{ 100: 100, 110: 110, 120: 120, 130: 130, 140: 140 }}
      min={100}
      max={140}
      onChange={setTableWidthPercent}
      step={5}
    />
  );
};
