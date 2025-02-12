"use client";
import { FC } from "react";
import Slider from "antd/es/slider";

import { usePprTableSettings } from "@/2entities/ppr";

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
