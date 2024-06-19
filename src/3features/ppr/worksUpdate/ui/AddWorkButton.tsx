"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useWorkModal } from "@/1shared/providers/workModalProvider";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {
  rowIndex?: number;
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ rowIndex }) => {
  const { openModal } = useWorkModal();
  return (
    <Button
      onClick={() => {
        openModal(rowIndex);
      }}
      size="small"
      shape="circle"
      icon={<PlusOutlined />}
    />
  );
};
