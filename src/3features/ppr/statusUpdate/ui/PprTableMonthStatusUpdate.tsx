"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";

import { translateRuTimePeriod } from "@/1shared/lib/date";
import {
  usePpr,
  updatePprTable,
  usePprTableSettings,
  getNextPprMonthStatus,
  checkIsPprInUserControl,
  checkIsTimePeriodAvailableForPlanning,
} from "@/2entities/ppr";

interface IPprTableMonthStatusUpdateProps {}

export const PprTableMonthStatusUpdate: FC<IPprTableMonthStatusUpdateProps> = ({}) => {
  const { data } = useSession();
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const timePeriodRu = translateRuTimePeriod(currentTimePeriod);

  const setNextStatus = () => {
    if (!ppr || currentTimePeriod === "year") {
      return;
    }
    const nextStatus = getNextPprMonthStatus(ppr.months_statuses[currentTimePeriod]);

    if (!nextStatus) {
      return;
    }

    if (nextStatus === "in_process") {
      ppr.data.forEach((pprData) => (pprData.is_work_aproved = true));
      ppr.workingMans.forEach((man) => (man.is_working_man_aproved = true));
    }

    updatePprTable(ppr.id, {
      ...ppr,
      months_statuses: {
        ...ppr.months_statuses,
        [currentTimePeriod]: nextStatus,
      },
    });
  };

  const rejectPlan = useCallback(() => {
    if (!ppr?.id || currentTimePeriod === "year") {
      return;
    }
    updatePprTable(ppr.id, {
      months_statuses: { ...ppr.months_statuses, [currentTimePeriod]: "plan_creating" },
    }),
      [ppr?.id];
  }, [ppr?.id, ppr?.months_statuses, currentTimePeriod]);

  const rejectFactFilling = useCallback(() => {
    if (!ppr?.id || currentTimePeriod === "year") {
      return;
    }
    updatePprTable(ppr.id, {
      months_statuses: { ...ppr.months_statuses, [currentTimePeriod]: "fact_filling" },
    }),
      [ppr?.id];
  }, [ppr?.id, ppr?.months_statuses, currentTimePeriod]);

  if (!data || !ppr || currentTimePeriod === "year") {
    return null;
  }

  const currentMonthStatus = ppr.months_statuses[currentTimePeriod];

  const isAvailableForPlanning = checkIsTimePeriodAvailableForPlanning(
    currentTimePeriod,
    ppr.status,
    ppr.months_statuses
  );

  const { isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = checkIsPprInUserControl(
    ppr.created_by,
    data.user
  );

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (currentMonthStatus === "none" && isAvailableForPlanning) {
      return (
        <Button type="primary" onClick={setNextStatus}>
          Запланировать работы на {timePeriodRu}
        </Button>
      );
    }
    if (currentMonthStatus === "plan_creating") {
      return (
        <Button type="primary" onClick={setNextStatus}>
          Отправить на проверку
        </Button>
      );
    }
    if (currentMonthStatus === "in_process") {
      return (
        <Button type="primary" onClick={setNextStatus}>
          Заполнить факт за {timePeriodRu}
        </Button>
      );
    }
    if (currentMonthStatus === "fact_filling") {
      return (
        <Button type="primary" onClick={setNextStatus}>
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
        <Button type="primary" danger onClick={rejectPlan}>
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
        <Button type="primary" danger onClick={rejectFactFilling}>
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
          <Button type="primary" danger onClick={rejectPlan}>
            Отклонить план на {timePeriodRu}
          </Button>
          <Button type="primary" onClick={setNextStatus}>
            Согласовать план на {timePeriodRu}
          </Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_engineer") {
      return (
        <>
          <Button type="primary" danger onClick={rejectFactFilling}>
            Отклонить факт за {timePeriodRu}
          </Button>
          <Button type="primary" onClick={setNextStatus}>
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
          <Button type="primary" danger onClick={rejectPlan}>
            Отклонить план на {timePeriodRu}
          </Button>
          <Button type="primary" onClick={setNextStatus}>
            Согласовать план на {timePeriodRu}
          </Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_time_norm") {
      return (
        <>
          <Button type="primary" danger onClick={rejectFactFilling}>
            Отклонить факт за {timePeriodRu}
          </Button>
          <Button type="primary" onClick={setNextStatus}>
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
          <Button type="primary" danger onClick={rejectPlan}>
            Отклонить план на {timePeriodRu}
          </Button>
          <Button type="primary" onClick={setNextStatus}>
            Утвердить план на {timePeriodRu}
          </Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_on_agreement_sub_boss") {
      return (
        <>
          <Button type="primary" danger onClick={rejectFactFilling}>
            Отклонить факт за {timePeriodRu}
          </Button>
          <Button type="primary" onClick={setNextStatus}>
            Утвердить факт за {timePeriodRu}
          </Button>
        </>
      );
    }
  }

  // Все остальные варианты
  return null;
};
