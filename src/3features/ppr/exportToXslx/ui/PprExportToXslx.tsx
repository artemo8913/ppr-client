"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { FileExcelOutlined } from "@ant-design/icons";

interface IPprExportToXslxProps {}

export const PprExportToXslx: FC<IPprExportToXslxProps> = () => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const [exportUrl, setExportUrl] = useState("");

  const handleClick = useCallback(async () => {
    if (linkRef.current) {
      linkRef.current.click();
    }
  }, []);

  useEffect(() => setExportUrl(`${window?.location}/export`), []);

  return (
    <Tooltip title="Экспорт ЭУ-132 в excel">
      <a ref={linkRef} hidden href={exportUrl} target="_blank" />
      <Button icon={<FileExcelOutlined />} type="text" shape="circle" onClick={handleClick} />
    </Tooltip>
  );
};
