import clsx from "clsx";
import { FC } from "react";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

interface ICorrectionTableSummaryRowProps {
  text: string;
  planTime: number;
  factTime: number;
  timeDiff: number;
  className?: string;
}

export const CorrectionTableSummaryRow: FC<ICorrectionTableSummaryRowProps> = ({
  text,
  factTime,
  planTime,
  timeDiff,
  className,
}) => {
  return (
    <tr className={clsx("font-bold", className)}>
      <td colSpan={4}>{text}</td>
      <td>-</td>
      <td>{roundToFixed(planTime)}</td>
      <td>-</td>
      <td>{roundToFixed(factTime)}</td>
      <td>-</td>
      <td>{roundToFixed(timeDiff)}</td>
      <td>-</td>
    </tr>
  );
};
