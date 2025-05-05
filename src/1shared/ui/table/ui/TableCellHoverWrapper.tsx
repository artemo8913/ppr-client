"use client";
import { FC, ReactNode, useState } from "react";

import style from "./TableCell.module.scss";

interface ITableCellHoverWrapperProps {
  items?: ReactNode;
  children?: ReactNode;
}

export const TableCellHoverWrapper: FC<ITableCellHoverWrapperProps> = ({ children, items }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  return (
    <div
      className={style.TableCellHoverWrapper}
      onMouseEnter={() => setIsHide(false)}
      onMouseLeave={() => setIsHide(true)}
    >
      {!isHide && <div className={style.wrapper}>{items}</div>}
      {children}
    </div>
  );
};
