"use client";
import { FC, useState } from "react";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import { useWorkModal } from "@/2entities/work";

export const TableCellWithAdd: FC<ITableCell> = ({ handleClick, ...otherProps }) => {
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({ display: "none" });

  const { openModal } = useWorkModal();

  return (
    <div
      onMouseEnter={() => setButtonStyle({ display: "block" })}
      onMouseLeave={() => setButtonStyle({ display: "none" })}
    >
      <Button
        onClick={() => {
          openModal();
          handleClick && handleClick();
        }}
        style={buttonStyle}
        size="small"
        shape="circle"
        className="!absolute bottom-0 left-1/2 "
        icon={<PlusOutlined />}
      />
      <TableCell {...otherProps} />
    </div>
  );
};
