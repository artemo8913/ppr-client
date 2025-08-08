import type { UserRole } from "@/2entities/user/@x/ppr";

import { YearPlanStatus } from "../ppr.types";

const NEXT_YEAR_PLAN_STATUS: { [key in YearPlanStatus]: YearPlanStatus | null } = {
  template: null,
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_sub_boss",
  plan_on_agreement_sub_boss: "plan_on_aprove",
  plan_on_aprove: "in_process",
  in_process: "done",
  done: null,
};

export type YearPlanStatusConfig = {
  [status in YearPlanStatus]?: {
    [role in UserRole]?: { canUpdate?: boolean; canReject?: boolean };
  };
};

const YEAR_STATUS_UPDATE_CONFIG: YearPlanStatusConfig = {
  plan_creating: { subdivision: { canUpdate: true } },
  plan_on_agreement_engineer: {
    distance_engineer: { canUpdate: true, canReject: true },
  },
  plan_on_agreement_time_norm: {
    distance_time_norm: { canUpdate: true, canReject: true },
  },
  plan_on_agreement_sub_boss: {
    distance_sub_boss: { canUpdate: true, canReject: true },
  },
  plan_on_aprove: { distance_boss: { canUpdate: true, canReject: true } },
  in_process: { distance_boss: { canUpdate: true, canReject: true } },
};

export class YearPlanStatusUpdater {
  private _config: YearPlanStatusConfig = YEAR_STATUS_UPDATE_CONFIG;

  checkIsCanUpdate(status: YearPlanStatus, role: UserRole): boolean {
    return !!this._config?.[status]?.[role]?.canUpdate;
  }

  checkIsCanReject(status: YearPlanStatus, role: UserRole): boolean {
    return !!this._config?.[status]?.[role]?.canReject;
  }

  getStatusForReject(): YearPlanStatus {
    return "plan_creating";
  }

  getNextStatus(currentStatus: YearPlanStatus): YearPlanStatus | null {
    return NEXT_YEAR_PLAN_STATUS[currentStatus];
  }
}
