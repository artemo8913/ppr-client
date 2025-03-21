"use client";
import { FC } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { EditOutlined } from "@ant-design/icons";

import { IPprData } from "@/2entities/ppr";

import { useWorkModal } from "./modal/WorkModalProvider";

interface IEditWorkButtonProps {
  work: IPprData;
}

export const EditWorkButton: FC<IEditWorkButtonProps> = ({ work }) => {
  const { openEditWorkModal } = useWorkModal();

  return (
    <Tooltip title="Редактировать строку с работой" placement="bottom">
      <Button
        onClick={() => {
          openEditWorkModal(work);
        }}
        size={"small"}
        shape={"circle"}
        icon={<EditOutlined />}
      />
    </Tooltip>
  );
};
