"use client";
import { FC, useTransition } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";

import { useNotificationProvider } from "@/1shared/notification";
import { TWorkingManId, deleteWorkingMan as deleteWorkingManFromServer, usePpr } from "@/2entities/ppr";

interface IDeleteWorkingManButtonProps {
  id: TWorkingManId;
}

export const DeleteWorkingManButton: FC<IDeleteWorkingManButtonProps> = ({ id }) => {
  const { deleteWorkingMan } = usePpr();

  const [isLoading, startTransition] = useTransition();

  const { toast } = useNotificationProvider();

  const handleClick = async () => {
    startTransition(async () => {
      const answer = confirm("Вы уверены, что хотите удалить данные о работнике?");

      if (!answer) {
        return;
      }

      if (typeof id === "number") {
        const response = await deleteWorkingManFromServer(id);

        toast(response);

        if (response.type !== "error") {
          deleteWorkingMan(id);
        }
      } else {
        deleteWorkingMan(id);
      }
    });
  };

  return <Button loading={isLoading} onClick={handleClick} size="small" shape="circle" icon={<MinusOutlined />} />;
};
