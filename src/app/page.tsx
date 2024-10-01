import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth/authConfig";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";
import { IUser, translateRuUserRole } from "@/2entities/user";

export default async function Home() {
  const user = await getServerSession(authOptions);

  if (!user) {
    return null;
  }

  const credentials: IUser = user?.user;
  const { id, idDirection, idDistance, idSubdivision, role, firstName, middleName, lastName } = credentials;

  const fullName = `${lastName} ${firstName[0]}.${middleName[0]}.`;

  return (
    <main>
      <div>id: {id}</div>
      <div>{idDirection ? directionsMock[idDirection].short_name : null}</div>
      <div>{idDistance && idDirection ? directionsMock[idDirection].distances[idDistance].short_name : null}</div>
      <div>ЭЧК-{idSubdivision}</div>
      <div>Роль: {translateRuUserRole(role)}</div>
      <div>Ф.И.О.: {fullName}</div>
    </main>
  );
}
