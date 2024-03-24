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
  const isMyPpr = userData?.user.id_subdivision === ppr.created_by.id_subdivision;
  const isSuitableStatus = ppr.status === "none" || ppr.status === "plan_creating" || ppr.status === "template";
  return (
    <Tooltip title="Удалить">
      <Button
        disabled={!(isMyPpr && isSuitableStatus)}
        icon={<DeleteTwoTone className="cursor-pointer" />}
        onClick={() => deletePprTable(ppr.id)}
      />
    </Tooltip>
  );
};
