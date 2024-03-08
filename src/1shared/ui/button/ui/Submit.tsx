"use client";
import { FC } from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/es/button";
import { useFormStatus } from "react-dom";

export const Submit: FC<ButtonProps> = (props) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} htmlType="submit" {...props}>
      {props.children}
    </Button>
  );
};
