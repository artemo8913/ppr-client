"use client";
import { FC } from "react";
import { useSession } from "next-auth/react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { DeleteTwoTone } from "@ant-design/icons";

import { checkIsPprInUserControl } from "@/1shared/providers/pprProvider";
import { TYearPprStatus, deletePprTable } from "@/2entities/ppr";
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
  const { isForSubdivision } = checkIsPprInUserControl(created_by, userData.user);
  const isStatusCanBeDeleted = pprStatus === "plan_creating" || pprStatus === "template";
  const isPprCanBeDeleted = isForSubdivision && isStatusCanBeDeleted;
  return (
    <Tooltip title="Удалить ППР">
      <Button
        danger
        disabled={!isPprCanBeDeleted}
        icon={<DeleteTwoTone twoToneColor="red" className="cursor-pointer" />}
        onClick={() => {
          const answer = confirm("Уверены, что хотите удалить ППР");
          if (answer) {
            deletePprTable(pprId);
          }
        }}
      />
    </Tooltip>
  );
};
