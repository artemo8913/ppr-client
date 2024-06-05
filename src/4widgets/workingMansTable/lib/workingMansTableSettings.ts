import { ITableCellProps } from "@/1shared/ui/table";
import { IWorkingManYearPlan, TYearPprStatus } from "@/2entities/ppr";

export function getColumnSettings(status?: TYearPprStatus): { [name in keyof IWorkingManYearPlan]?: ITableCellProps } {
  if (status === "plan_creating") {
    return {
      full_name: { cellType: "textarea" },
      work_position: { cellType: "textarea" },
      participation: { cellType: "input" },
      jan_plan_norm_time: { cellType: "input" },
      feb_plan_norm_time: { cellType: "input" },
      mar_plan_norm_time: { cellType: "input" },
      apr_plan_norm_time: { cellType: "input" },
      may_plan_norm_time: { cellType: "input" },
      june_plan_norm_time: { cellType: "input" },
      july_plan_norm_time: { cellType: "input" },
      aug_plan_norm_time: { cellType: "input" },
      sept_plan_norm_time: { cellType: "input" },
      oct_plan_norm_time: { cellType: "input" },
      nov_plan_norm_time: { cellType: "input" },
      dec_plan_norm_time: { cellType: "input" },
      jan_plan_tabel_time: { cellType: "input" },
      feb_plan_tabel_time: { cellType: "input" },
      mar_plan_tabel_time: { cellType: "input" },
      apr_plan_tabel_time: { cellType: "input" },
      may_plan_tabel_time: { cellType: "input" },
      june_plan_tabel_time: { cellType: "input" },
      july_plan_tabel_time: { cellType: "input" },
      aug_plan_tabel_time: { cellType: "input" },
      sept_plan_tabel_time: { cellType: "input" },
      oct_plan_tabel_time: { cellType: "input" },
      nov_plan_tabel_time: { cellType: "input" },
      dec_plan_tabel_time: { cellType: "input" },
    };
  } else if (status === "in_process") {
    return {};
  }
  return {};
}
