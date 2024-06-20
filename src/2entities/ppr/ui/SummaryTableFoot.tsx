import { TableCellMemo } from "@/1shared/ui/table";
import { FC } from "react";
import { IPprData, IWorkingManYearPlan, TTotalFieldsValues } from "../model/ppr.schema";
import { checkIsFactNormTimeField, checkIsFactTimeField, checkIsPlanTimeField } from "../lib/validateTypes";
import clsx from "clsx";

interface ISummaryTableFootProps {
  totalFieldsValues?: TTotalFieldsValues;
  fields: (keyof IPprData | keyof IWorkingManYearPlan)[];
  summaryNameColSpan: number;
}

export const SummaryTableFoot: FC<ISummaryTableFootProps> = ({
  totalFieldsValues = { works: {}, peoples: {} },
  summaryNameColSpan,
  fields,
}) => {
  return (
    <tfoot>
      <tr>
        <td colSpan={summaryNameColSpan} className="border border-black">
          <TableCellMemo value="Итого настой часов, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = checkIsPlanTimeField(field) || checkIsFactTimeField(field);
          return (
            <td key={field} className="border border-black">
              <TableCellMemo
                isVertical
                value={isFieldHaveTotalValueByPeoples ? totalFieldsValues.peoples[field]?.toFixed(2) : "-"}
              />
            </td>
          );
        })}
      </tr>
      <tr>
        <td colSpan={summaryNameColSpan} className="border border-black">
          <TableCellMemo value="Итого трудозатраты, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = checkIsPlanTimeField(field) || checkIsFactTimeField(field);
          const isFieldHaveTotalValueByWorks =
            checkIsPlanTimeField(field) || checkIsFactNormTimeField(field) || checkIsFactTimeField(field);

          let isWorkAndPeoplesTimesMatch = true;

          if (
            isFieldHaveTotalValueByPeoples &&
            Math.abs(Number(totalFieldsValues.peoples[field]) - Number(totalFieldsValues.works[field])) > 1
          ) {
            isWorkAndPeoplesTimesMatch = false;
          }
          return (
            <td key={field} className={clsx("border border-black", !isWorkAndPeoplesTimesMatch && "bg-red-300")}>
              <TableCellMemo
                isVertical
                value={isFieldHaveTotalValueByWorks ? totalFieldsValues.works[field]?.toFixed(2) : "-"}
              />
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
};
