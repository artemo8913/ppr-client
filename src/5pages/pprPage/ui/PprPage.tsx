"use client";
import Tabs from "antd/es/tabs";
import { WorkingManAdd } from "@/3features/pprWorkingMans/add";
import { PprTable } from "@/4widgets/pprTable";
import { WorkingMansTable } from "@/4widgets/workingMansTable";
import { CorrectionRaport } from "@/4widgets/correctionRaport";
import { MonthPlan } from "@/4widgets/monthPlan";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

export const PprPage = () => {
  const { currentTimePeriod } = usePprTableSettings();

  return (
    <Tabs
      defaultActiveKey="2"
      destroyInactiveTabPane
      items={[
        {
          key: "1",
          label: "Настой часов",
          children: (
            <div className="h-[80vh] overflow-auto">
              <WorkingManAdd className="mb-2" />
              <WorkingMansTable />
            </div>
          ),
        },
        {
          key: "2",
          label: "План ТОиР",
          children: (
            // TODO #16 Переписать на свой компонент табы. Здесь костыль с высотой
            <div className="h-[80vh] overflow-auto">
              <PprTable />
            </div>
          ),
        },
        {
          key: "3",
          label: "Месячный план",
          disabled: currentTimePeriod === "year",
          children: (
            <div className="h-[80vh] overflow-auto">
              <MonthPlan />
            </div>
          ),
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
