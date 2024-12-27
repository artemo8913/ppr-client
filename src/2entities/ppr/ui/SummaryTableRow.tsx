import { FC } from "react";

import { TableCellMemo } from "@/1shared/ui/table";

import { IPprData, TPprDataFieldsTotalValues } from "../model/ppr.types";
import { checkIsFactNormTimeField, checkIsFactTimeField, checkIsPlanTimeField } from "../lib/validateTypes";

interface ISummaryTableRowProps {
  name?: string;
  isVertical?: boolean;
  fields: (keyof IPprData)[];
  summaryNameColSpan?: number;
  totalFieldsValues?: TPprDataFieldsTotalValues;
}

export const SummaryTableRow: FC<ISummaryTableRowProps> = ({
  name,
  fields,
  totalFieldsValues,
  isVertical = true,
  summaryNameColSpan,
}) => {
  return (
    <tr className="font-bold">
      <td colSpan={summaryNameColSpan} className="border border-black">
        <TableCellMemo value={name} />
      </td>
      {fields.map((field) => {
        const isFieldHaveTotalValueByWorks =
          checkIsPlanTimeField(field) || checkIsFactNormTimeField(field) || checkIsFactTimeField(field);

        return (
          <td key={field} className="border border-black">
            <TableCellMemo
              isVertical={isVertical}
              value={isFieldHaveTotalValueByWorks && totalFieldsValues ? totalFieldsValues[field] : "-"}
            />
          </td>
        );
      })}
    </tr>
  );
};
