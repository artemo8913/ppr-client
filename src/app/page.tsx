import { getServerSession } from "next-auth";
import { authOptions } from "../1shared/auth/authConfig";
import { IUser } from "@/2entities/user";
import { directions } from "@/1shared/types/transEnergoDivisions";

export default async function Home() {
  const user = await getServerSession(authOptions);
  const userData: IUser = user?.user;
  const { id, id_direction, id_distance, id_subdivision, role } = userData;
  return (
    <main>
      <div>{id_direction ? directions[id_direction].short_name : null}</div>
      <div>{id_distance && id_direction ? directions[id_direction].distances[id_distance].short_name : null}</div>
      <div>ЭЧК-{id_subdivision}</div>
    </main>
  );
}
