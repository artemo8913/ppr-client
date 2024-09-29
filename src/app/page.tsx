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
  const { id, id_direction, id_distance, id_subdivision, role, first_name, middle_name, last_name } = credentials;

  const fullName = `${last_name} ${first_name[0]}.${middle_name[0]}.`;

  return (
    <main>
      <div>id: {id}</div>
      <div>{id_direction ? directionsMock[id_direction].short_name : null}</div>
      <div>{id_distance && id_direction ? directionsMock[id_direction].distances[id_distance].short_name : null}</div>
      <div>ЭЧК-{id_subdivision}</div>
      <div>Роль: {translateRuUserRole(role)}</div>
      <div>Ф.И.О.: {fullName}</div>
    </main>
  );
}
