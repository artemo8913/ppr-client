"use client";
import { PeoplesTable } from "./PeoplesTable";
import { IWorkingManYearPlan } from "@/2entities/pprTable";
import { WorkingManDelete } from "@/3features/workingManDelete";
import { FC, useState } from "react";

const defaultData: IWorkingManYearPlan[] = [
  {
    id: "1",
    full_name: "Спиряев Артем Сергеевич",
    work_position: "инженер",
    participation: 0.5,
    year_plan_time: 100,
    year_fact_time: 100,
  },
];

interface IPeoplesWidgetProps {}

export const PeoplesWidget: FC<IPeoplesWidgetProps> = () => {
  const [data, setData] = useState(() => [...defaultData]);

  return (
    <PeoplesTable
      data={data}
      OperationsInRow={(props) => (
        <>
          <WorkingManDelete id={props.id} />
        </>
      )}
    />
  );
};
