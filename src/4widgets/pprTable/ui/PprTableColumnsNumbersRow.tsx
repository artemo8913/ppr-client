import React, { FC, memo } from "react";
import clsx from "clsx";

import style from "./PprTableCell.module.scss";

interface IPprTableColumnsNumbersRowProps {
  count: number;
}

const PprTableColumnsNumbersRow: FC<IPprTableColumnsNumbersRowProps> = (props) => {
  return (
    <tr>
      {...new Array(props.count).fill(0).map((_, index) => (
        <td key={index} className={clsx(style.PprTableColumnNumberCell)}>
          {index + 1}
        </td>
      ))}
    </tr>
  );
};

const PprTableColumnsNumbersRowMemo = memo(PprTableColumnsNumbersRow);

export { PprTableColumnsNumbersRow, PprTableColumnsNumbersRowMemo };
