import { TPprTimePeriod, pprTimePeriods } from "@/1shared/lib/date";
import { IWorkingManYearPlan } from "@/2entities/ppr";

const columnsDefault: (keyof IWorkingManYearPlan)[] = ["full_name", "work_position", "participation"];

function getPlanFactColumns(pprTimePeriod: TPprTimePeriod): Array<keyof IWorkingManYearPlan> {
  return [
    `${pprTimePeriod}_plan_norm_time`,
    `${pprTimePeriod}_plan_tabel_time`,
    `${pprTimePeriod}_plan_time`,
    `${pprTimePeriod}_fact_time`,
  ];
}

export const useCreateColumns = (): {
  columnsDefault: (keyof IWorkingManYearPlan)[];
  timePeriods: TPprTimePeriod[];
  timePeriodsColumns: (keyof IWorkingManYearPlan)[][];
} => {
  return {
    columnsDefault,
    timePeriods: pprTimePeriods,
    timePeriodsColumns: pprTimePeriods.map((period) => getPlanFactColumns(period)),
  };
};
