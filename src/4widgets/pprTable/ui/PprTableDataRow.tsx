"use client";
import { FC, memo, MutableRefObject } from "react";

import { ITableCellProps } from "@/1shared/ui/table";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData, TPprDataWorkId } from "@/2entities/ppr";

import { PprTableCell } from "./PprTableCell";
import { checkIsFieldVertical } from "../lib/pprTableStylesHelper";
import clsx from "clsx";

interface IPprTableDataRowProps {
  rowSpan?: number;
  pprData: IPprData;
  workOrder?: string;
  fields: (keyof IPprData)[];
  isPprInUserControl: boolean;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
  getColumnSettingsForField: (field: keyof IPprData, isHaveWorkId: boolean) => ITableCellProps | undefined;
}

export const PprTableDataRow: FC<IPprTableDataRowProps> = (props) => {
  const pprSettings = usePprTableSettings();

  return (
    <tr className={clsx(pprSettings.isBacklightRowAndCellOnHover && "hover:shadow-purple-300 hover:shadow-inner")}>
      {props.fields.map((field) => (
        <PprTableCell
          field={field}
          rowSpan={props.rowSpan}
          pprData={props.pprData}
          workOrder={props.workOrder}
          key={props.pprData.id + field}
          planCellRef={props.planCellRef}
          isVertical={checkIsFieldVertical(field)}
          updatePprTableCell={props.updatePprTableCell}
          isPprInUserControl={props.isPprInUserControl}
          {...props.getColumnSettingsForField(field, props.pprData.common_work_id !== null)}
        />
      ))}
    </tr>
  );
};

export const PprTableDataRowMemo = memo(PprTableDataRow);
