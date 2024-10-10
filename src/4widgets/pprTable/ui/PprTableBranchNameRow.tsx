"use client";
import { ChangeEvent, FC, memo } from "react";

import { IBranchDefaultMeta } from "@/1shared/providers/pprProvider";
import { translateRuPprBranchName } from "@/1shared/locale/pprBranches";
import { TPprDataWorkId } from "@/2entities/ppr";

import { useCreateColumns } from "./PprTableColumns";

interface IPprTableBranchNameRow {
  branch: IBranchDefaultMeta;
  updateSubbranch: (newBranchName: string, workIdsSet: Set<TPprDataWorkId>) => void;
}

export const PprTableBranchNameRow: FC<IPprTableBranchNameRow> = (props) => {
  const { allFields } = useCreateColumns();

  const isEditable = props.branch.type !== "branch";

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.updateSubbranch(e.target.value, props.branch.workIds);
  };

  return (
    <tr>
      <td className="border font-bold border-black cursor-default" colSpan={allFields.length}>
        {isEditable ? (
          <div className="flex">
            {props.branch.orderIndex}
            <input className="bg-transparent flex-1" defaultValue={props.branch.name} onBlur={handleBlur} />
          </div>
        ) : (
          `${props.branch.orderIndex}${translateRuPprBranchName(props.branch.name)}`
        )}
      </td>
    </tr>
  );
};

export const PprTableBranchNameRowMemo = memo(PprTableBranchNameRow);
