"use client";
import { FC } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { CopyTwoTone } from "@ant-design/icons";

interface IPprCopyButtonProps {
  pprId: number;
}

export const PprCopyButton: FC<IPprCopyButtonProps> = (props) => {
  return (
    <Tooltip title="Копировать">
      <Button danger disabled icon={<CopyTwoTone className="cursor-pointer" />} onClick={() => {}} />
    </Tooltip>
  );
};
