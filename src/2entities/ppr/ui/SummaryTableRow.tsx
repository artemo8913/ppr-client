import { FC } from "react";

import { TableCellMemo } from "@/1shared/ui/table";

import { PlannedWorkWithCorrections, PlannedWorkTotalTimes } from "../model/ppr.types";
import { PprField } from "../model/PprField";

interface ISummaryTableRowProps {
  name?: string;
  isVertical?: boolean;
  fields: (keyof PlannedWorkWithCorrections)[];
  summaryNameColSpan?: number;
  totalFieldsValues?: PlannedWorkTotalTimes;
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
          PprField.isPlanTime(field) || PprField.isFactNormTime(field) || PprField.isFactTime(field);

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
