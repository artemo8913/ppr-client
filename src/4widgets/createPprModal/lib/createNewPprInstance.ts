import { Session } from "next-auth";
import { IPpr } from "@/2entities/ppr";

export function createNewPprInstance(session: Session | null, values?: Partial<IPpr>): Omit<IPpr, "id"> {
  return {
    data: [],
    id_direction: session?.user.idDirection || null,
    id_distance: session?.user.idDistance || null,
    id_subdivision: session?.user.idSubdivision || null,
    name: "ППР",
    status: "plan_creating",
    year: new Date().getFullYear(),
    created_at: new Date().toString(),
    created_by: session?.user!,
    peoples: [],
    total_fields_value: { peoples: {}, works: {} },
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
    ...values,
  };
}
