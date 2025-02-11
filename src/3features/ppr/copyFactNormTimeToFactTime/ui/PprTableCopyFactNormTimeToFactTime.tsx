"use client";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { CopyOutlined } from "@ant-design/icons";

import { usePpr, usePprTableSettings } from "@/2entities/ppr";

export const PprTableCopyFactNormTimeToFactTime = () => {
  const { ppr, copyFactNormTimeToFactTime } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  const handleClick = () => {
    if (currentTimePeriod === "year") {
      return;
    }
    copyFactNormTimeToFactTime("NOT_FILLED", currentTimePeriod);
  };

  const isDisabled = currentTimePeriod === "year" || ppr?.months_statuses[currentTimePeriod] !== "fact_filling";

  return (
    <Tooltip title="Массово заполнить фактические трудозатраты исходя из нормы времени (для не заполненных значений)">
      <Button disabled={isDisabled} icon={<CopyOutlined />} type="text" shape="circle" onClick={handleClick} />
    </Tooltip>
  );
};
