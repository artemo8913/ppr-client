"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { isAllMonthsPprStatusesIsDone } from "../lib/checkMonthStatus";
import { updatePprTable } from "@/1shared/api/pprTable/pprTable.actions";
import { TYearPprStatus } from "@/1shared/api/pprTable";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IPprTableStatusUpdateProps {}

export const PprTableStatusUpdate: FC<IPprTableStatusUpdateProps> = ({}) => {
  const { data } = useSession();
  const { pprData } = usePprTableData();

  const updateStatus = useCallback(
    (status: TYearPprStatus) => pprData?.id && updatePprTable(pprData.id, { status }),
    [pprData]
  );
  if (!data || !pprData) {
    return null;
  }
  const { created_by: ppr_created_by, months_statuses: ppr_months_statuses, status: ppr_status } = pprData;
  const { id_distance: user_id_distance, id_subdivision: user_id_subdivision, role: user_role } = data.user;

  const isMySubdivision = ppr_created_by?.id_subdivision === user_id_subdivision;
  const isMyDistance = ppr_created_by?.id_distance === user_id_distance;

  const isForSubdivision = user_role === "subdivision" && isMySubdivision;
  const isForEngineer = user_role === "distance_engineer" && isMyDistance;
  const isForTimeNorm = user_role === "distance_time_norm" && isMyDistance;
  const isForSecurityEngineer = user_role === "distance_security_engineer" && isMyDistance;
  const isForSubBoss = user_role === "distance_sub_boss" && isMyDistance;
  const isForBoss = user_role === "distance_boss" && isMyDistance;
  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (ppr_status === "plan_creating") {
      return <Button onClick={() => updateStatus("plan_on_agreement_engineer")}>Отправить на согласование</Button>;
    }
    if (ppr_status === "plan_on_correction") {
      return <Button onClick={() => updateStatus("plan_creating")}>Исправить замечания ППР</Button>;
    }
    if (ppr_status === "plan_aproved") {
      return <Button onClick={() => updateStatus("in_process")}>Взять в работу</Button>;
    }
    if (ppr_status === "in_process" && isAllMonthsPprStatusesIsDone(ppr_months_statuses)) {
      return <Button onClick={() => updateStatus("done")}>Завершить выполнение ППР</Button>;
    }
    if (
      ppr_status === "plan_on_agreement_engineer" ||
      ppr_status === "plan_on_agreement_time_norm" ||
      ppr_status === "plan_on_agreement_security_engineer" ||
      ppr_status === "plan_on_agreement_sub_boss" ||
      ppr_status === "plan_on_aprove"
    ) {
      return <Button onClick={() => updateStatus("plan_creating")}>Отозвать</Button>;
    }
  }
  // Состояния для инеженера
  if (isForEngineer && ppr_status === "plan_on_agreement_engineer") {
    return (
      <>
        <Button onClick={() => updateStatus("plan_on_correction")}>Отклонить</Button>
        <Button onClick={() => updateStatus("plan_on_agreement_time_norm")}>Согласовать</Button>
      </>
    );
  }
  // Состояния для нормировщика
  if (isForTimeNorm && ppr_status === "plan_on_agreement_time_norm") {
    return (
      <>
        <Button onClick={() => updateStatus("plan_on_correction")}>Отклонить</Button>
        <Button onClick={() => updateStatus("plan_on_agreement_security_engineer")}>Согласовать</Button>
      </>
    );
  }
  // Состояния для специалиста по охране труда
  if (isForSecurityEngineer && ppr_status === "plan_on_agreement_security_engineer") {
    return (
      <>
        <Button onClick={() => updateStatus("plan_on_correction")}>Отклонить</Button>
        <Button onClick={() => updateStatus("plan_on_agreement_sub_boss")}>Согласовать</Button>
      </>
    );
  }
  // Состояния для замначальника дистанции
  if (isForSubBoss && ppr_status === "plan_on_agreement_sub_boss") {
    return (
      <>
        <Button onClick={() => updateStatus("plan_on_correction")}>Отклонить</Button>
        <Button onClick={() => updateStatus("plan_on_aprove")}>Согласовать</Button>
      </>
    );
  }
  // Состояние для начальника (ответственного за электрохозяйство)
  if (isForBoss && ppr_status === "plan_on_aprove") {
    return (
      <>
        <Button onClick={() => updateStatus("plan_on_correction")}>Отклонить</Button>
        <Button onClick={() => updateStatus("plan_aproved")}>Утвердить</Button>
      </>
    );
  }
  // Создать ППР на основе шаблона
  if (
    ppr_status === "template" ||
    ppr_status === "plan_aproved" ||
    ppr_status === "in_process" ||
    ppr_status === "done"
  ) {
    return <Button>Создать ППР на основе шаблона</Button>;
  }
  // Все остальные варианты
  return null;
};
