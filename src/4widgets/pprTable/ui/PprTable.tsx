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
import { checkIsFieldVertical, getColumnSettings, getThStyle } from "../lib/pprTableStylesHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { PprTableBranchNameRowMemo } from "./PprTableBranchNameRow";

import style from "./PprTableCell.module.scss";

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

  const { branchesAndSubbrunchesOrder, branchesMeta } = pprMeta;

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
      </thead>
      <tbody>
        {ppr?.data.map((pprData, index) => (
          <Fragment key={pprData.id}>
            {index in branchesAndSubbrunchesOrder && (
              <>
                {branchesAndSubbrunchesOrder[index].subbranch.prev && (
                  <SummaryTableRow
                    fields={planFactFields}
                    summaryNameColSpan={basicFields.length}
                    name={`Итого по пункту ${branchesAndSubbrunchesOrder[index].subbranch.prev?.orderIndex}`}
                    totalFieldsValues={branchesAndSubbrunchesOrder[index].subbranch.prev?.total}
                  />
                )}
                {branchesAndSubbrunchesOrder[index].branch?.prev && (
                  <SummaryTableRow
                    fields={planFactFields}
                    summaryNameColSpan={basicFields.length}
                    name={`Итого по разделу ${branchesAndSubbrunchesOrder[index].branch?.prev?.orderIndex}`}
                    totalFieldsValues={branchesAndSubbrunchesOrder[index].branch?.prev?.total}
                  />
                )}
                {branchesAndSubbrunchesOrder[index].branch && (
                  <PprTableBranchNameRowMemo
                    branch={branchesAndSubbrunchesOrder[index].branch!}
                    updateSubbranch={updateSubbranch}
                  />
                )}
                {branchesAndSubbrunchesOrder[index].subbranch && (
                  <PprTableBranchNameRowMemo
                    branch={branchesAndSubbrunchesOrder[index].subbranch}
                    updateSubbranch={updateSubbranch}
                  />
                )}
              </>
            )}
            <tr key={pprData.id}>
              {allFields.map((field) => (
                <PprTableCellMemo
                  key={pprData.id + field}
                  pprData={pprData}
                  updatePprTableCell={updatePprTableCell}
                  isVertical={checkIsFieldVertical(field)}
                  field={field}
                  planCellRef={planCellRef}
                  isPprInUserControl={isPprInUserControl}
                  {...getColumnSettingsForField(field, pprData.common_work_id !== null)}
                />
              ))}
            </tr>
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
