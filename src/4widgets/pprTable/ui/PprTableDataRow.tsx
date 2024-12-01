"use client";
import { FC, memo, MutableRefObject } from "react";

import { ITableCellProps } from "@/1shared/ui/table";
import { IPprData, TPprDataWorkId } from "@/2entities/ppr";

import { PprTableCell } from "./PprTableCell";
import { checkIsFieldVertical } from "../lib/pprTableStylesHelper";

interface IPprTableDataRowProps {
  pprData: IPprData;
  fields: (keyof IPprData)[];
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  isPprInUserControl: boolean;
  getColumnSettingsForField: (field: keyof IPprData, isHaveWorkId: boolean) => ITableCellProps | undefined;
}

export const PprTableDataRow: FC<IPprTableDataRowProps> = (props) => {
  return (
    <tr>
      {props.fields.map((field) => (
        <PprTableCell
          key={props.pprData.id + field}
          pprData={props.pprData}
          updatePprTableCell={props.updatePprTableCell}
          isVertical={checkIsFieldVertical(field)}
          field={field}
          planCellRef={props.planCellRef}
          isPprInUserControl={props.isPprInUserControl}
          {...props.getColumnSettingsForField(field, props.pprData.common_work_id !== null)}
        />
      ))}
    </tr>
  );
};

export const PprTableDataRowMemo = memo(PprTableDataRow);
