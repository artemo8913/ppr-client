import { FC } from "react";
import clsx from "clsx";

import { TableCellMemo } from "@/1shared/ui/table";

import { usePpr } from "./PprProvider";
import { usePprTableSettings } from "./PprTableSettingsProvider";
import { PlannedWorkWithCorrections, PlannedWorkingMans } from "../model/ppr.types";
import { PprField } from "../model/PprField";

interface ISummaryTableFootProps {
  fields: (keyof PlannedWorkWithCorrections | keyof PlannedWorkingMans)[];
  summaryNameColSpan: number;
}

export const SummaryTableFoot: FC<ISummaryTableFootProps> = ({ summaryNameColSpan, fields }) => {
  const { pprMeta } = usePpr();

  const { pprView } = usePprTableSettings();

  const { totalValues } = pprMeta;

  const isCorrectedView = pprView === "CORRECTED_PLAN" || pprView === "CORRECTED_PLAN_WITH_ARROWS";

  const pprDataView: "original" | "final" = isCorrectedView ? "final" : "original";

  return (
    <tfoot className="font-bold sticky bottom-0 z-20 bg-neutral-100 print:static print:table-row-group">
      <tr>
        <td
          colSpan={summaryNameColSpan}
          className={clsx("border border-black", "outline-black outline-1 outline outline-offset-[-1px] z-20")}
        >
          <TableCellMemo value="Итого по разделам 1-3, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = PprField.isPlanTime(field) || PprField.isFactTime(field);
          const isFieldHaveTotalValueByWorks =
            PprField.isPlanTime(field) || PprField.isFactNormTime(field) || PprField.isFactTime(field);

          let isWorkPlanLessThenCould = false;

          let isWorkPlanMoreThenCould = false;

          if (!isFieldHaveTotalValueByPeoples) {
          } else if (
            Number(totalValues[pprDataView].workingMans[field]) - Number(totalValues[pprDataView].works[field]) >
            1
          ) {
            isWorkPlanLessThenCould = true;
          } else if (
            Number(totalValues[pprDataView].workingMans[field]) - Number(totalValues[pprDataView].works[field]) <
            -1
          ) {
            isWorkPlanMoreThenCould = true;
          }

          return (
            <td
              key={field}
              className={clsx(
                "border border-black",
                "outline-black outline-1 outline outline-offset-[-1px] z-20",
                isWorkPlanLessThenCould && "bg-red-200",
                isWorkPlanMoreThenCould && "bg-red-400"
              )}
            >
              <TableCellMemo
                isVertical
                value={isFieldHaveTotalValueByWorks ? totalValues[pprDataView].works[field] : "-"}
              />
            </td>
          );
        })}
      </tr>
      <tr>
        <td
          colSpan={summaryNameColSpan}
          className={clsx("border border-black", "outline-black outline-1 outline outline-offset-[-1px] z-20")}
        >
          <TableCellMemo value="Итого настой часов, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = PprField.isPlanTime(field) || PprField.isFactTime(field);
          return (
            <td
              key={field}
              className={clsx("border border-black", "outline-black outline-1 outline outline-offset-[-1px] z-20")}
            >
              <TableCellMemo
                isVertical
                value={isFieldHaveTotalValueByPeoples ? totalValues[pprDataView].workingMans[field] : "-"}
              />
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
};
