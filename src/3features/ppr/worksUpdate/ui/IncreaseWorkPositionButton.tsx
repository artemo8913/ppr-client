"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { ArrowDownOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";

interface IIncreaseWorkPositionButtonProps {
  id?: string;
}

const IncreaseWorkPositionButton: FC<IIncreaseWorkPositionButtonProps> = ({ id }) => {
  const { increaseWorkPosition } = usePpr();

  const handleClick = useCallback(() => {
    if (id !== undefined) {
      increaseWorkPosition(id);
    }
  }, [id, increaseWorkPosition]);

  return <Button onClick={handleClick} size="small" shape="circle" icon={<ArrowDownOutlined />} />;
};

const IncreaseWorkPositionButtonMemo = memo(IncreaseWorkPositionButton);

export { IncreaseWorkPositionButtonMemo as IncreaseWorkPositionButton };
