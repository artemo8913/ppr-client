import { FC } from "react";
import clsx from "clsx";

import { TableCellMemo } from "@/1shared/ui/table";

import { IPprData, TPprDataFieldsTotalValues } from "../model/ppr.types";
import { checkIsFactNormTimeField, checkIsFactTimeField, checkIsPlanTimeField } from "../lib/validateTypes";

interface ISummaryTableRowProps {
  fields: (keyof IPprData)[];
  summaryNameColSpan: number;
  name?: string;
  totalFieldsValues?: TPprDataFieldsTotalValues;
}

export const SummaryTableRow: FC<ISummaryTableRowProps> = (props) => {
  return (
    <tr className="font-bold">
      <td colSpan={props.summaryNameColSpan} className="border border-black">
        <TableCellMemo value={props.name} />
      </td>
      {props.fields.map((field) => {
        const isFieldHaveTotalValueByWorks =
          checkIsPlanTimeField(field) || checkIsFactNormTimeField(field) || checkIsFactTimeField(field);
        return (
          <td key={field} className="border border-black">
            <TableCellMemo
              isVertical
              value={isFieldHaveTotalValueByWorks && props.totalFieldsValues ? props.totalFieldsValues[field] : "-"}
            />
          </td>
        );
      })}
    </tr>
  );
};
