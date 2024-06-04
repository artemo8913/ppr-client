"use client";
import { FC } from "react";
import { useSession } from "next-auth/react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { isPprInUserControl } from "@/1shared/providers/pprProvider";
import { IPpr, deletePprTable } from "@/2entities/ppr";
import { DeleteTwoTone } from "@ant-design/icons";
import Popconfirm from "antd/es/popconfirm";

interface IPprDeleteButtonProps {
  ppr: IPpr;
}

export const PprDeleteButton: FC<IPprDeleteButtonProps> = ({ ppr }) => {
  const { data: userData } = useSession();

  if (!userData) {
    return null;
  }
  const { isForSubdivision } = isPprInUserControl(ppr, userData.user);
  const isStatusCanBeDeleted = ppr.status === "plan_creating" || ppr.status === "template";
  const isPprCanBeDeleted = isForSubdivision && isStatusCanBeDeleted;
  return (
    <Tooltip title="Удалить ППР">
      <Popconfirm
        title="Удалить ППР"
        description="Уверенны, что хотите удалить ППР?"
        onConfirm={() => deletePprTable(ppr.id)}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          danger
          disabled={!isPprCanBeDeleted}
          icon={<DeleteTwoTone twoToneColor="red" className="cursor-pointer" />}
        />
      </Popconfirm>
    </Tooltip>
  );
};
