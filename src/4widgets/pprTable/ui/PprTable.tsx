"use client";
import { FC, Fragment, useCallback, useRef } from "react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { translateRuTimePeriod } from "@/1shared/lib/date";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { checkIsWorkOrTimeField, IPprData, SummaryTableFoot, TAllMonthStatuses, TYearPprStatus } from "@/2entities/ppr";
import { AddWorkButton } from "@/3features/ppr/worksUpdate";

import HeaderCell from "./HeaderCell";
import { useCreateColumns } from "./PprTableColumns";
import { getColumnSettings, getThStyle } from "../lib/pprTableStylesHelper";
import { translateRuFieldName } from "../lib/pprTableColumnsHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { PprTableBranchNameRowMemo } from "./PprTableBranchNameRow";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = () => {
  const { ppr, updatePprTableCell, getBranchesMeta, updateSubbranch } = usePpr();

  const { basicFields, timePeriods, planFactFields, monthColSpan, allFields } = useCreateColumns();

  const pprSettings = usePprTableSettings();

  const pprYearStatus: TYearPprStatus = ppr?.status || "template";
  const pprMonthsStatuses: TAllMonthStatuses | null = ppr?.months_statuses || null;

  const planCellRef = useRef<HTMLTableCellElement | null>(null);

  const getColumnSettingsForField = useCallback(
    (field: keyof IPprData, isHaveWorkId: boolean) =>
      getColumnSettings(
        field,
        pprYearStatus,
        pprSettings.currentTimePeriod,
        isHaveWorkId,
        pprMonthsStatuses,
        pprSettings.correctionView
      ),
    [pprMonthsStatuses, pprSettings.correctionView, pprSettings.currentTimePeriod, pprYearStatus]
  );

  if (!Boolean(ppr?.data.length)) {
    return <AddWorkButton shape="default" size="middle" type="primary" label="Добавить работу" />;
  }

  const { branchesAndSubbrunchesOrder } = getBranchesMeta();

  return (
    <table
      style={{
        tableLayout: "fixed",
        width: `${pprSettings.tableWidthPercent}%`,
        fontSize: `${pprSettings.fontSizePx}px`,
        position: "relative",
      }}
    >
      <thead>
        <tr>
          {basicFields.map((field) => (
            <HeaderCell
              isVertical
              key={field}
              rowSpan={2}
              value={translateRuFieldName(field)}
              style={{
                ...getThStyle(field),
                height: `${pprSettings.headerHeightPx}px`,
              }}
            />
          ))}
          {timePeriods.map((month) => (
            <HeaderCell key={month} colSpan={monthColSpan} value={translateRuTimePeriod(month)} />
          ))}
        </tr>
        <tr>
          {planFactFields.map((planFactField) => (
            <HeaderCell
              isVertical
              key={planFactField}
              value={translateRuFieldName(planFactField)}
              cellRef={planFactField === "year_plan_work" ? planCellRef : null}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {ppr?.data.map((pprData, index) => (
          <Fragment key={pprData.id}>
            {index in branchesAndSubbrunchesOrder &&
              branchesAndSubbrunchesOrder[index].map((branch) => (
                <PprTableBranchNameRowMemo
                  key={branch.name + index}
                  branch={branch}
                  updateSubbranch={updateSubbranch}
                />
              ))}
            <tr key={pprData.id}>
              {allFields.map((field) => (
                <PprTableCellMemo
                  key={pprData.id + field}
                  pprData={pprData}
                  updatePprTableCell={updatePprTableCell}
                  isVertical={checkIsWorkOrTimeField(field)}
                  field={field}
                  planCellRef={planCellRef}
                  {...getColumnSettingsForField(field, pprData.common_work_id !== null)}
                />
              ))}
            </tr>
          </Fragment>
        ))}
      </tbody>
      <SummaryTableFoot
        fields={planFactFields}
        summaryNameColSpan={basicFields.length}
        totalFieldsValues={ppr?.total_fields_value}
      />
    </table>
  );
};
