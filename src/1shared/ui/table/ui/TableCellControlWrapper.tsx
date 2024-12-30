"use client";
import { FC, ReactNode, useState } from "react";

interface ITableCellControlWrapperProps {
  isShowControl?: boolean;
  controlItems?: ReactNode;
  children?: ReactNode;
}

export const TableCellControlWrapper: FC<ITableCellControlWrapperProps> = ({
  children,
  controlItems,
  isShowControl,
}) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  if (!isShowControl) {
    return children;
  }

  return (
    <div className="relative min-h-20 flex flex-col justify-center" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      {!isHide && <div className="!absolute -bottom-6 left-0 z-10 flex py-2 min-h-12">{controlItems}</div>}
      {children}
    </div>
  );
};
