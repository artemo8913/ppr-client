"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useWorkModal } from "@/1shared/providers/workModalProvider";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {
  nearWorkId?: string;
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ nearWorkId }) => {
  const { openModal } = useWorkModal();
  return (
    <Button
      onClick={() => {
        openModal(nearWorkId);
      }}
      size="small"
      shape="circle"
      icon={<PlusOutlined />}
    />
  );
};
