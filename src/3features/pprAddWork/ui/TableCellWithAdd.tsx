"use client";
import { FC } from "react";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";

export const TableCellWithAdd: FC<ITableCell> = ({ children, ...otherProps }) => {
  return (
    <TableCell className="relative" {...otherProps}>
      <AddButton />
      {children}
    </TableCell>
  );
};

const AddButton = () => {
  return <Button size="small" shape="circle" className="absolute top-0 left-0" icon={<PlusOutlined  />} />;
};
