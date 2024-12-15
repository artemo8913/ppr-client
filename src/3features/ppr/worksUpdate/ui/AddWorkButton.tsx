"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { SizeType } from "antd/es/config-provider/SizeContext";

import { useWorkModal } from "@/1shared/providers/pprWorkModalProvider";
import { IPprData } from "@/2entities/ppr";

interface IAddWorkButtonProps {
  nearWork?: IPprData;
  label?: string;
  size?: SizeType;
  shape?: "default" | "circle" | "round";
  type?: "default" | "link" | "text" | "primary" | "dashed";
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ nearWork, label, type, size = "small", shape = "circle" }) => {
  const { openAddWorkModal } = useWorkModal();

  return (
    <Button
      onClick={() => {
        openAddWorkModal(nearWork);
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
