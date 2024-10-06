import { IUser } from "@/2entities/user";

/**Подходит ли данный ППР для определенных ролей (начальника цеха, инженера, заместителя начальника дистанции, начальника дистанции и т.п.) */
export function checkIsPprInUserControl(ppr_created_by?: IUser, userData?: IUser) {
  if (!ppr_created_by || !userData) {
    return {
      isForSubdivision: false,
      isForEngineer: false,
      isForTimeNorm: false,
      isForSecurityEngineer: false,
      isForSubBoss: false,
      isForBoss: false,
    };
  }

  const { idDistance, idSubdivision, idDirection, role } = userData;

  // Проверка принадлежности ППР к подразделению/дистанции/дирекции
  const isMySubdivision = ppr_created_by?.idSubdivision === idSubdivision;
  const isMyDistance = ppr_created_by?.idDistance === idDistance;
  const isMyDirection = ppr_created_by?.idDirection === idDirection;

  // Проверка соответствия роли и подразделения/дистанции/дирекции
  const isForSubdivision = role === "subdivision" && isMySubdivision && isMyDistance && isMyDirection;
  const isForEngineer = role === "distance_engineer" && isMyDistance && isMyDirection;
  const isForTimeNorm = role === "distance_time_norm" && isMyDistance && isMyDirection;
  const isForSecurityEngineer = role === "distance_security_engineer" && isMyDistance && isMyDirection;
  const isForSubBoss = role === "distance_sub_boss" && isMyDistance && isMyDirection;
  const isForBoss = role === "distance_boss" && isMyDistance && isMyDirection;

  return { isForSubdivision, isForEngineer, isForTimeNorm, isForSecurityEngineer, isForSubBoss, isForBoss };
}
