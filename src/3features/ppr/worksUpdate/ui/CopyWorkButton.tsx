"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { CopyOutlined } from "@ant-design/icons";
import { usePpr } from "@/1shared/providers/pprProvider";
import { IPprData } from "@/2entities/ppr";

interface ICopyWorkButtonProps extends React.ComponentProps<typeof Button> {
  pprData?: IPprData;
  indexToPlace?: number;
}

export const CopyWorkButton: FC<ICopyWorkButtonProps> = ({ pprData, indexToPlace }) => {
  const { addWork } = usePpr();
  const handleClick = () => {
    addWork(
      {
        name: pprData?.name,
        workId: pprData?.workId,
        branch: pprData?.branch,
        subbranch: pprData?.subbranch,
        measure: pprData?.measure,
        periodicity_normal: pprData?.periodicity_normal,
        periodicity_fact: pprData?.periodicity_fact,
        norm_of_time: pprData?.norm_of_time,
        norm_of_time_document: pprData?.norm_of_time_document,
        unity: pprData?.unity,
      },
      indexToPlace
    );
  };
  return <Button onClick={handleClick} size="small" shape="circle" icon={<CopyOutlined />} />;
};
