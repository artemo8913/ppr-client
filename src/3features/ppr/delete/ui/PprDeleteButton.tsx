"use client";
import { FC, useTransition } from "react";
import { useSession } from "next-auth/react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { DeleteTwoTone } from "@ant-design/icons";

import { checkIsPprInUserControl } from "@/1shared/providers/pprProvider";
import { TYearPprStatus, deletePprTable } from "@/2entities/ppr";
import { IUser } from "@/2entities/user";

interface IPprDeleteButtonProps {
  pprId: number;
  created_by: IUser;
  pprStatus: TYearPprStatus;
}

export const PprDeleteButton: FC<IPprDeleteButtonProps> = ({ pprId, created_by, pprStatus }) => {
  const { data: userData } = useSession();

  const [isLoading, startTransition] = useTransition();

  if (!userData) {
    return (
      <Tooltip title="Удалить ППР">
        <Button danger disabled icon={<DeleteTwoTone twoToneColor="red" className="cursor-pointer" />} />
      </Tooltip>
    );
  }

  const handleClick = () =>
    startTransition(async () => {
      const answer = confirm("Уверены, что хотите удалить ППР");

      if (answer) {
        await deletePprTable(pprId);
      }
    });

  const { isPprCreatedByThisUser, isForSubdivision } = checkIsPprInUserControl(created_by, userData.user);

  const isStatusCanBeDeleted = pprStatus === "plan_creating" || pprStatus === "template";

  const isPprCanBeDeleted = (isPprCreatedByThisUser || isForSubdivision) && isStatusCanBeDeleted && !isLoading;

  return (
    <Tooltip title="Удалить ППР">
      <Button
        danger
        loading={isLoading}
        disabled={!isPprCanBeDeleted}
        icon={<DeleteTwoTone twoToneColor="red" className="cursor-pointer" />}
        onClick={handleClick}
      />
    </Tooltip>
  );
};
