"use client";
import { useSession } from "next-auth/react";
import { Tooltip } from "antd";
import Button from "antd/es/button";
import { FormOutlined } from "@ant-design/icons";

import { usePpr } from "@/1shared/providers/pprProvider";

export const PprTableSetOneUnityButton = () => {
  const { setOneUnityInAllWorks } = usePpr();
  const { data: session } = useSession();

  const subdivisionShortName = session?.user.subdivisionShortName;

  const handleClick = () => {
    subdivisionShortName && setOneUnityInAllWorks(subdivisionShortName);
  };

  return (
    <Tooltip title="Массово заполнить подразделение">
      <Button
        disabled={!subdivisionShortName}
        icon={<FormOutlined />}
        type="text"
        shape="circle"
        onClick={handleClick}
      />
    </Tooltip>
  );
};
