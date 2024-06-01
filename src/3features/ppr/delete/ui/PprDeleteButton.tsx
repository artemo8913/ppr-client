"use client";
import { isPprInUserControl } from "@/1shared/providers/pprTableProvider";
import { IPpr, deletePprTable } from "@/2entities/ppr";
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

  if (!userData) {
    return null;
  }
  const { isForSubdivision } = isPprInUserControl(ppr, userData.user);
  const isStatusCanBeDeleted = ppr.status === "plan_creating" || ppr.status === "template";
  const isPprCanBeDeleted = isForSubdivision && isStatusCanBeDeleted;
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
