"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";

import {
  checkIsAllMonthsPprStatusesIsDone,
  checkIsPprInUserControl,
  getNextPprYearStatus,
  updatePprTable,
  usePpr,
} from "@/2entities/ppr";

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
      ppr?.data.forEach((pprData) => (pprData.is_work_aproved = true));
      ppr?.workingMans.forEach((man) => (man.is_working_man_aproved = true));
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
      return (
        <Button type="primary" onClick={setNextStatus}>
          Отправить на проверку ЭУ-132
        </Button>
      );
    }
    if (ppr_status === "in_process" && checkIsAllMonthsPprStatusesIsDone(ppr_months_statuses)) {
      return (
        <Button type="primary" onClick={setNextStatus}>
          Завершить выполнение ППР
        </Button>
      );
    }
    if (
      ppr_status === "plan_on_agreement_engineer" ||
      ppr_status === "plan_on_agreement_time_norm" ||
      ppr_status === "plan_on_agreement_sub_boss" ||
      ppr_status === "plan_on_aprove"
    ) {
      return (
        <Button type="primary" danger onClick={rejectPpr}>
          Отозвать с проверки ЭУ-132
        </Button>
      );
    }
  }

  // Состояния для инженера
  if (isForEngineer && ppr_status === "plan_on_agreement_engineer") {
    return (
      <>
        <Button type="primary" danger onClick={rejectPpr}>
          Отклонить ЭУ-132
        </Button>
        <Button type="primary" onClick={setNextStatus}>
          Согласовать ЭУ-132
        </Button>
      </>
    );
  }

  // Состояния для нормировщика
  if (isForTimeNorm && ppr_status === "plan_on_agreement_time_norm") {
    return (
      <>
        <Button type="primary" danger onClick={rejectPpr}>
          Отклонить ЭУ-132
        </Button>
        <Button type="primary" onClick={setNextStatus}>
          Согласовать ЭУ-132
        </Button>
      </>
    );
  }

  // Состояния для замначальника дистанции
  if (isForSubBoss && ppr_status === "plan_on_agreement_sub_boss") {
    return (
      <>
        <Button type="primary" danger onClick={rejectPpr}>
          Отклонить ЭУ-132
        </Button>
        <Button type="primary" onClick={setNextStatus}>
          Согласовать ЭУ-132
        </Button>
      </>
    );
  }

  // Состояние для начальника (ответственного за электрохозяйство)
  if (isForBoss && ppr_status === "plan_on_aprove") {
    return (
      <>
        <Button type="primary" danger onClick={rejectPpr}>
          Отклонить ЭУ-132
        </Button>
        <Button type="primary" onClick={setNextStatus}>
          Утвердить ЭУ-132
        </Button>
      </>
    );
  }

  // Все остальные варианты
  return null;
};
