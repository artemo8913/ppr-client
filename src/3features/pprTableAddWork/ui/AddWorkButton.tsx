"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useWorkModal } from "@/2entities/work";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ style }) => {
  const { openModal } = useWorkModal();
  return (
    <Button
      onClick={() => {
        openModal();
      }}
      style={style}
      size="small"
      shape="circle"
      className="!absolute bottom-0 left-1/2 z-10"
      icon={<PlusOutlined />}
    />
  );
};
