import { authOptions } from "@/1shared/auth/authConfig";
import { IAddPprInfoRequest } from "@/2entities/PprInfo/model/pprInfo.shema";
import { getServerSession } from "next-auth";
import { Submit } from "./PprInfoCreatePprFormSubmit";
import { createPpr } from "..";

export async function PprInfoCreatePprForm() {
  const session = await getServerSession(authOptions);
  const newPprData: IAddPprInfoRequest = {
    id_direction: session?.user.id_direction || null,
    id_distance: session?.user.id_distance || null,
    id_subdivision: session?.user.id_subdivision || null,
    name: "ППР",
    year: 2024,
  };
  return (
    <form
      action={async () => {
        "use server";
        await createPpr(newPprData);
      }}
    >
      <Submit />
    </form>
  );
}
