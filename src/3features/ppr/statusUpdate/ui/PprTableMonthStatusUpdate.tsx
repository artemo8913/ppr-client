"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import { getNextPprMonthStatus, isPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { updatePprTable } from "@/2entities/ppr/model/ppr.actions";

interface IPprTableMonthStatusUpdateProps {}

export const PprTableMonthStatusUpdate: FC<IPprTableMonthStatusUpdateProps> = ({}) => {
  const { data } = useSession();
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();

  const setNextStatus = useCallback(() => {
    if (!ppr || currentTimePeriod === "year") {
      return;
    }
    const nextStatus = getNextPprMonthStatus(ppr.months_statuses[currentTimePeriod]);
    if (nextStatus === "plan_aproved") {
      ppr.data.forEach((datum) => (datum.is_work_aproved = true));
    }
    updatePprTable(ppr.id, {
      ...ppr,
      months_statuses: {
        ...ppr.months_statuses,
        [currentTimePeriod]: nextStatus,
      },
    });
  }, [ppr, currentTimePeriod]);

  const rejectPlan = useCallback(() => {
    if (!ppr?.id || currentTimePeriod === "year") {
      return;
    }
    updatePprTable(ppr.id, {
      months_statuses: { ...ppr.months_statuses, [currentTimePeriod]: "plan_creating" },
    }),
      [ppr?.id];
  }, [ppr?.id, ppr?.months_statuses, currentTimePeriod]);

  const rejectFact = useCallback(() => {
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

  const { isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = isPprInUserControl(
    ppr.created_by,
    data.user
  );

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (currentMonthStatus === "none") {
      return <Button onClick={setNextStatus}>Создать месячный план</Button>;
    }
    if (currentMonthStatus === "plan_creating") {
      return <Button onClick={setNextStatus}>Отправить на согласование</Button>;
    }
    if (currentMonthStatus === "plan_on_correction") {
      return <Button onClick={setNextStatus}>Исправить замечания ППР</Button>;
    }
    if (currentMonthStatus === "plan_aproved") {
      return <Button onClick={setNextStatus}>Взять в работу</Button>;
    }
    if (currentMonthStatus === "in_process") {
      return <Button onClick={setNextStatus}>Заполнить выполнение работ</Button>;
    }
    if (currentMonthStatus === "fact_filling") {
      return <Button onClick={setNextStatus}>Отправить на проверку</Button>;
    }
    if (
      currentMonthStatus === "plan_on_agreement_engineer" ||
      currentMonthStatus === "plan_on_agreement_time_norm" ||
      currentMonthStatus === "plan_on_aprove"
    ) {
      return <Button onClick={rejectPlan}>Отозвать</Button>;
    }
  }

  // Состояния для инженера
  if (isForEngineer) {
    if (currentMonthStatus === "plan_on_agreement_engineer") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_engineer") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
  }

  // Состояния для нормировщика
  if (isForTimeNorm) {
    if (currentMonthStatus === "plan_on_agreement_time_norm") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_time_norm") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
  }

  // Состояния для замначальника дистанции
  if (isForSubBoss) {
    if (currentMonthStatus === "plan_on_aprove") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить</Button>
          <Button onClick={setNextStatus}>Утвердить</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_on_agreement_sub_boss") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить</Button>
          <Button onClick={setNextStatus}>Утвердить</Button>
        </>
      );
    }
  }

  // Все остальные варианты
  return null;
};
