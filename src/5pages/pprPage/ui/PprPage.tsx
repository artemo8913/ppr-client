"use client";
import Tabs from "antd/es/tabs";

import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { WorkingManAdd } from "@/3features/pprWorkingMans/add";
import { PprTable } from "@/4widgets/pprTable";
import { WorkingMansTable } from "@/4widgets/workingMansTable";
import { CorrectionRaport } from "@/4widgets/correctionRaport";
import { MonthPlan } from "@/4widgets/monthPlan";

export const PprPage = () => {
  const { currentTimePeriod } = usePprTableSettings();

  return (
    <Tabs
      className="overflow-auto print:overflow-visible"
      defaultActiveKey="2"
      destroyInactiveTabPane
      items={[
        {
          key: "1",
          label: "Настой часов",
          children: (
            <div>
              <WorkingManAdd className="mb-2" />
              <WorkingMansTable />
            </div>
          ),
        },
        {
          key: "2",
          label: "План ТОиР",
          children: <PprTable />,
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
