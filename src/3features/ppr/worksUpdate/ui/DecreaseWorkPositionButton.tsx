"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { ArrowUpOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";

interface IDecreaseWorkPositionButtonProps {
  workId: number | string;
}

const DecreaseWorkPositionButton: FC<IDecreaseWorkPositionButtonProps> = ({ workId }) => {
  const { decreaseWorkPosition } = usePpr();

  const handleClick = useCallback(() => {
    decreaseWorkPosition(workId);
  }, [workId, decreaseWorkPosition]);

  return <Button onClick={handleClick} size="small" shape="circle" icon={<ArrowUpOutlined />} />;
};

const DecreaseWorkPositionButtonMemo = memo(DecreaseWorkPositionButton);

export { DecreaseWorkPositionButtonMemo as DecreaseWorkPositionButton };
