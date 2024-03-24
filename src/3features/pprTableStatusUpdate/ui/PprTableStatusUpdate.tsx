"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { usePprTableData } from "@/2entities/pprTableProvider";
import { isAllMonthsPprStatusesIsDone } from "../lib/checkMonthStatus";

interface IPprTableStatusUpdateProps {}

export const PprTableStatusUpdate: FC<IPprTableStatusUpdateProps> = () => {
  const { data } = useSession();
  const { pprData } = usePprTableData();
  if (!data) {
    throw Error("Unauthorized");
  }
  if (!pprData) {
    return null;
  }
  const {
    created_at: ppr_created_at,
    created_by: ppr_created_by,
    data: ppr_data,
    id: ppr_id,
    id_direction: ppr_id_direction,
    id_distance: ppr_id_distance,
    id_subdivision: ppr_id_subdivision,
    months_statuses: ppr_months_statuses,
    name: ppr_name,
    status: ppr_status,
  } = pprData;
  const {
    id: user_id,
    id_direction: user_id_direction,
    id_distance: user_id_distance,
    id_subdivision: user_id_subdivision,
    role: user_role,
  } = data.user;

  const isMyPpr = ppr_created_by?.id_subdivision === user_id_subdivision;

  if (isMyPpr && ppr_status === "none") {
    return <Button>Создать ППР</Button>;
  }
  if (isMyPpr && ppr_status === "plan_creating") {
    return <Button>Отправить на согласование</Button>;
  }
  if (isMyPpr && ppr_status === "plan_on_correction") {
    return <Button>Исправить замечания ППР</Button>;
  }
  if (isMyPpr && ppr_status === "plan_aproved") {
    return <Button>Взять в работу</Button>;
  }
  if (isMyPpr && ppr_status === "in_process" && isAllMonthsPprStatusesIsDone(ppr_months_statuses)) {
    return <Button>Завершить выполнение ППР</Button>;
  }
  if (!isMyPpr || ppr_status === "template") {
    return <Button>Создать ППР на основе шаблона</Button>;
  }
  return null;
};
