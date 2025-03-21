"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { useRouter } from "next/navigation";
import { LeftOutlined } from "@ant-design/icons";

interface IPrintButtonProps {}

export const BackLink: FC<IPrintButtonProps> = () => {
  const router = useRouter();

  return (
    <Button icon={<LeftOutlined />} onClick={() => router.back()}>
      Назад
    </Button>
  );
};
