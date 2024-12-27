"use client";
import { FC, Fragment, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";

import { checkIsPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { translateRuFieldName } from "@/1shared/locale/pprFieldNames";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData, SummaryTableFoot, SummaryTableRow, TAllMonthStatuses, TYearPprStatus } from "@/2entities/ppr";
import { AddWorkButton } from "@/3features/ppr/worksUpdate";

import HeaderCell from "./HeaderCell";
import { useCreateColumns } from "./PprTableColumns";
import { PprTableBranchNameRowMemo } from "./PprTableBranchNameRow";
import { getColumnSettings, getThStyle } from "../lib/pprTableStylesHelper";

import style from "./PprTableCell.module.scss";
import { PprTableDataRowMemo } from "./PprTableDataRow";
import { PprTableColumnsNumbersRowMemo } from "./PprTableColumnsNumbersRow";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = () => {
  const { ppr, updatePprTableCell, pprMeta, updateSubbranch } = usePpr();
  const { data: credential } = useSession();

  const { basicFields, timePeriods, planFactFields, monthColSpan, allFields } = useCreateColumns();

  const isPprInUserControl = useMemo(() => {
    const { isForSubdivision, isPprCreatedByThisUser } = checkIsPprInUserControl(ppr?.created_by, credential?.user);

    return isForSubdivision || (isPprCreatedByThisUser && ppr?.status === "template");
  }, [credential?.user, ppr?.created_by, ppr?.status]);

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
        pprSettings.correctionView,
        isPprInUserControl
      ),
    [pprMonthsStatuses, pprSettings.correctionView, pprSettings.currentTimePeriod, pprYearStatus, isPprInUserControl]
  );

  if (!Boolean(ppr?.data.length)) {
    return <AddWorkButton shape="default" size="middle" type="primary" label="Добавить работу" />;
  }

  const { branchesAndSubbrunchesOrder, branchesMeta, worksOrder, worksRowSpan, worksOrderForRowSpan } = pprMeta;

  return (
    <table
      style={{
        tableLayout: "fixed",
        width: `${pprSettings.tableWidthPercent - 0.5}%`,
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
            <HeaderCell
              className={style.MonthHeader}
              key={month}
              colSpan={monthColSpan}
              value={translateRuTimePeriod(month)}
            />
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
        <PprTableColumnsNumbersRowMemo count={allFields.length} />
      </thead>
      <tbody>
        {ppr?.data.map((pprData, index) => (
          <Fragment key={pprData.id}>
            {pprData.id in branchesAndSubbrunchesOrder && (
              <>
                {branchesAndSubbrunchesOrder[pprData.id].subbranch.prev && (
                  <SummaryTableRow
                    fields={planFactFields}
                    summaryNameColSpan={basicFields.length}
                    totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].subbranch.prev?.total}
                    name={`Итого по пункту ${branchesAndSubbrunchesOrder[pprData.id].subbranch.prev?.orderIndex}`}
                  />
                )}
                {branchesAndSubbrunchesOrder[pprData.id].branch?.prev && (
                  <SummaryTableRow
                    fields={planFactFields}
                    summaryNameColSpan={basicFields.length}
                    totalFieldsValues={branchesAndSubbrunchesOrder[pprData.id].branch?.prev?.total}
                    name={`Итого по разделу ${branchesAndSubbrunchesOrder[pprData.id].branch?.prev?.orderIndex}`}
                  />
                )}
                {branchesAndSubbrunchesOrder[pprData.id].branch && (
                  <PprTableBranchNameRowMemo branch={branchesAndSubbrunchesOrder[pprData.id].branch} />
                )}
                <PprTableBranchNameRowMemo
                  branch={branchesAndSubbrunchesOrder[pprData.id].subbranch}
                  updateSubbranch={updateSubbranch}
                />
              </>
            )}
            <PprTableDataRowMemo
              key={pprData.id}
              pprData={pprData}
              fields={allFields}
              planCellRef={planCellRef}
              rowSpan={worksRowSpan[index]}
              workOrder={pprSettings.isUniteSameWorks ? worksOrderForRowSpan[pprData.id] : worksOrder[pprData.id]}
              isPprInUserControl={isPprInUserControl}
              updatePprTableCell={updatePprTableCell}
              getColumnSettingsForField={getColumnSettingsForField}
            />
            {index === ppr?.data.length - 1 && (
              <>
                <SummaryTableRow
                  fields={planFactFields}
                  summaryNameColSpan={basicFields.length}
                  name={`Итого по пункту ${branchesMeta.slice(-1)[0].subbranches.slice(-1)[0].orderIndex}`}
                  totalFieldsValues={branchesMeta.slice(-1)[0].subbranches.slice(-1)[0].total}
                />
                <SummaryTableRow
                  fields={planFactFields}
                  summaryNameColSpan={basicFields.length}
                  name={`Итого по разделу ${branchesMeta.slice(-1)[0].orderIndex}`}
                  totalFieldsValues={branchesMeta.slice(-1)[0].total}
                />
              </>
            )}
          </Fragment>
        ))}
      </tbody>
      <SummaryTableFoot fields={planFactFields} summaryNameColSpan={basicFields.length} />
    </table>
  );
};
