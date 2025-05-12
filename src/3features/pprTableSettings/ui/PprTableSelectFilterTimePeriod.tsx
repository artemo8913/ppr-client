"use client";
import Select from "antd/es/select";
import { FC } from "react";

import { OptionType } from "@/1shared/lib/form/TOptionType";
import { TFilterPlanFactOption, TFilterTimePeriodOption, usePprTableSettings } from "@/2entities/ppr";

interface IPprTableSelectFilterTimePeriodProps {}

export const PprTableSelectFilterTimePeriod: FC<IPprTableSelectFilterTimePeriodProps> = () => {
  const { filterColumns, setFilterMonths } = usePprTableSettings();
  return (
    <Select<TFilterTimePeriodOption, OptionType<TFilterTimePeriodOption>>
      className="min-w-24"
      options={[
        { value: "SHOW_ALL", label: "Все месяца" },
        { value: "SHOW_CURRENT_QUARTAL", label: "Квартал" },
        { value: "SHOW_ONLY_CURRENT_MONTH", label: "Текущий месяц" },
      ]}
      value={filterColumns.months}
      onChange={setFilterMonths}
    />
  );
};

interface IPprTableSelectFilterPlanFactProps {}

export const PprTableSelectFilterPlanFact: FC<IPprTableSelectFilterPlanFactProps> = () => {
  const { filterColumns, setFilterPlanFact } = usePprTableSettings();
  return (
    <Select<TFilterPlanFactOption, OptionType<TFilterPlanFactOption>>
      className="min-w-24"
      options={[
        { value: "SHOW_ALL", label: "Показать все" },
        { value: "SHOW_ONLY_PLAN", label: "Планы" },
        { value: "SHOW_ONLY_FACT", label: "Факт" },
        { value: "SHOW_ONLY_VALUES", label: "Объемы работ" },
      ]}
      value={filterColumns.planFact}
      onChange={setFilterPlanFact}
    />
  );
};
