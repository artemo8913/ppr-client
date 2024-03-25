"use client";
import { IPpr, deletePprTable } from "@/1shared/api/pprTable";
import { DeleteTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface IPprDeleteButtonProps {
  ppr: IPpr;
}

export const PprDeleteButton: FC<IPprDeleteButtonProps> = ({ ppr }) => {
  const { data: userData } = useSession();
  const isMyPpr =
    userData?.user.id_subdivision === ppr.created_by.id_subdivision &&
    userData.user.id_distance === ppr.created_by.id_distance &&
    userData.user.id_direction === ppr.created_by.id_direction;
  const isStatusCanBeDeleted = ppr.status === "none" || ppr.status === "plan_creating" || ppr.status === "template";
  const isPprCanBeDeleted = isMyPpr && isStatusCanBeDeleted;
  return (
    <Tooltip title="Удалить">
      <Button
        disabled={!isPprCanBeDeleted}
        icon={<DeleteTwoTone className="cursor-pointer" />}
        onClick={() => deletePprTable(ppr.id)}
      />
    </Tooltip>
  );
};
