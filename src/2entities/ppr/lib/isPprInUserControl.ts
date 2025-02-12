import { IUser } from "@/2entities/user/@x/ppr";

//TODO: вынести в usePpr и брать результат функции из хука (не вызывать везде и постоянно)
/**Подходит ли данный ППР для определенных ролей (начальника цеха, инженера, заместителя начальника дистанции, начальника дистанции и т.п.) */
export function checkIsPprInUserControl(ppr_created_by?: IUser, userData?: IUser) {
  if (!ppr_created_by || !userData) {
    return {
      isPprCreatedByThisUser: false,
      isForSubdivision: false,
      isForEngineer: false,
      isForTimeNorm: false,
      isForSecurityEngineer: false,
      isForSubBoss: false,
      isForBoss: false,
    };
  }

  const { idDistance, idSubdivision, role: userRole } = userData;

  // Проверка принадлежности ППР к подразделению/дистанции/дирекции
  const isUserSubdivision = ppr_created_by.idSubdivision === idSubdivision;
  const isUserDistance = ppr_created_by.idDistance === idDistance;

  // Проверка соответствия роли и подразделения/дистанции/дирекции
  const isForSubdivision = userRole === "subdivision" && isUserSubdivision;
  const isForEngineer = userRole === "distance_engineer" && isUserDistance;
  const isForTimeNorm = userRole === "distance_time_norm" && isUserDistance;
  const isForSecurityEngineer = userRole === "distance_security_engineer" && isUserDistance;
  const isForSubBoss = userRole === "distance_sub_boss" && isUserDistance;
  const isForBoss = userRole === "distance_boss" && isUserDistance;

  // Создан ли ППР данным пользователем
  const isPprCreatedByThisUser = ppr_created_by.id === userData.id;

  return {
    isPprCreatedByThisUser,
    isForSubdivision,
    isForEngineer,
    isForTimeNorm,
    isForSecurityEngineer,
    isForSubBoss,
    isForBoss,
  };
}
