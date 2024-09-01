"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useWorkModal } from "@/1shared/providers/workModalProvider";
import { SizeType } from "antd/es/config-provider/SizeContext";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {
  workId?: string;
  label?: string;
  size?: SizeType;
  shape?: "default" | "circle" | "round";
  type?: "default" | "link" | "text" | "primary" | "dashed";
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ workId, label, type, size = "small", shape = "circle" }) => {
  const { openModal } = useWorkModal();
  return (
    <Button
      onClick={() => {
        openModal(workId);
      }}
      type={type}
      size={size}
      shape={shape}
      icon={<PlusOutlined />}
    >
      {label}
    </Button>
  );
};
