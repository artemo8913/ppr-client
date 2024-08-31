import React, { MutableRefObject } from "react";

import { TableCellMemo } from "@/1shared/ui/table";

interface IHeaderCellProps {
  value?: string;
  rowSpan?: number;
  colSpan?: number;
  isVertical?: boolean;
  style?: React.CSSProperties;
  cellRef?: MutableRefObject<HTMLTableCellElement | null> | null;
}

function HeaderCell(props: IHeaderCellProps) {
  return (
    <th
      ref={props.cellRef}
      className="border border-black relative"
      rowSpan={props.rowSpan}
      colSpan={props.colSpan}
      style={props.style}
    >
      <TableCellMemo isVertical={props.isVertical} value={props.value} />
    </th>
  );
}

export default React.memo(HeaderCell);
