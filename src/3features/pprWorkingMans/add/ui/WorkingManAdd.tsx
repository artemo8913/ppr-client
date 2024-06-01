"use client";
import Button from "antd/es/button";
import { FC } from "react";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IWorkingManAddProps {
  className?: string;
}

export const WorkingManAdd: FC<IWorkingManAddProps> = ({ className }) => {
  const { addWorkingMan } = usePprTableData();
  return (
    <Button className={className} type="primary" onClick={addWorkingMan}>
      Добавить человека
    </Button>
  );
};
