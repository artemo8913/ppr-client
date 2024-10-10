import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth/authConfig";
import { translateRuUserRole } from "@/1shared/locale/user";
import { IUser } from "@/2entities/user";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user: IUser = session?.user;

  const { id, role, firstName, middleName, lastName, directionShortName, distanceShortName, subdivisionShortName } =
    user;

  const fullName = `${lastName} ${firstName[0]}.${middleName[0]}.`;

  return (
    <main>
      <div>id: {id}</div>
      <div>Дирекция: {directionShortName}</div>
      <div>Дистанция: {distanceShortName}</div>
      <div>Подразделение: {subdivisionShortName}</div>
      <div>Роль: {translateRuUserRole(role)}</div>
      <div>Ф.И.О.: {fullName}</div>
    </main>
  );
}
