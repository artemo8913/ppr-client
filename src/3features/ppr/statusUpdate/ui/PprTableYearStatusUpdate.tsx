"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";

import { useTransitionWithToast } from "@/1shared/notification";
import {
  usePpr,
  saveYearPlan,
  updateYearPlanStatus,
  rejectYearPlanStatus,
  checkIsPprInUserControl,
  yearPlanService,
} from "@/2entities/ppr";

export const PprTableYearStatusUpdate: FC = () => {
  const { ppr } = usePpr();
  const { data } = useSession();

  const { isLoading, awaitServerActionAndToast } = useTransitionWithToast();

  if (!data || !ppr) {
    return null;
  }

  const { isForBoss, isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = checkIsPprInUserControl(
    ppr.created_by,
    data.user
  );

  const setNextStatus = () => {
    if (isForSubdivision) {
      awaitServerActionAndToast(saveYearPlan(ppr.id, ppr));
    }

    awaitServerActionAndToast(updateYearPlanStatus(ppr.id));
  };

  const rejectStatus = () => awaitServerActionAndToast(rejectYearPlanStatus(ppr.id));

  const { months_statuses, status } = ppr;

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (status === "plan_creating") {
      return (
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Отправить на проверку ЭУ-132
        </Button>
      );
    }
    if (status === "in_process" && yearPlanService.statusUpdater.month.checkIsDoneAll(months_statuses)) {
      return (
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Завершить выполнение ППР
        </Button>
      );
    }
    if (
      status === "plan_on_agreement_engineer" ||
      status === "plan_on_agreement_time_norm" ||
      status === "plan_on_agreement_sub_boss" ||
      status === "plan_on_aprove"
    ) {
      return (
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отозвать с проверки ЭУ-132
        </Button>
      );
    }
  }

  // Состояния для инженера
  if (isForEngineer && status === "plan_on_agreement_engineer") {
    return (
      <>
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отклонить ЭУ-132
        </Button>
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Согласовать ЭУ-132
        </Button>
      </>
    );
  }

  // Состояния для нормировщика
  if (isForTimeNorm && status === "plan_on_agreement_time_norm") {
    return (
      <>
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отклонить ЭУ-132
        </Button>
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Согласовать ЭУ-132
        </Button>
      </>
    );
  }

  // Состояния для замначальника дистанции
  if (isForSubBoss && status === "plan_on_agreement_sub_boss") {
    return (
      <>
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отклонить ЭУ-132
        </Button>
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Согласовать ЭУ-132
        </Button>
      </>
    );
  }

  // Состояние для начальника (ответственного за электрохозяйство)
  if (isForBoss && status === "plan_on_aprove") {
    return (
      <>
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отклонить ЭУ-132
        </Button>
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Утвердить ЭУ-132
        </Button>
      </>
    );
  }

  // Все остальные варианты
  return null;
};
