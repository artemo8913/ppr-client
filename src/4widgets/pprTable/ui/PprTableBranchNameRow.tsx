import { FC, memo } from "react";
import { useCreateColumns } from "./PprTableColumns";

interface IPprTableBranchNameRow {
  label: string;
}

export const PprTableBranchNameRow: FC<IPprTableBranchNameRow> = (props) => {
  const { allFields } = useCreateColumns();

  return (
    <tr>
      <td className="border font-bold border-black" colSpan={allFields.length}>
        {props.label}
      </td>
    </tr>
  );
};

export const PprTableBranchNameRowMemo = memo(PprTableBranchNameRow);
