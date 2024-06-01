"use client";
import { FC } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IWorkingManDeleteProps {
  id: string;
}

export const WorkingManDelete: FC<IWorkingManDeleteProps> = ({ id }) => {
  const { deleteWorkingMan } = usePprTableData();
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
