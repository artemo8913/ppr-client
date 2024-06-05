"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useWorkModal } from "@/1shared/providers/workModalProvider";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {
  indexToPlace?: number;
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ indexToPlace }) => {
  const { openModal } = useWorkModal();
  return (
    <Button
      onClick={() => {
        openModal(indexToPlace);
      }}
      size="small"
      shape="circle"
      icon={<PlusOutlined />}
    />
  );
};
