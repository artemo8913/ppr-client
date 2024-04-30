"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { usePprTableData, usePprTableSettings } from "@/1shared/providers/pprTableProvider";
import { updatePprTable } from "@/2entities/pprTable/model/pprTable.actions";
import { getNextPprYearStatus, isAllMonthsPprStatusesIsDone } from "../lib/pprStatusHepler";

interface IPprTableMonthStatusUpdateProps {}

export const PprTableMonthStatusUpdate: FC<IPprTableMonthStatusUpdateProps> = ({}) => {
  const { data } = useSession();
  const { pprData } = usePprTableData();
  const { currentTimePeriod } = usePprTableSettings();

  const setNextStatus = useCallback(
    () => pprData?.id && updatePprTable(pprData.id, { status: getNextPprYearStatus(pprData?.status) }),
    [pprData?.status, pprData?.id]
  );

  const rejectPpr = useCallback(
    () => pprData?.id && updatePprTable(pprData.id, { status: "plan_on_correction" }),
    [pprData?.id]
  );

  if (!data || !pprData) {
    return null;
  }
  const { created_by: ppr_created_by, months_statuses: ppr_months_statuses, status: ppr_status } = pprData;
  const {
    id_distance: user_id_distance,
    id_subdivision: user_id_subdivision,
    id_direction: user_id_direction,
    role: user_role,
  } = data.user;

  // Проверка принадлежности ППР к подразделению/дистанции/дирекции
  const isMySubdivision = ppr_created_by?.id_subdivision === user_id_subdivision;
  const isMyDistance = ppr_created_by?.id_distance === user_id_distance;
  const isMyDirection = ppr_created_by?.id_direction === user_id_direction;

  // Проверка соответствия роли и подразделения/дистанции/дирекции
  const isForSubdivision = user_role === "subdivision" && isMySubdivision && isMyDistance && isMyDirection;
  const isForEngineer = user_role === "distance_engineer" && isMyDistance && isMyDirection;
  const isForTimeNorm = user_role === "distance_time_norm" && isMyDistance && isMyDirection;
  const isForSecurityEngineer = user_role === "distance_security_engineer" && isMyDistance && isMyDirection;
  const isForSubBoss = user_role === "distance_sub_boss" && isMyDistance && isMyDirection;
  const isForBoss = user_role === "distance_boss" && isMyDistance && isMyDirection;

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (ppr_status === "plan_creating") {
      return <Button onClick={setNextStatus}>Отправить на согласование</Button>;
    }
    if (ppr_status === "plan_on_correction") {
      return <Button onClick={setNextStatus}>Исправить замечания ППР</Button>;
    }
    if (ppr_status === "plan_aproved") {
      return <Button onClick={setNextStatus}>Взять в работу</Button>;
    }
    if (ppr_status === "in_process" && isAllMonthsPprStatusesIsDone(ppr_months_statuses)) {
      return <Button onClick={setNextStatus}>Завершить выполнение ППР</Button>;
    }
    if (
      ppr_status === "plan_on_agreement_engineer" ||
      ppr_status === "plan_on_agreement_time_norm" ||
      ppr_status === "plan_on_agreement_security_engineer" ||
      ppr_status === "plan_on_agreement_sub_boss" ||
      ppr_status === "plan_on_aprove"
    ) {
      return <Button onClick={setNextStatus}>Отозвать</Button>;
    }
  }

  // Состояния для инженера
  if (isForEngineer && ppr_status === "plan_on_agreement_engineer") {
    return (
      <>
        <Button onClick={rejectPpr}>Отклонить</Button>
        <Button onClick={setNextStatus}>Согласовать</Button>
      </>
    );
  }

  // Состояния для нормировщика
  if (isForTimeNorm && ppr_status === "plan_on_agreement_time_norm") {
    return (
      <>
        <Button onClick={rejectPpr}>Отклонить</Button>
        <Button onClick={setNextStatus}>Согласовать</Button>
      </>
    );
  }

  // Состояния для специалиста по охране труда
  if (isForSecurityEngineer && ppr_status === "plan_on_agreement_security_engineer") {
    return (
      <>
        <Button onClick={rejectPpr}>Отклонить</Button>
        <Button onClick={setNextStatus}>Согласовать</Button>
      </>
    );
  }

  // Состояния для замначальника дистанции
  if (isForSubBoss && ppr_status === "plan_on_agreement_sub_boss") {
    return (
      <>
        <Button onClick={rejectPpr}>Отклонить</Button>
        <Button onClick={setNextStatus}>Согласовать</Button>
      </>
    );
  }

  // Состояние для начальника (ответственного за электрохозяйство)
  if (isForBoss && ppr_status === "plan_on_aprove") {
    return (
      <>
        <Button onClick={rejectPpr}>Отклонить</Button>
        <Button onClick={setNextStatus}>Утвердить</Button>
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
