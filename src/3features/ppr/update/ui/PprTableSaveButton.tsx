"use client";
import { FC, useState } from "react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { SaveOutlined } from "@ant-design/icons";
import { updatePprTable } from "@/2entities/ppr/model/ppr.actions";
import { usePpr } from "@/1shared/providers/pprProvider";

interface IPprTableUpdateFormProps {}

export const PprTableSaveButton: FC<IPprTableUpdateFormProps> = () => {
  const { ppr } = usePpr();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Tooltip title="сохранить">
      <Button
        icon={<SaveOutlined />}
        loading={isLoading}
        disabled={isLoading}
        type="text"
        shape="circle"
        onClick={async () => {
          setIsLoading(true);
          ppr && (await updatePprTable(ppr.id, ppr));
          setIsLoading(false);
        }}
      />
    </Tooltip>
  );
};
