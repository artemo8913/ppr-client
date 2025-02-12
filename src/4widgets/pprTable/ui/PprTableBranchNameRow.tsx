"use client";
import { ChangeEvent, FC, memo } from "react";

import { IBranchDefaultMeta, TPprDataWorkId, translateRuPprBranchName } from "@/2entities/ppr";

import { useCreateColumns } from "./PprTableColumns";

interface IPprTableBranchNameRow {
  branch?: IBranchDefaultMeta | null;
  updateSubbranch?: (newBranchName: string, workIdsSet: Set<TPprDataWorkId>) => void;
  isEditable?: boolean;
}

export const PprTableBranchNameRow: FC<IPprTableBranchNameRow> = (props) => {
  const { allFields } = useCreateColumns();

  if (!props.branch) {
    return null;
  }

  const isSubbranchEditable = props.branch.type === "subbranch" && props.updateSubbranch && props.isEditable;

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (props.branch && props.updateSubbranch) {
      props.updateSubbranch(e.target.value, props.branch.workIds);
    }
  };

  return (
    <tr>
      <td className="border font-bold border-black cursor-default" colSpan={allFields.length}>
        {isSubbranchEditable ? (
          <div className="flex">
            {props.branch.orderIndex}
            <input
              className="bg-transparent flex-1 cursor-pointer"
              defaultValue={props.branch.name}
              onBlur={handleBlur}
            />
          </div>
        ) : (
          `${props.branch.orderIndex}${translateRuPprBranchName(props.branch.name)}`
        )}
      </td>
    </tr>
  );
};

export const PprTableBranchNameRowMemo = memo(PprTableBranchNameRow);
