import { FC } from "react";
import clsx from "clsx";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TableCellMemo } from "@/1shared/ui/table";

import { IPprData, IWorkingManYearPlan } from "../model/ppr.types";
import { checkIsFactNormTimeField, checkIsFactTimeField, checkIsPlanTimeField } from "../lib/validateTypes";

interface ISummaryTableFootProps {
  fields: (keyof IPprData | keyof IWorkingManYearPlan)[];
  summaryNameColSpan: number;
}

export const SummaryTableFoot: FC<ISummaryTableFootProps> = ({ summaryNameColSpan, fields }) => {
  const { pprMeta } = usePpr();

  const { totalValues } = pprMeta;

  return (
    <tfoot className="font-bold">
      <tr>
        <td colSpan={summaryNameColSpan} className="border border-black">
          <TableCellMemo value="Итого по разделам 1-3, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = checkIsPlanTimeField(field) || checkIsFactTimeField(field);
          const isFieldHaveTotalValueByWorks =
            checkIsPlanTimeField(field) || checkIsFactNormTimeField(field) || checkIsFactTimeField(field);

          let isWorkAndPeoplesTimesMatch = true;

          if (
            isFieldHaveTotalValueByPeoples &&
            Math.abs(Number(totalValues.peoples[field]) - Number(totalValues.works[field])) > 1
          ) {
            isWorkAndPeoplesTimesMatch = false;
          }
          return (
            <td key={field} className={clsx("border border-black", !isWorkAndPeoplesTimesMatch && "bg-red-300")}>
              <TableCellMemo isVertical value={isFieldHaveTotalValueByWorks ? totalValues.works[field] : "-"} />
            </td>
          );
        })}
      </tr>
      <tr>
        <td colSpan={summaryNameColSpan} className="border border-black">
          <TableCellMemo value="Итого настой часов, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = checkIsPlanTimeField(field) || checkIsFactTimeField(field);
          return (
            <td key={field} className="border border-black">
              <TableCellMemo isVertical value={isFieldHaveTotalValueByPeoples ? totalValues.peoples[field] : "-"} />
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
};
