"use client";
import { FC } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { usePpr } from "@/1shared/providers/pprProvider";

interface IWorkingManDeleteProps {
  id: string;
}

export const WorkingManDelete: FC<IWorkingManDeleteProps> = ({ id }) => {
  const { deleteWorkingMan } = usePpr();
  const isManCanBeDeleted = true;
  return (
    <Tooltip title="Удалить">
      <Button
        disabled={!isManCanBeDeleted}
        icon={<DeleteTwoTone className="cursor-pointer" />}
        onClick={() => deleteWorkingMan(id)}
      />
    </Tooltip>
  );
};
