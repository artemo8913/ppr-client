"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IDeleteWorkButtonProps extends React.ComponentProps<typeof Button> {
  workId?: string;
}

export const DeleteWorkButton: FC<IDeleteWorkButtonProps> = ({ workId, style }) => {
  const { deleteWork } = usePprTableData();
  return (
    <Button
      onClick={() => {
        workId && deleteWork(workId);
      }}
      style={style}
      size="small"
      shape="circle"
      icon={<MinusOutlined />}
    />
  );
};
