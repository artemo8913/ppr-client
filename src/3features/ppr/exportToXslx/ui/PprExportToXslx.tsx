"use client";
import { FC, useCallback, useRef, useState } from "react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { FileExcelOutlined } from "@ant-design/icons";

interface IPprExportToXslxProps {}

export const PprExportToXslx: FC<IPprExportToXslxProps> = () => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const handleClick = useCallback(async () => {
    if (linkRef.current) {
      linkRef.current.click();
    }
  }, []);

  return (
    <Tooltip title="Экспорт excel">
      <a ref={linkRef} hidden href={`${window.location}/export`} target="_blank" />
      <Button icon={<FileExcelOutlined />} type="text" shape="circle" onClick={handleClick} />
    </Tooltip>
  );
};
