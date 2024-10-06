import { TUserRole } from "../model/user.types";

const USER_ROLE_RU: { [key in TUserRole]: string } = {
  subdivision: "Начальник подразделения",
  distance_engineer: "Отраслевой инженер",
  distance_time_norm: "Инженер по нормированию труда",
  distance_security_engineer: "Специалист по охране труда",
  distance_sub_boss: "Отраслевой заместитель начальника дистанции",
  distance_boss: "Начальник (ответственный за электрохозяйство) дистанции",
  direction: "Работник дирекции",
  transenergo: "Работник ТрансЭнерго",
};

export function translateRuUserRole(role: TUserRole): string | undefined {
  return USER_ROLE_RU[role];
}
