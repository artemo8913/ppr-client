import { FC } from "react";
import clsx from "clsx";

import { TableCellMemo } from "@/1shared/ui/table";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

import { IPprData, IWorkingManYearPlan } from "../model/ppr.types";
import { checkIsFactNormTimeField, checkIsFactTimeField, checkIsPlanTimeField } from "../lib/validateTypes";

interface ISummaryTableFootProps {
  fields: (keyof IPprData | keyof IWorkingManYearPlan)[];
  summaryNameColSpan: number;
}

export const SummaryTableFoot: FC<ISummaryTableFootProps> = ({ summaryNameColSpan, fields }) => {
  const { pprMeta } = usePpr();

  const { pprView } = usePprTableSettings();

  const { totalValues } = pprMeta;

  const isCorrectedView = pprView === "CORRECTED_PLAN" || pprView === "CORRECTED_PLAN_WITH_ARROWS";

  const pprDataView: "original" | "final" = isCorrectedView ? "final" : "original";

  return (
    <tfoot className="font-bold sticky bottom-0 z-20 bg-neutral-100">
      <tr>
        <td
          colSpan={summaryNameColSpan}
          className={clsx("border border-black", "outline-black outline-1 outline outline-offset-[-1px] z-20")}
        >
          <TableCellMemo value="Итого по разделам 1-3, чел.-ч" />
        </td>
        {fields.map((field) => {
          const isFieldHaveTotalValueByPeoples = checkIsPlanTimeField(field) || checkIsFactTimeField(field);
          const isFieldHaveTotalValueByWorks =
            checkIsPlanTimeField(field) || checkIsFactNormTimeField(field) || checkIsFactTimeField(field);

          let isWorkPlanLessThenCould = false;

          let isWorkPlanMoreThenCould = false;

          if (!isFieldHaveTotalValueByPeoples) {
          } else if (
            Number(totalValues[pprDataView].peoples[field]) - Number(totalValues[pprDataView].works[field]) >
            1
          ) {
            isWorkPlanLessThenCould = true;
          } else if (
            Number(totalValues[pprDataView].peoples[field]) - Number(totalValues[pprDataView].works[field]) <
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
          const isFieldHaveTotalValueByPeoples = checkIsPlanTimeField(field) || checkIsFactTimeField(field);
          return (
            <td
              key={field}
              className={clsx("border border-black", "outline-black outline-1 outline outline-offset-[-1px] z-20")}
            >
              <TableCellMemo
                isVertical
                value={isFieldHaveTotalValueByPeoples ? totalValues[pprDataView].peoples[field] : "-"}
              />
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
};
