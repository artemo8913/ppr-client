import { TTimePeriod, TIME_PERIODS } from "@/1shared/const/date";
import { IWorkingManYearPlan } from "@/2entities/ppr";

const columnsDefault: (keyof IWorkingManYearPlan)[] = ["full_name", "work_position", "participation"];

function getPlanFactColumns(pprTimePeriod: TTimePeriod): Array<keyof IWorkingManYearPlan> {
  return [
    `${pprTimePeriod}_plan_norm_time`,
    `${pprTimePeriod}_plan_tabel_time`,
    `${pprTimePeriod}_plan_time`,
    `${pprTimePeriod}_fact_time`,
  ];
}

export const useCreateColumns = (): {
  columnsDefault: (keyof IWorkingManYearPlan)[];
  timePeriods: TTimePeriod[];
  timePeriodsColumns: (keyof IWorkingManYearPlan)[][];
} => {
  return {
    columnsDefault,
    timePeriods: TIME_PERIODS,
    timePeriodsColumns: TIME_PERIODS.map((period) => getPlanFactColumns(period)),
  };
};
