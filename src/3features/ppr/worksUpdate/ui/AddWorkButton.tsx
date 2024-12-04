"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { SizeType } from "antd/es/config-provider/SizeContext";

import { INearWorkMeta, useWorkModal } from "@/1shared/providers/workModalProvider";

interface IAddWorkButtonProps {
  nearWorkMeta?: INearWorkMeta;
  label?: string;
  size?: SizeType;
  shape?: "default" | "circle" | "round";
  type?: "default" | "link" | "text" | "primary" | "dashed";
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({
  nearWorkMeta,
  label,
  type,
  size = "small",
  shape = "circle",
}) => {
  const { openModal } = useWorkModal();

  return (
    <Button
      onClick={() => {
        openModal(nearWorkMeta);
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
