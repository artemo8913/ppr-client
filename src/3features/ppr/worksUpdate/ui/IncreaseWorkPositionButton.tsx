"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { ArrowDownOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TPprDataWorkId } from "@/2entities/ppr";

interface IIncreaseWorkPositionButtonProps {
  workId: TPprDataWorkId;
}

const IncreaseWorkPositionButton: FC<IIncreaseWorkPositionButtonProps> = ({ workId }) => {
  const { increaseWorkPosition } = usePpr();

  const handleClick = useCallback(() => {
    increaseWorkPosition(workId);
  }, [workId, increaseWorkPosition]);

  return <Button onClick={handleClick} size="small" shape="circle" icon={<ArrowDownOutlined />} />;
};

const IncreaseWorkPositionButtonMemo = memo(IncreaseWorkPositionButton);

export { IncreaseWorkPositionButtonMemo as IncreaseWorkPositionButton };
