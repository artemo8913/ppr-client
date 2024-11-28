"use client";
import { FC, useTransition } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { useNotificationProvider } from "@/1shared/providers/notificationProvider";
import { deletePprWork as deletePprWorkFromServer, TPprDataWorkId } from "@/2entities/ppr";

interface IDeleteWorkButtonProps {
  workId: TPprDataWorkId;
}

export const DeleteWorkButton: FC<IDeleteWorkButtonProps> = ({ workId }) => {
  const { deleteWork } = usePpr();

  const [isLoading, startTransition] = useTransition();

  const { toast } = useNotificationProvider();

  const handleClick = async () => {
    startTransition(async () => {
      if (typeof workId === "number") {
        const response = await deletePprWorkFromServer(workId);

        toast(response, response.type);
      }

      deleteWork(workId);
    });
  };

  return <Button loading={isLoading} onClick={handleClick} size="small" shape="circle" icon={<MinusOutlined />} />;
};
