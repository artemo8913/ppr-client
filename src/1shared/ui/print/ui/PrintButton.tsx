"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { PrinterOutlined } from "@ant-design/icons";

interface IPrintButtonProps {}

export const PrintButton: FC<IPrintButtonProps> = () => {
  const handleClick = useCallback(async () => {
    if (window) {
      window.print();
    }
  }, []);

  return (
    <Tooltip title="Распечатать">
      <Button icon={<PrinterOutlined />} type="text" shape="circle" onClick={handleClick} />
    </Tooltip>
  );
};
