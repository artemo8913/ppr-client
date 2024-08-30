import { getServerSession } from "next-auth";
import { authOptions } from "../1shared/auth/authConfig";
import { IUser } from "@/2entities/user";
import { directionsMock } from "@/1shared/lib/transEnergoDivisions";

export default async function Home() {
  const user = await getServerSession(authOptions);
  if (!user) {
    return null;
  }

  const credentials: IUser = user?.user;
  const { id, id_direction, id_distance, id_subdivision, role } = credentials;

  return (
    <main>
      <div>{id_direction ? directionsMock[id_direction].short_name : null}</div>
      <div>
        {id_distance && id_direction
          ? directionsMock[id_direction].distances[id_distance].short_name
          : null}
      </div>
      <div>ЭЧК-{id_subdivision}</div>
    </main>
  );
}
