"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { ArrowDownOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TPprDataWorkId } from "@/2entities/ppr";

interface IIncreaseWorkPositionButtonProps {
  workId: TPprDataWorkId;
}

export const IncreaseWorkPositionButton: FC<IIncreaseWorkPositionButtonProps> = ({ workId }) => {
  const { increaseWorkPosition } = usePpr();

  const handleClick = () => {
    increaseWorkPosition(workId);
  };

  return <Button onClick={handleClick} size="small" shape="circle" icon={<ArrowDownOutlined />} />;
};
