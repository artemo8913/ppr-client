"use client";
import { FC } from "react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { FormOutlined } from "@ant-design/icons";
import { usePpr } from "@/1shared/providers/pprProvider";
import { useSession } from "next-auth/react";
import { getShortNamesForAllHierarchy } from "@/1shared/lib/transEnergoDivisions";

interface IPprTableSetOneUnityButtonProps {}

export const PprTableSetOneUnityButton: FC<IPprTableSetOneUnityButtonProps> = () => {
  const { setOneUnityInAllWorks } = usePpr();
  const { data: sessionData } = useSession();

  const unitiesShortNames = getShortNamesForAllHierarchy(sessionData?.user || {});

  return (
    <Tooltip title="Массово заполнить подразделение">
      <Button
        disabled={!unitiesShortNames.subdivisionShortName}
        icon={<FormOutlined />}
        type="text"
        shape="circle"
        onClick={() => setOneUnityInAllWorks(unitiesShortNames.subdivisionShortName || "")}
      />
    </Tooltip>
  );
};
