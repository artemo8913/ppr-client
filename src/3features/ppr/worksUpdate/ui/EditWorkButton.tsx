"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { EditOutlined } from "@ant-design/icons";

import { useWorkModal } from "@/1shared/providers/pprWorkModalProvider";
import { IPprData } from "@/2entities/ppr";

interface IEditWorkButtonProps {
  work: IPprData;
}

export const EditWorkButton: FC<IEditWorkButtonProps> = ({ work }) => {
  const { openEditWorkModal } = useWorkModal();

  return (
    <Button
      onClick={() => {
        openEditWorkModal(work);
      }}
      size={"small"}
      shape={"circle"}
      icon={<EditOutlined />}
    />
  );
};
