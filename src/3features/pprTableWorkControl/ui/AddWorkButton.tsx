"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useModal } from "@/1shared/providers/modalProvider";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ style }) => {
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal();
      }}
      style={style}
      size="small"
      shape="circle"
      icon={<PlusOutlined />}
    />
  );
};
