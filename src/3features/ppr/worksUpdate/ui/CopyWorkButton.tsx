"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { CopyOutlined } from "@ant-design/icons";

import { TPprDataWorkId, usePpr } from "@/2entities/ppr";

interface ICopyWorkButtonProps {
  workId: TPprDataWorkId;
}

export const CopyWorkButton: FC<ICopyWorkButtonProps> = ({ workId }) => {
  const { copyWork } = usePpr();

  const handleClick = () => {
    copyWork(workId);
  };

  return <Button onClick={handleClick} size="small" shape="circle" icon={<CopyOutlined />} />;
};
