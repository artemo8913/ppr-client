import { Month, MONTHS } from "@/1shared/lib/date";
import type { UserRole } from "@/2entities/user/@x/ppr";

import { MonthPlanStatus } from "../ppr.types";

const NEXT_MONTH_PLAN_STATUS: { [key in MonthPlanStatus]: MonthPlanStatus | null } = {
  none: "plan_creating",
  plan_creating: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_aprove",
  plan_on_aprove: "in_process",
  in_process: "fact_filling",
  fact_filling: "fact_verification_time_norm",
  fact_verification_time_norm: "fact_verification_engineer",
  fact_verification_engineer: "fact_on_agreement_sub_boss",
  fact_on_agreement_sub_boss: "done",
  done: null,
};

const MONTH_PLAN_STATUSES_ON_PLANNING_STAGE: MonthPlanStatus[] = [
  "plan_creating",
  "plan_on_agreement_engineer",
  "plan_on_agreement_time_norm",
  "plan_on_aprove",
];

const MONTH_PLAN_STATUSES_ON_FILLING_STAGE: MonthPlanStatus[] = [
  "fact_filling",
  "fact_verification_engineer",
  "fact_verification_time_norm",
  "fact_on_agreement_sub_boss",
];

type MonthPlanStatusConfig = {
  [status in MonthPlanStatus]?: {
    [role in UserRole]?: { canUpdate?: boolean; canReject?: boolean };
  };
};

const MONTH_STATUS_UPDATE_CONFIG: MonthPlanStatusConfig = {
  none: {
    subdivision: { canUpdate: true },
  },

  plan_creating: { subdivision: { canUpdate: true } },
  plan_on_agreement_engineer: {
    subdivision: { canReject: true },
    distance_engineer: { canUpdate: true, canReject: true },
  },
  plan_on_agreement_time_norm: {
    subdivision: { canReject: true },
    distance_time_norm: { canUpdate: true, canReject: true },
  },
  plan_on_aprove: { subdivision: { canReject: true }, distance_sub_boss: { canUpdate: true, canReject: true } },
  in_process: { subdivision: { canUpdate: true } },
  fact_filling: { subdivision: { canUpdate: true } },
  fact_verification_engineer: {
    subdivision: { canReject: true },
    distance_engineer: { canUpdate: true, canReject: true },
  },
  fact_verification_time_norm: {
    subdivision: { canReject: true },
    distance_time_norm: { canUpdate: true, canReject: true },
  },
  fact_on_agreement_sub_boss: {
    subdivision: { canReject: true },
    distance_sub_boss: { canUpdate: true, canReject: true },
  },
};

export class MonthPlanStatusUpdater {
  private _config: MonthPlanStatusConfig = MONTH_STATUS_UPDATE_CONFIG;

  getStatusForReject(currentStatus: MonthPlanStatus): MonthPlanStatus {
    if (MONTH_PLAN_STATUSES_ON_PLANNING_STAGE.indexOf(currentStatus) !== -1) {
      return "plan_creating";
    } else if (MONTH_PLAN_STATUSES_ON_FILLING_STAGE.indexOf(currentStatus) !== -1) {
      return "fact_filling";
    }
    return currentStatus;
  }

  getNextStatus(currentStatus: MonthPlanStatus): MonthPlanStatus | null {
    return NEXT_MONTH_PLAN_STATUS[currentStatus];
  }

  checkIsDoneAll(monthsStatuses: { [month in Month]: MonthPlanStatus }) {
    let result = true;

    MONTHS.forEach((month) => {
      if (monthsStatuses[month] !== "done") {
        result = false;
      }
    });
    return result;
  }

  checkIsCanUpdate(status: MonthPlanStatus, role: UserRole): boolean {
    return !!this._config?.[status]?.[role]?.canUpdate;
  }

  checkIsCanReject(status: MonthPlanStatus, role: UserRole): boolean {
    return !!this._config?.[status]?.[role]?.canReject;
  }
}
