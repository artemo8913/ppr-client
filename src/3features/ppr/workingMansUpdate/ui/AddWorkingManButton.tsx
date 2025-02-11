"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { SizeType } from "antd/es/config-provider/SizeContext";

import { TWorkingManId, usePpr } from "@/2entities/ppr";

interface IAddWorkingManButtonProps {
  nearWorkingManId?: TWorkingManId;
  label?: string;
  size?: SizeType;
  shape?: "default" | "circle" | "round";
  type?: "default" | "link" | "text" | "primary" | "dashed";
}

export const AddWorkingManButton: FC<IAddWorkingManButtonProps> = (props) => {
  const { addWorkingMan } = usePpr();

  const handleClick = () => {
    addWorkingMan(props.nearWorkingManId);
  };

  return (
    <Button onClick={handleClick} size="small" shape="circle" icon={<PlusOutlined />} {...props}>
      {props.label}
    </Button>
  );
};
