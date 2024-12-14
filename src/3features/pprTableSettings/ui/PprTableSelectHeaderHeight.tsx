"use client";
import { FC } from "react";
import Slider from "antd/es/slider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

interface IPprTableSelectHeaderHeightProps {}

export const PprTableSelectHeaderHeight: FC<IPprTableSelectHeaderHeightProps> = () => {
  const { headerHeightPx, setHeaderHeightPx } = usePprTableSettings();
  return (
    <Slider
      className="w-52"
      value={headerHeightPx}
      marks={{ 200: 200, 250: 250, 300: 300, 350: 350, 400: 400 }}
      min={200}
      max={400}
      onChange={setHeaderHeightPx}
      step={50}
    />
  );
};
