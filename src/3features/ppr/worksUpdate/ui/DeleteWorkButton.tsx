"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TPprDataWorkId } from "@/2entities/ppr";

interface IDeleteWorkButtonProps {
  workId: TPprDataWorkId;
}

export const DeleteWorkButton: FC<IDeleteWorkButtonProps> = ({ workId }) => {
  const { deleteWork } = usePpr();

  const handleClick = useCallback(() => {
    deleteWork(workId);
  }, [deleteWork, workId]);

  return <Button onClick={handleClick} size="small" shape="circle" icon={<MinusOutlined />} />;
};
