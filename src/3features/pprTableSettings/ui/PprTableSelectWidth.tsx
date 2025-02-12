"use client";
import { FC } from "react";
import Slider from "antd/es/slider";
import { usePprTableSettings } from "@/2entities/ppr";

interface IPprTableSelectWidthProps {}

export const PprTableSelectWidth: FC<IPprTableSelectWidthProps> = () => {
  const { tableWidthPercent, setTableWidthPercent } = usePprTableSettings();
  return (
    <Slider
      className="w-96"
      value={tableWidthPercent}
      marks={{
        100: 100,
        110: 110,
        120: 120,
        130: 130,
        140: 140,
        150: 150,
        160: 160,
        170: 170,
        180: 180,
        190: 190,
        200: 200,
      }}
      min={100}
      max={200}
      onChange={setTableWidthPercent}
      step={5}
    />
  );
};
