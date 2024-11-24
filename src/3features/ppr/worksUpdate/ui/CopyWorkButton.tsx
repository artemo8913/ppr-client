"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { CopyOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TPprDataWorkId } from "@/2entities/ppr";

interface ICopyWorkButtonProps {
  workId: TPprDataWorkId;
}

export const CopyWorkButton: FC<ICopyWorkButtonProps> = ({ workId }) => {
  const { copyWork } = usePpr();

  const handleClick = useCallback(() => {
    copyWork(workId);
  }, [copyWork, workId]);

  return <Button onClick={handleClick} size="small" shape="circle" icon={<CopyOutlined />} />;
};
