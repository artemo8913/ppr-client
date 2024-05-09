import { getServerSession } from "next-auth";
import { authOptions } from "@/1shared/auth/authConfig";
import { ServerSubmitButton } from "@/1shared/ui/button";
import { IPpr, addPprTable } from "@/2entities/pprTable";

export async function PprCreateNewButton() {
  const session = await getServerSession(authOptions);
  const newPprData: Omit<IPpr, "id"> = {
    data: [],
    id_direction: session?.user.id_direction || null,
    id_distance: session?.user.id_distance || null,
    id_subdivision: session?.user.id_subdivision || null,
    name: "ППР",
    status: "plan_creating",
    year: new Date().getFullYear(),
    created_at: new Date().toString(),
    created_by: session?.user!,
    peoples: [],
    corrections: { peoples: {}, works: {} },
    months_statuses: {
      jan: "none",
      feb: "none",
      mar: "none",
      apr: "none",
      may: "none",
      june: "none",
      july: "none",
      aug: "none",
      sept: "none",
      oct: "none",
      nov: "none",
      dec: "none",
    },
  };
  return (
    <ServerSubmitButton
      type="primary"
      action={async () => {
        "use server";
        await addPprTable(newPprData);
      }}
    >
      Добавить
    </ServerSubmitButton>
  );
}
