"use client";
import clsx from "clsx";
import Tabs from "antd/es/tabs";
import { useEffect } from "react";

import { PprTable } from "@/4widgets/pprTable";
import { WorkingMansTable } from "@/4widgets/workingMansTable";
import { CorrectionRaport } from "@/4widgets/correctionRaport";
import { MonthPlan } from "@/4widgets/monthPlan";
import { usePprTableSettings } from "@/2entities/ppr";

import style from "./PprPage.module.scss";

export const PprPage = () => {
  const { currentTimePeriod } = usePprTableSettings();

  useEffect(() => {
    function confirmExitPage(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", confirmExitPage);

    return () => {
      window.removeEventListener("beforeunload", confirmExitPage);
    };
  }, []);

  return (
    <Tabs
      className={clsx(style.fixAntdTab, "print:overflow-visible")}
      defaultActiveKey="2"
      destroyInactiveTabPane
      items={[
        {
          key: "1",
          label: "Настой часов",
          children: (
            <>
              <h2 className="text-center font-bold text-xl mb-2">
                ФОНД
                <br />
                рабочего времени
              </h2>
              <WorkingMansTable />
            </>
          ),
        },
        {
          key: "2",
          label: "План ТОиР",
          children: (
            <>
              <h2 className="text-center font-bold text-xl mb-2">
                ЗАТРАТЫ ТРУДА
                <br />
                на запланированные и фактически выполненные работы
              </h2>
              <PprTable />
            </>
          ),
        },
        {
          key: "3",
          label: "Месячный план",
          disabled: currentTimePeriod === "year",
          children: <MonthPlan />,
        },
        {
          key: "4",
          disabled: currentTimePeriod === "year",
          label: "Рапорт на корректировку плана",
          children: <CorrectionRaport />,
        },
      ]}
    />
  );
};
