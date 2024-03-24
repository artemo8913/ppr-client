"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { usePprTableData } from "@/2entities/pprTableProvider";

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
  const {
    id: user_id,
    id_direction: user_id_direction,
    id_distance: user_id_distance,
    id_subdivision: user_id_subdivision,
    role: user_role,
  } = data.user;

  const isMyPpr = ppr_created_by?.id_subdivision === user_id_subdivision;

  return <Button>sad</Button>;
};
