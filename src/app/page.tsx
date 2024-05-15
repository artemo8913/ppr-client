import { getServerSession } from "next-auth";
import { authOptions } from "../1shared/auth/authConfig";
import { IUser, getUserData } from "@/2entities/user";
import { directions } from "@/1shared/types/transEnergoDivisions";

export default async function Home() {
  const user = await getServerSession(authOptions);
  if (!user) {
    return null;
  }

  const credentials: IUser = user?.user;
  const { id, id_direction, id_distance, id_subdivision, role } = credentials;
  const userData = await getUserData(id);
  
  return (
    <main>
      <div>{id_direction ? directions[id_direction].short_name : null}</div>
      <div>{id_distance && id_direction ? directions[id_direction].distances[id_distance].short_name : null}</div>
      <div>ЭЧК-{id_subdivision}</div>
    </main>
  );
}
