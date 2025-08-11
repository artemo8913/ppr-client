"use client";
import { FC } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";

import { Month, MONTHS, translateRuTimePeriod } from "@/1shared/lib/date";
import { useTransitionWithToast } from "@/1shared/notification";
import {
  usePpr,
  saveYearPlan,
  usePprTableSettings,
  updateMonthPlanStatus,
  checkIsPprInUserControl,
  rejectMonthPlanStatus,
  TMonthPprStatus,
  TYearPprStatus,
} from "@/2entities/ppr";

export const PprTableMonthStatusUpdate: FC = () => {
  const { ppr } = usePpr();
  const { data } = useSession();
  const { isLoading, awaitServerActionAndToast } = useTransitionWithToast();

  const { currentTimePeriod } = usePprTableSettings();

  const timePeriodRu = translateRuTimePeriod(currentTimePeriod);

  if (!data || !ppr || currentTimePeriod === "year") {
    return null;
  }

  const { isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = checkIsPprInUserControl(
    ppr.created_by,
    data.user
  );

  const setNextStatus = async () => {
    if (isForSubdivision) {
      awaitServerActionAndToast(saveYearPlan(ppr.id, ppr));
    }

    awaitServerActionAndToast(updateMonthPlanStatus(ppr.id, currentTimePeriod));
  };

  const rejectStatus = () => awaitServerActionAndToast(rejectMonthPlanStatus(ppr.id, currentTimePeriod));

  const currentMonthStatus = ppr.months_statuses[currentTimePeriod];

  function checkIsTimePeriodAvailableForPlanning(
    timePeriod: Month,
    yearStatus: TYearPprStatus,
    monthsStatuses: { [month in Month]: TMonthPprStatus }
  ): boolean {
    if (yearStatus !== "in_process" && yearStatus !== "done") {
      return false;
    }

    const timePeriodIndex = MONTHS.indexOf(timePeriod);
    const prevTimePeriod = MONTHS[timePeriodIndex - 1] || "jan";

    if (prevTimePeriod in monthsStatuses && monthsStatuses[prevTimePeriod] === "done") {
      return true;
    }

    return false;
  }

  const isAvailableForPlanning = checkIsTimePeriodAvailableForPlanning(
    currentTimePeriod,
    ppr.status,
    ppr.months_statuses
  );

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (currentMonthStatus === "none" && isAvailableForPlanning) {
      return (
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Запланировать работы на {timePeriodRu}
        </Button>
      );
    }
    if (currentMonthStatus === "plan_creating") {
      return (
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Отправить на проверку
        </Button>
      );
    }
    if (currentMonthStatus === "in_process") {
      return (
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Заполнить факт за {timePeriodRu}
        </Button>
      );
    }
    if (currentMonthStatus === "fact_filling") {
      return (
        <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
          Отправить на проверку
        </Button>
      );
    }
    if (
      currentMonthStatus === "plan_on_agreement_engineer" ||
      currentMonthStatus === "plan_on_agreement_time_norm" ||
      currentMonthStatus === "plan_on_aprove"
    ) {
      return (
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отозвать план с проверки
        </Button>
      );
    }
    if (
      currentMonthStatus === "fact_verification_engineer" ||
      currentMonthStatus === "fact_verification_time_norm" ||
      currentMonthStatus === "fact_on_agreement_sub_boss"
    ) {
      return (
        <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
          Отозвать заполненный факт с проверки
        </Button>
      );
    }
  }

  // Состояния для инженера
  if (isForEngineer) {
    if (currentMonthStatus === "plan_on_agreement_engineer") {
      return (
        <>
          <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
            Отклонить план на {timePeriodRu}
          </Button>
          <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
            Согласовать план на {timePeriodRu}
          </Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_engineer") {
      return (
        <>
          <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
            Отклонить факт за {timePeriodRu}
          </Button>
          <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
            Согласовать факт за {timePeriodRu}
          </Button>
        </>
      );
    }
  }

  // Состояния для нормировщика
  if (isForTimeNorm) {
    if (currentMonthStatus === "plan_on_agreement_time_norm") {
      return (
        <>
          <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
            Отклонить план на {timePeriodRu}
          </Button>
          <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
            Согласовать план на {timePeriodRu}
          </Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_time_norm") {
      return (
        <>
          <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
            Отклонить факт за {timePeriodRu}
          </Button>
          <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
            Согласовать факт за {timePeriodRu}
          </Button>
        </>
      );
    }
  }

  // Состояния для зам. начальника дистанции
  if (isForSubBoss) {
    if (currentMonthStatus === "plan_on_aprove") {
      return (
        <>
          <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
            Отклонить план на {timePeriodRu}
          </Button>
          <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
            Утвердить план на {timePeriodRu}
          </Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_on_agreement_sub_boss") {
      return (
        <>
          <Button disabled={isLoading} type="primary" danger onClick={rejectStatus}>
            Отклонить факт за {timePeriodRu}
          </Button>
          <Button disabled={isLoading} type="primary" onClick={setNextStatus}>
            Утвердить факт за {timePeriodRu}
          </Button>
        </>
      );
    }
  }

  // Все остальные варианты
  return null;
};
