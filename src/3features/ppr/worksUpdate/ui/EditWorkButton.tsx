"use client";
import { ChangeEvent, FC, useState } from "react";
import Button from "antd/es/button";
import Select from "antd/es/select";
import Input from "antd/es/input/Input";
import { EditOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";
import { BRANCH_SELECT_OPTIONS } from "@/1shared/const/branchSelectOptions";
import { TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

interface IChangeBranchButtonProps {
  workId: TPprDataWorkId;
  branch?: TWorkBranch;
  note?: string | null;
}

export const EditWorkButton: FC<IChangeBranchButtonProps> = (props) => {
  const { updatePprData } = usePpr();

  const [noteValue, setNoteValue] = useState(props.note || "");

  const [isHide, setIsHide] = useState<boolean>(true);

  const handleSelect = (branch: TWorkBranch) => {
    updatePprData(props.workId, "branch", branch);
  };

  const handleChangeNoteValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setNoteValue(e.target.value);

  const handleUpdateNoteValue = () => updatePprData(props.workId, "note", noteValue);

  return (
    <div className="relative w-[110%]" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      <Button size="small" shape="circle" icon={<EditOutlined />} />
      <div style={{ visibility: isHide ? "hidden" : "visible" }} className="absolute flex flex-col">
        <Select size="small" defaultValue={props.branch} options={BRANCH_SELECT_OPTIONS} onSelect={handleSelect} />
        <Input
          value={noteValue}
          onChange={handleChangeNoteValue}
          onMouseLeave={handleUpdateNoteValue}
          onPressEnter={handleUpdateNoteValue}
          placeholder="Примечание"
          size="small"
        />
      </div>
    </div>
  );
};
