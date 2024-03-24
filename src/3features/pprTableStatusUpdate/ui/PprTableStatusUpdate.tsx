"use client";
import { usePprTableData } from "@/2entities/pprTable";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface IPprTableStatusUpdateProps {}

export const PprTableStatusUpdate: FC<IPprTableStatusUpdateProps> = () => {
  const { data } = useSession();
  const {
    pprData: {
      id: ppr_id,
      created_at: ppr_created_at,
      created_by: ppr_created_by,
      monthsStatus: ppr_monthsStatus,
      status: ppr_status,
    },
  } = usePprTableData();
  if (!data) {
    throw Error("Unauthorized");
  }
  const { id: user_id, id_direction, id_distance, id_subdivision, role } = data.user;
  return <div></div>;
};
