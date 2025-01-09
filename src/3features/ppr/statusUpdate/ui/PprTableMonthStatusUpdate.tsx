"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";

import { translateRuTimePeriod } from "@/1shared/locale/date";
import { getNextPprMonthStatus, checkIsPprInUserControl, usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { updatePprTable } from "@/2entities/ppr/model/ppr.actions";

interface IPprTableMonthStatusUpdateProps {}

export const PprTableMonthStatusUpdate: FC<IPprTableMonthStatusUpdateProps> = ({}) => {
  const { data } = useSession();
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();

  const setNextStatus = () => {
    if (!ppr || currentTimePeriod === "year") {
      return;
    }
    const nextStatus = getNextPprMonthStatus(ppr.months_statuses[currentTimePeriod]);

    if (!nextStatus) {
      return;
    }

    if (nextStatus === "in_process") {
      ppr.data.forEach((datum) => (datum.is_work_aproved = true));
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

  const { isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = checkIsPprInUserControl(
    ppr.created_by,
    data.user
  );

  // Состояния для начальника цеха
  if (isForSubdivision) {
    if (currentMonthStatus === "none") {
      return (
        <Button onClick={setNextStatus}>Запланировать работы на {translateRuTimePeriod(currentTimePeriod)}</Button>
      );
    }
    if (currentMonthStatus === "plan_creating") {
      return <Button onClick={setNextStatus}>Отправить на проверку</Button>;
    }
    if (currentMonthStatus === "in_process") {
      return <Button onClick={setNextStatus}>Заполнить факт за {translateRuTimePeriod(currentTimePeriod)}</Button>;
    }
    if (currentMonthStatus === "fact_filling") {
      return <Button onClick={setNextStatus}>Отправить на проверку</Button>;
    }
    if (
      currentMonthStatus === "plan_on_agreement_engineer" ||
      currentMonthStatus === "plan_on_agreement_time_norm" ||
      currentMonthStatus === "plan_on_aprove"
    ) {
      return <Button onClick={rejectPlan}>Отозвать с проверки</Button>;
    }
    if (
      currentMonthStatus === "fact_verification_engineer" ||
      currentMonthStatus === "fact_verification_time_norm" ||
      currentMonthStatus === "fact_on_agreement_sub_boss"
    ) {
      return <Button onClick={rejectFactFilling}>Отозвать с проверки</Button>;
    }
  }

  // Состояния для инженера
  if (isForEngineer) {
    if (currentMonthStatus === "plan_on_agreement_engineer") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить план на {translateRuTimePeriod(currentTimePeriod)}</Button>
          <Button onClick={setNextStatus}>Согласовать план на {translateRuTimePeriod(currentTimePeriod)}</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_engineer") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить факт за {translateRuTimePeriod(currentTimePeriod)}</Button>
          <Button onClick={setNextStatus}>Согласовать факт за {translateRuTimePeriod(currentTimePeriod)}</Button>
        </>
      );
    }
  }

  // Состояния для нормировщика
  if (isForTimeNorm) {
    if (currentMonthStatus === "plan_on_agreement_time_norm") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить план на {translateRuTimePeriod(currentTimePeriod)}</Button>
          <Button onClick={setNextStatus}>Согласовать план на {translateRuTimePeriod(currentTimePeriod)}</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_time_norm") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить факт за {translateRuTimePeriod(currentTimePeriod)}</Button>
          <Button onClick={setNextStatus}>Согласовать факт за {translateRuTimePeriod(currentTimePeriod)}</Button>
        </>
      );
    }
  }

  // Состояния для зам. начальника дистанции
  if (isForSubBoss) {
    if (currentMonthStatus === "plan_on_aprove") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить план на {translateRuTimePeriod(currentTimePeriod)}</Button>
          <Button onClick={setNextStatus}>Утвердить план на {translateRuTimePeriod(currentTimePeriod)}</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_on_agreement_sub_boss") {
      return (
        <>
          <Button onClick={rejectPlan}>Отклонить факт за {translateRuTimePeriod(currentTimePeriod)}</Button>
          <Button onClick={setNextStatus}>Утвердить факт за {translateRuTimePeriod(currentTimePeriod)}</Button>
        </>
      );
    }
  }

  // Все остальные варианты
  return null;
};
