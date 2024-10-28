"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { SaveOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

import { checkIsPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";
import { updatePprTable } from "@/2entities/ppr";

interface IPprTableUpdateFormProps {}

export const PprTableSaveButton: FC<IPprTableUpdateFormProps> = () => {
  const { ppr } = usePpr();

  const [isLoading, setIsLoading] = useState(false);

  const { data: credential } = useSession();

  const isPprInUserControl = useMemo(
    () => checkIsPprInUserControl(ppr?.created_by, credential?.user).isForSubdivision,
    [credential?.user, ppr?.created_by]
  );

  const handleSave = useCallback(async () => {
    setIsLoading(true);

    if (ppr) {
      await updatePprTable(ppr.id, { data: ppr.data, peoples: ppr.peoples });
    }

    setIsLoading(false);
  }, [ppr]);

  return (
    <Tooltip title="сохранить">
      <Button
        icon={<SaveOutlined />}
        loading={isLoading}
        disabled={isLoading || !isPprInUserControl}
        type="text"
        shape="circle"
        onClick={handleSave}
      />
    </Tooltip>
  );
};
