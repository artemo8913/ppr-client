"use client";
import { FC } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";
import Button from "antd/es/button";

interface IWorkingManDeleteProps {
  id: string;
}

export const WorkingManDelete: FC<IWorkingManDeleteProps> = ({ id }) => {
  const isManCanBeDeleted = true;
  return (
    <Tooltip title="Удалить">
      <Button
        disabled={!isManCanBeDeleted}
        icon={<DeleteTwoTone className="cursor-pointer" />}
        onClick={() => console.log(`Удаляем ${id}`)}
      />
    </Tooltip>
  );
};
