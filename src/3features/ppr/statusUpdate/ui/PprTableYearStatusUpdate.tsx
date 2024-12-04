"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";

import {
  usePpr,
  getNextPprYearStatus,
  checkIsAllMonthsPprStatusesIsDone,
  checkIsPprInUserControl,
} from "@/1shared/providers/pprProvider";
import { updatePprTable } from "@/2entities/ppr";

interface IPprTableYearStatusUpdateProps {}

export const PprTableYearStatusUpdate: FC<IPprTableYearStatusUpdateProps> = () => {
  const { data } = useSession();
  const { ppr } = usePpr();

  const setNextStatus = () => {
    if (!ppr) {
      return;
    }

    const nextStatus = getNextPprYearStatus(ppr.status);

    if (!nextStatus) {
      return;
    }

    if (nextStatus === "in_process") {
      ppr?.data.forEach((datum) => (datum.is_work_aproved = true));
    }

    updatePprTable(ppr.id, { ...ppr, status: nextStatus });
  };

  const rejectPpr = useCallback(() => ppr?.id && updatePprTable(ppr.id, { status: "plan_creating" }), [ppr?.id]);

  if (!data || !ppr) {
    return null;
  }
  const { months_statuses: ppr_months_statuses, status: ppr_status } = ppr;

  const { isForBoss, isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = checkIsPprInUserControl(
    ppr.created_by,
    data.user
  );

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (ppr_status === "plan_creating") {
      return <Button onClick={setNextStatus}>Отправить на согласование</Button>;
    }
    if (ppr_status === "in_process" && checkIsAllMonthsPprStatusesIsDone(ppr_months_statuses)) {
      return <Button onClick={setNextStatus}>Завершить выполнение ППР</Button>;
    }
    if (
      ppr_status === "plan_on_agreement_engineer" ||
      ppr_status === "plan_on_agreement_time_norm" ||
      ppr_status === "plan_on_agreement_sub_boss" ||
      ppr_status === "plan_on_aprove"
    ) {
      return <Button onClick={rejectPpr}>Отозвать</Button>;
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

  // Все остальные варианты
  return null;
};
