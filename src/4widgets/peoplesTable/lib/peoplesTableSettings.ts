import { ITableCell } from "@/1shared/ui/table";
import { IWorkingManYearPlan, TYearPprStatus } from "@/2entities/pprTable";

export function getColumnSettings(status?: TYearPprStatus): { [name in keyof IWorkingManYearPlan]?: ITableCell } {
  if (status === "plan_creating") {
    return {
      full_name: { cellType: "textarea" },
      work_position: { cellType: "textarea" },
      participation: { cellType: "input" },
      jan_plan_time: { cellType: "input" },
      feb_plan_time: { cellType: "input" },
      mar_plan_time: { cellType: "input" },
      apr_plan_time: { cellType: "input" },
      may_plan_time: { cellType: "input" },
      june_plan_time: { cellType: "input" },
      july_plan_time: { cellType: "input" },
      aug_plan_time: { cellType: "input" },
      sept_plan_time: { cellType: "input" },
      oct_plan_time: { cellType: "input" },
      nov_plan_time: { cellType: "input" },
      dec_plan_time: { cellType: "input" },
    };
  } else if (status === "in_process") {
    return {};
  }
  return {};
}
