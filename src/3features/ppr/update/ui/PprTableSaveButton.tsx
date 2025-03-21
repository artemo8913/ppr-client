"use client";
import { FC, useMemo, useTransition } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { SaveOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

import { useNotificationProvider } from "@/1shared/notification";
import { checkIsPprInUserControl, updatePprTable, usePpr } from "@/2entities/ppr";

interface IPprTableUpdateFormProps {}

export const PprTableSaveButton: FC<IPprTableUpdateFormProps> = () => {
  const { ppr } = usePpr();

  const [isLoading, startTransition] = useTransition();

  const { data: credential } = useSession();

  const { toast } = useNotificationProvider();

  const isPprInUserControl = useMemo(() => {
    const { isForSubdivision, isPprCreatedByThisUser } = checkIsPprInUserControl(ppr?.created_by, credential?.user);

    return isForSubdivision || (isPprCreatedByThisUser && ppr?.status === "template");
  }, [credential?.user, ppr?.created_by, ppr?.status]);

  const handleSave = () =>
    startTransition(async () => {
      if (ppr) {
        const response = await updatePprTable(ppr.id, {
          data: ppr.data,
          workingMans: ppr.workingMans,
          raports_notes: ppr.raports_notes,
        });

        toast(response);
      }
    });

  const isDisabled = isLoading || !isPprInUserControl;

  return (
    <Tooltip title="Сохранить">
      <Button
        icon={<SaveOutlined />}
        loading={isLoading}
        disabled={isDisabled}
        type="text"
        shape="circle"
        onClick={handleSave}
      />
    </Tooltip>
  );
};
