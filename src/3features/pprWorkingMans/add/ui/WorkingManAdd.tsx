"use client";
import Button from "antd/es/button";
import { FC } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";

interface IWorkingManAddProps {
  className?: string;
}

export const WorkingManAdd: FC<IWorkingManAddProps> = ({ className }) => {
  const { addWorkingMan } = usePpr();
  return (
    <Button className={className} type="primary" onClick={addWorkingMan}>
      Добавить человека
    </Button>
  );
};
