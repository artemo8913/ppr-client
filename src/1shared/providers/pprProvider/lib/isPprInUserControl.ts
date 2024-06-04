import { IUser } from "@/2entities/user";

/**Подходит ли данный ППР для определенных ролей (начальника цеха, инженера, заместителя начальника дистанции, начальника дистанции и т.п.) */
export function isPprInUserControl(ppr_created_by: IUser, userData: IUser) {
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
