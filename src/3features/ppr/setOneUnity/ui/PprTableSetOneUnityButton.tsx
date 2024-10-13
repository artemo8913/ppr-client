"use client";
import { useMemo } from "react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { FormOutlined } from "@ant-design/icons";

import { checkIsPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";

export const PprTableSetOneUnityButton = () => {
  const { ppr, setOneUnityInAllWorks } = usePpr();
  const { data: credential } = useSession();

  const subdivisionShortName = credential?.user.subdivisionShortName;

  const isPprInUserControl = useMemo(
    () => checkIsPprInUserControl(ppr?.created_by, credential?.user).isForSubdivision,
    [credential?.user, ppr?.created_by]
  );

  const handleClick = () => {
    subdivisionShortName && setOneUnityInAllWorks(subdivisionShortName);
  };

  return (
    <Tooltip title="Массово заполнить подразделение">
      <Button
        disabled={!subdivisionShortName || !isPprInUserControl}
        icon={<FormOutlined />}
        type="text"
        shape="circle"
        onClick={handleClick}
      />
    </Tooltip>
  );
};
