"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";
import { usePpr } from "@/1shared/providers/pprProvider";

interface IDeleteWorkButtonProps extends React.ComponentProps<typeof Button> {
  workId?: string;
}

export const DeleteWorkButton: FC<IDeleteWorkButtonProps> = ({ workId }) => {
  const { deleteWork } = usePpr();
  return (
    <Button
      onClick={() => {
        workId && deleteWork(workId);
      }}
      size="small"
      shape="circle"
      icon={<MinusOutlined />}
    />
  );
};
