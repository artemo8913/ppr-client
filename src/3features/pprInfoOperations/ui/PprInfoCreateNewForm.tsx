import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authConfig";
import { IAddPprInfoRequest } from "@/2entities/pprInfo";
import { ActionButton } from "@/1shared/ui/button";
import { createPpr } from "..";
import { Submit } from "./PprInfoCreateNewFormSubmit";

export async function PprInfoCreateNewForm() {
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
