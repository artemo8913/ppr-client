"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { useWorkModal } from "@/1shared/providers/workModalProvider";

interface IAddWorkButtonProps extends React.ComponentProps<typeof Button> {
  indexToPlace?: number;
}

export const AddWorkButton: FC<IAddWorkButtonProps> = ({ style, indexToPlace }) => {
  const { openModal } = useWorkModal();
  console.log(indexToPlace)
  return (
    <Button
      onClick={() => {
        openModal(indexToPlace);
      }}
      style={style}
      size="small"
      shape="circle"
      icon={<PlusOutlined />}
    />
  );
};
