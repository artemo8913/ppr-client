"use client";
import { FC, memo, MutableRefObject } from "react";

import { ITableCellProps } from "@/1shared/ui/table";
import { IPprData, TPprDataWorkId } from "@/2entities/ppr";

import { PprTableCell } from "./PprTableCell";
import { checkIsFieldVertical } from "../lib/pprTableStylesHelper";

interface IPprTableDataRowProps {
  pprData: IPprData;
  workOrder?: string;
  fields: (keyof IPprData)[];
  isPprInUserControl: boolean;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
  getColumnSettingsForField: (field: keyof IPprData, isHaveWorkId: boolean) => ITableCellProps | undefined;
}

export const PprTableDataRow: FC<IPprTableDataRowProps> = (props) => {
  return (
    <tr>
      {props.fields.map((field) => (
        <PprTableCell
          field={field}
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
