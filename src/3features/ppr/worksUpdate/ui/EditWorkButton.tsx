"use client";
import { FC, memo, useCallback, useState } from "react";
import Button from "antd/es/button";
import Select from "antd/es/select";
import { EditOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { TWorkBranch } from "@/2entities/ppr";
import { BRANCH_SELECT_OPTIONS } from "@/1shared/form/branchSelectOptions";

interface IChangeBranchButtonProps {
  workId: number | string;
  branch?: TWorkBranch;
}

const EditWorkButton: FC<IChangeBranchButtonProps> = (props) => {
  const { updatePprData } = usePpr();

  const [isHide, setIsHide] = useState<boolean>(true);

  const handleClick = useCallback(
    (branch: TWorkBranch) => {
      updatePprData(props.workId, "branch", branch);
    },
    [updatePprData, props.workId]
  );

  return (
    <div className="flex relative w-[110%]" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      <Button size="small" shape="circle" icon={<EditOutlined />} />
      <Select
        style={{ visibility: isHide ? "hidden" : "visible" }}
        size="small"
        className="relative after:h-4"
        defaultValue={props.branch}
        options={BRANCH_SELECT_OPTIONS}
        onSelect={handleClick}
      />
    </div>
  );
};

const EditWorkButtonMemo = memo(EditWorkButton);

export { EditWorkButtonMemo };
