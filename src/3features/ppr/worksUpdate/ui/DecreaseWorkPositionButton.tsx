"use client";
import { FC } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { ArrowUpOutlined } from "@ant-design/icons";

import { TPprDataWorkId, usePpr } from "@/2entities/ppr";

interface IDecreaseWorkPositionButtonProps {
  workId: TPprDataWorkId;
}

export const DecreaseWorkPositionButton: FC<IDecreaseWorkPositionButtonProps> = ({ workId }) => {
  const { decreaseWorkPosition } = usePpr();

  const handleClick = () => {
    decreaseWorkPosition(workId);
  };

  return (
    <Tooltip title="Переместить выше" placement="bottom">
      <Button onClick={handleClick} size="small" shape="circle" icon={<ArrowUpOutlined />} />
    </Tooltip>
  );
};
