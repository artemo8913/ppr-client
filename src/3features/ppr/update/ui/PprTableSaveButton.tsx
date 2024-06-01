"use client";
import { FC, useState } from "react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { SaveOutlined } from "@ant-design/icons";
import { updatePprTable } from "@/2entities/ppr/model/ppr.actions";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IPprTableUpdateFormProps {}

export const PprTableSaveButton: FC<IPprTableUpdateFormProps> = () => {
  const { pprData } = usePprTableData();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Tooltip title="сохранить">
      <Button
        icon={<SaveOutlined />}
        loading={isLoading}
        disabled={isLoading}
        type="primary"
        ghost
        shape="circle"
        onClick={async () => {
          setIsLoading(true);
          pprData && (await updatePprTable(pprData.id, pprData));
          setIsLoading(false);
        }}
      />
    </Tooltip>
  );
};
