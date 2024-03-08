"use client";
import { updatePprTable } from "@/1shared/api/pprTable/pprTable.actions";
import { ServerSubmitButton } from "@/1shared/ui/button";
import { usePprTableData } from "@/2entities/PprTable";
import { SaveOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { FC, useState } from "react";

interface IPprTableUpdateFormProps {
  id: string;
}

export const PprTableUpdateButton: FC<IPprTableUpdateFormProps> = ({ id }) => {
  const { pprData } = usePprTableData();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Tooltip title="сохранить">
      <Button
        icon={<SaveOutlined />}
        loading={isLoading}
        disabled={isLoading}
        type="primary"
        shape="circle"
        onClick={async () => {
          setIsLoading(true);
          await updatePprTable(id, pprData);
          setIsLoading(false);
        }}
      />
    </Tooltip>
  );
};
