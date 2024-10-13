"use client";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { Popover } from "antd";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import { useSession } from "next-auth/react";
import { EditOutlined } from "@ant-design/icons";

import { checkIsPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";

interface IFillWorkingManPlanTimeProps {}

export const FillWorkingManPlanTime: FC<IFillWorkingManPlanTimeProps> = () => {
  const { ppr, fillWorkingManPlanTime } = usePpr();

  const [value, setValue] = useState(0);

  const { data: credential } = useSession();

  const isPprInUserControl = useMemo(
    () => checkIsPprInUserControl(ppr?.created_by, credential?.user).isForSubdivision,
    [credential?.user, ppr?.created_by]
  );

  const isDisabled = useMemo(
    () => ppr?.status !== "plan_creating" || !isPprInUserControl,
    [isPprInUserControl, ppr?.status]
  );

  const handleClick = useCallback(() => {
    fillWorkingManPlanTime("NOT_FILLED", value);
  }, [fillWorkingManPlanTime, value]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  }, []);

  const Content = () => {
    return (
      <>
        <Input value={value} disabled={isDisabled} onChange={handleChange} type="number" />
        <Button type="primary" disabled={isDisabled} onClick={handleClick}>
          Заполнить пустые ячейки
        </Button>
      </>
    );
  };

  return (
    <Popover content={Content} title="Заполнить планируемый настой часов">
      <Button type="text" shape="circle" disabled={isDisabled} icon={<EditOutlined className="cursor-pointer" />} />
    </Popover>
  );
};
