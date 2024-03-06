import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authConfig";
import { createPpr } from "@/1shared/api/ppr";
import { Submit } from "./PprCreateNewSubmit";

export async function PprCreateNewForm() {
  const session = await getServerSession(authOptions);
  const newPprData = {
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
