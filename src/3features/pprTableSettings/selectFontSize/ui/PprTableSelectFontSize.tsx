"use client";
import { FC } from "react";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import Slider from "antd/es/slider";

interface IPprTableSelectFontSizeProps {}

export const PprTableSelectFontSize: FC<IPprTableSelectFontSizeProps> = () => {
  const { fontSizePx, setFontSizePx } = usePprTableSettings();
  return (
    <Slider
      className="w-52"
      value={fontSizePx}
      marks={{ 8: 8, 10: 10, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20 }}
      min={8}
      max={20}
      onChange={setFontSizePx}
      step={1}
    />
  );
};
