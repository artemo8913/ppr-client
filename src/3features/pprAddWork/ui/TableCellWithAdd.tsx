"use client";
import { FC, useState } from "react";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import Button from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";

export const TableCellWithAdd: FC<ITableCell> = ({ handleClick, ...otherProps }) => {
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({ display: "none" });
  return (
    <div
      onMouseEnter={() => setButtonStyle({ display: "block" })}
      onMouseLeave={() => setButtonStyle({ display: "none" })}
    >
      <Button
        onClick={handleClick}
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
