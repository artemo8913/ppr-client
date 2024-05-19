import { months } from "@/1shared/types/date";
import { IPpr, TAllMonthStatuses, TMonthPprStatus, TYearPprStatus } from "@/2entities/pprTable";
import { IUser } from "@/2entities/user";

export function isAllMonthsPprStatusesIsDone(monthsStatuses: TAllMonthStatuses) {
  let result = true;
  months.forEach((month) => {
    if (monthsStatuses[month] !== "done") {
      result = false;
    }
  });
  return result;
}

const nextPprYearStatus: { [key in TYearPprStatus]?: TYearPprStatus | undefined } = {
  template: undefined,
  plan_on_correction: "plan_creating",
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_agreement_security_engineer",
  plan_on_agreement_security_engineer: "plan_on_agreement_sub_boss",
  plan_on_agreement_sub_boss: "plan_on_aprove",
  plan_on_aprove: "plan_aproved",
  plan_aproved: "in_process",
  in_process: "done",
  done: undefined,
};

const nextPprMonthStatus: { [key in TMonthPprStatus]?: TMonthPprStatus | undefined } = {
  none: "plan_creating",
  plan_on_correction: "plan_creating",
  plan_creating: "plan_on_agreement_engineer",
  plan_on_agreement_engineer: "plan_on_agreement_time_norm",
  plan_on_agreement_time_norm: "plan_on_aprove",
  plan_on_aprove: "plan_aproved",
  plan_aproved: "in_process",
  in_process: "fact_filling",
  fact_filling: "fact_verification_engineer",
  fact_verification_engineer: "fact_verification_time_norm",
  fact_verification_time_norm: "fact_on_agreement_sub_boss",
  fact_on_agreement_sub_boss: "done",
  done: "plan_on_correction",
};
/**Подходит ли данный ППР для определенных ролей (начальника цеха, инженера, заместителя начальника дистанции, начальника дистанции и т.п.) */
export function isPprInUserControl(ppr: IPpr, userData: IUser) {
  const { created_by: ppr_created_by } = ppr;
  const {
    id_distance: user_id_distance,
    id_subdivision: user_id_subdivision,
    id_direction: user_id_direction,
    role: user_role,
  } = userData;

  // Проверка принадлежности ППР к подразделению/дистанции/дирекции
  const isMySubdivision = ppr_created_by?.id_subdivision === user_id_subdivision;
  const isMyDistance = ppr_created_by?.id_distance === user_id_distance;
  const isMyDirection = ppr_created_by?.id_direction === user_id_direction;

  // Проверка соответствия роли и подразделения/дистанции/дирекции
  const isForSubdivision = user_role === "subdivision" && isMySubdivision && isMyDistance && isMyDirection;
  const isForEngineer = user_role === "distance_engineer" && isMyDistance && isMyDirection;
  const isForTimeNorm = user_role === "distance_time_norm" && isMyDistance && isMyDirection;
  const isForSecurityEngineer = user_role === "distance_security_engineer" && isMyDistance && isMyDirection;
  const isForSubBoss = user_role === "distance_sub_boss" && isMyDistance && isMyDirection;
  const isForBoss = user_role === "distance_boss" && isMyDistance && isMyDirection;

  return { isForSubdivision, isForEngineer, isForTimeNorm, isForSecurityEngineer, isForSubBoss, isForBoss };
}

export function getNextPprYearStatus(currentStatus: TYearPprStatus): TYearPprStatus | undefined {
  return nextPprYearStatus[currentStatus];
}

export function getNextPprMonthStatus(currentStatus: TMonthPprStatus): TMonthPprStatus | undefined {
  return nextPprMonthStatus[currentStatus];
}
