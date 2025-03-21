"use client";
import { FC } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { ArrowDownOutlined } from "@ant-design/icons";

import { TPprDataWorkId, usePpr } from "@/2entities/ppr";

interface IIncreaseWorkPositionButtonProps {
  workId: TPprDataWorkId;
}

export const IncreaseWorkPositionButton: FC<IIncreaseWorkPositionButtonProps> = ({ workId }) => {
  const { increaseWorkPosition } = usePpr();

  const handleClick = () => {
    increaseWorkPosition(workId);
  };

  return (
    <Tooltip title="Переместить ниже" placement="bottom">
      <Button onClick={handleClick} size="small" shape="circle" icon={<ArrowDownOutlined />} />
    </Tooltip>
  );
};
