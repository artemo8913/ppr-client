"use client";
import { FC, useTransition } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";

import { useNotificationProvider } from "@/1shared/notification";
import { deletePprWork as deletePprWorkFromServer, TPprDataWorkId, usePpr } from "@/2entities/ppr";

interface IDeleteWorkButtonProps {
  workId: TPprDataWorkId;
}

export const DeleteWorkButton: FC<IDeleteWorkButtonProps> = ({ workId }) => {
  const { deleteWork } = usePpr();

  const [isLoading, startTransition] = useTransition();

  const { toast } = useNotificationProvider();

  const handleClick = async () => {
    startTransition(async () => {
      const answer = confirm("Вы уверены, что хотите удалить работу?");

      if (!answer) {
        return;
      }

      if (typeof workId === "number") {
        const response = await deletePprWorkFromServer(workId);

        toast(response);

        if (response.type !== "error") {
          deleteWork(workId);
        }
      } else {
        deleteWork(workId);
      }
    });
  };

  return <Button loading={isLoading} onClick={handleClick} size="small" shape="circle" icon={<MinusOutlined />} />;
};
