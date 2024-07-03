"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { CopyOutlined } from "@ant-design/icons";
import { usePpr } from "@/1shared/providers/pprProvider";

interface ICopyWorkButtonProps extends React.ComponentProps<typeof Button> {
  id?: string;
}

const CopyWorkButton: FC<ICopyWorkButtonProps> = ({ id }) => {
  const { copyWork } = usePpr();
  const handleClick = useCallback(() => {
    id !== undefined && copyWork(id);
  }, [copyWork, id]);
  return <Button onClick={handleClick} size="small" shape="circle" icon={<CopyOutlined />} />;
};

const CopyWorkButtonMemo = memo(CopyWorkButton);

export { CopyWorkButtonMemo as CopyWorkButton };
