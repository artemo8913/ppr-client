"use client";
import { FC, useCallback } from "react";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import {
  getNextPprMonthStatus,
  isPprInUserControl,
  usePprTableData,
  usePprTableViewSettings,
} from "@/1shared/providers/pprTableProvider";
import { updatePprTable } from "@/2entities/pprTable/model/pprTable.actions";

interface IPprTableMonthStatusUpdateProps {}

export const PprTableMonthStatusUpdate: FC<IPprTableMonthStatusUpdateProps> = ({}) => {
  const { data } = useSession();
  const { pprData } = usePprTableData();
  const { currentTimePeriod } = usePprTableViewSettings();

  const setNextStatus = useCallback(() => {
    if (!pprData || currentTimePeriod === "year") {
      return;
    }
    const nextStatus = getNextPprMonthStatus(pprData.months_statuses[currentTimePeriod]);
    if (nextStatus === "plan_aproved") {
      pprData.data.forEach((datum) => (datum.is_work_aproved = true));
    }
    updatePprTable(pprData.id, {
      ...pprData,
      months_statuses: {
        ...pprData.months_statuses,
        [currentTimePeriod]: nextStatus,
      },
    });
  }, [pprData, currentTimePeriod]);

  const rejectPpr = useCallback(() => {
    if (!pprData?.id || currentTimePeriod === "year") {
      return;
    }
    updatePprTable(pprData.id, {
      months_statuses: { ...pprData.months_statuses, [currentTimePeriod]: "plan_on_correction" },
    }),
      [pprData?.id];
  }, [pprData?.id, pprData?.months_statuses, currentTimePeriod]);

  if (!data || !pprData || currentTimePeriod === "year") {
    return null;
  }
  const currentMonthStatus = pprData.months_statuses[currentTimePeriod];

  const { isForEngineer, isForSubBoss, isForSubdivision, isForTimeNorm } = isPprInUserControl(pprData, data.user);

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
      return <Button onClick={rejectPpr}>Отозвать</Button>;
    }
  }

  // Состояния для инженера
  if (isForEngineer) {
    if (currentMonthStatus === "plan_on_agreement_engineer") {
      return (
        <>
          <Button onClick={rejectPpr}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_engineer") {
      return (
        <>
          <Button onClick={rejectPpr}>Отклонить</Button>
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
          <Button onClick={rejectPpr}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_verification_time_norm") {
      return (
        <>
          <Button onClick={rejectPpr}>Отклонить</Button>
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
          <Button onClick={rejectPpr}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
    if (currentMonthStatus === "fact_on_agreement_sub_boss") {
      return (
        <>
          <Button onClick={rejectPpr}>Отклонить</Button>
          <Button onClick={setNextStatus}>Согласовать</Button>
        </>
      );
    }
  }

  // Все остальные варианты
  return null;
};
