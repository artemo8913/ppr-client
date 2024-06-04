"use client";
import { FC } from "react";
import { useSession } from "next-auth/react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { DeleteTwoTone } from "@ant-design/icons";
import Popconfirm from "antd/es/popconfirm";
import { isPprInUserControl } from "@/1shared/providers/pprProvider";
import { IPpr, TYearPprStatus, deletePprTable } from "@/2entities/ppr";
import { IUser } from "@/2entities/user";

interface IPprDeleteButtonProps {
  pprId: string;
  created_by: IUser;
  pprStatus: TYearPprStatus;
}

export const PprDeleteButton: FC<IPprDeleteButtonProps> = ({ pprId, created_by, pprStatus }) => {
  const { data: userData } = useSession();

  if (!userData) {
    return null;
  }
  const { isForSubdivision } = isPprInUserControl(created_by, userData.user);
  const isStatusCanBeDeleted = pprStatus === "plan_creating" || pprStatus === "template";
  const isPprCanBeDeleted = isForSubdivision && isStatusCanBeDeleted;
  return (
    <Tooltip title="Удалить ППР">
      <Popconfirm
        title="Удалить ППР"
        description="Уверенны, что хотите удалить ППР?"
        onConfirm={() => deletePprTable(pprId)}
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
