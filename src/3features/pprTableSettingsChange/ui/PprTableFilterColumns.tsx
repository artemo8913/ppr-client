"use client";
import Select, { DefaultOptionType } from "antd/es/select";
import { FC } from "react";
import { TFilterTimePeriodOption, TFilterPlanFactOption, usePprTableSettings } from "@/1shared/providers/pprTableProvider";

interface IPprTableSelectFilterTimePeriodProps {}

export const PprTableSelectFilterTimePeriod: FC<IPprTableSelectFilterTimePeriodProps> = () => {
  const { filterColumns, setFilterMonths } = usePprTableSettings();
  return (
    <Select<TFilterTimePeriodOption, { value: TFilterTimePeriodOption } & DefaultOptionType>
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
    <Select<TFilterPlanFactOption, { value: TFilterPlanFactOption } & DefaultOptionType>
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
