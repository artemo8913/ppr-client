"use client";
import clsx from "clsx";
import { FC, memo, MutableRefObject, useCallback } from "react";

import { IPprData, TPprDataWorkId, usePprTableSettings } from "@/2entities/ppr";

import { PprTableCell } from "./PprTableCell";
import { editableFieldsSettings, TPprFieldSettings } from "../lib/pprTableFieldsHelper";

interface IPprTableDataRowProps {
  rowSpan?: number;
  pprData: IPprData;
  workOrder?: string;
  isEditable?: boolean;
  fields: (keyof IPprData)[];
  isPprInUserControl: boolean;
  getEditableDataFields: () => TPprFieldSettings;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
}

export const PprTableDataRow: FC<IPprTableDataRowProps> = (props) => {
  const pprSettings = usePprTableSettings();

  const getEditablePlanFactFields = useCallback((): TPprFieldSettings => {
    if (!props.isEditable || props.pprData.is_work_aproved) {
      return {};
    }

    if (props.pprData.common_work_id) {
      return editableFieldsSettings.commonWork;
    } else {
      return editableFieldsSettings.notCommonWork;
    }
  }, [props.isEditable, props.pprData.common_work_id, props.pprData.is_work_aproved]);

  return (
    <tr className={clsx(pprSettings.isBacklightRowAndCellOnHover && "hover:shadow-purple-300 hover:shadow-inner")}>
      {props.fields.map((field) => (
        <PprTableCell
          {...props.getEditableDataFields()[field]}
          {...getEditablePlanFactFields()[field]}
          field={field}
          rowSpan={props.rowSpan}
          pprData={props.pprData}
          pprSettings={pprSettings}
          workOrder={props.workOrder}
          key={props.pprData.id + field}
          planCellRef={props.planCellRef}
          updatePprTableCell={props.updatePprTableCell}
          isPprInUserControl={props.isPprInUserControl}
        />
      ))}
    </tr>
  );
};

export const PprTableDataRowMemo = memo(PprTableDataRow);
