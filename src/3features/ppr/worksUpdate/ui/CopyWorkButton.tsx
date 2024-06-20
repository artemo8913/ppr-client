"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { CopyOutlined } from "@ant-design/icons";
import { usePpr } from "@/1shared/providers/pprProvider";

interface ICopyWorkButtonProps extends React.ComponentProps<typeof Button> {
  rowIndex?: number;
}

const CopyWorkButton: FC<ICopyWorkButtonProps> = ({ rowIndex }) => {
  const { copyWork } = usePpr();
  const handleClick = useCallback(() => {
    rowIndex !== undefined && copyWork(rowIndex);
  }, [copyWork, rowIndex]);
  return <Button onClick={handleClick} size="small" shape="circle" icon={<CopyOutlined />} />;
};

const CopyWorkButtonMemo = memo(CopyWorkButton);

export { CopyWorkButtonMemo as CopyWorkButton };
