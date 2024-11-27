"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TWorkingManId } from "@/2entities/ppr";

interface IDeleteWorkingManButtonProps {
  id: TWorkingManId;
}

export const DeleteWorkingManButton: FC<IDeleteWorkingManButtonProps> = ({ id }) => {
  const { deleteWorkingMan } = usePpr();

  const handleClick = () => {
    deleteWorkingMan(id);
  };

  return <Button onClick={handleClick} size="small" shape="circle" icon={<MinusOutlined />} />;
};
