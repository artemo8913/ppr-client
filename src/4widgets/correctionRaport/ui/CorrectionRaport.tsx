"use client";
import clsx from "clsx";
import { Switch } from "antd";
import React, { FC, useState } from "react";
import { useSession } from "next-auth/react";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { translateRuTimePeriod } from "@/1shared/lib/date/locale";
import {
  TPlanWorkPeriodsFields,
  getFactWorkFieldByTimePeriod,
  IPprData,
  usePpr,
  checkIsPprInUserControl,
  usePprTableSettings,
} from "@/2entities/ppr";

import { CorrectionNote } from "./CorrectionNote";
import { CorrectionText } from "./CorrectionText";
import { PlanCorrectionsTable } from "./PlanCorrectionsTable";
import { DoneWorkCorrectionsTable } from "./DoneWorkCorrectionsTable";
import { ICorrectionSummary, TCorrectionItem } from "../model/correctionReport.types";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { ppr, pprMeta, updateReportNote } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  const { data: credential } = useSession();

  const [isShowTextRaport, setIsShowTextRaport] = useState(false);
  if (!credential?.user) {
    return "Не авторизирован пользователь";
  }

  if (currentTimePeriod === "year") {
    return "Рапорт доступен только при просмотре ППР за конкретный месяц";
  }

  const handleBlurNote = (note: string) => {
    updateReportNote(note, currentTimePeriod);
  };

  const fieldFrom: keyof TPlanWorkPeriodsFields = `${currentTimePeriod}_plan_work`;
  const monthStatus = ppr?.months_statuses[currentTimePeriod];

  const undoneWorks: TCorrectionItem[] = [];
  const welldoneWorks: TCorrectionItem[] = [];
  const planCorrections: TCorrectionItem[] = [];

  const planCorrectionsSummary: ICorrectionSummary = { fact: 0, plan: 0 };
  const undoneWorksSummary: ICorrectionSummary = { fact: 0, plan: 0 };
  const welldoneWorksSummary: ICorrectionSummary = { fact: 0, plan: 0 };

  ppr?.data.forEach((pprData) => {
    const plan = pprData[fieldFrom];

    const originalPlanWorkValue = plan.original + plan.outsideCorrectionsSum;

    const correctedByUserValue = plan.handCorrection;

    const planWorkValue = plan.handCorrection !== null ? plan.handCorrection : originalPlanWorkValue;

    const factWorkValue = pprData[getFactWorkFieldByTimePeriod(currentTimePeriod)];

    if (correctedByUserValue !== null && (correctedByUserValue !== originalPlanWorkValue || plan.planTransfers)) {
      planCorrections.push({
        pprData,
        firstCompareValue: originalPlanWorkValue,
        secondCompareValue: correctedByUserValue,
      });

      planCorrectionsSummary.plan = roundToFixed(
        originalPlanWorkValue * pprData.norm_of_time + planCorrectionsSummary.plan
      );
      planCorrectionsSummary.fact = roundToFixed(
        correctedByUserValue * pprData.norm_of_time + planCorrectionsSummary.fact
      );
    }

    if (planWorkValue > factWorkValue || (plan.undoneTransfers && planWorkValue === factWorkValue)) {
      undoneWorks.push({
        pprData,
        firstCompareValue: planWorkValue,
        secondCompareValue: factWorkValue,
      });

      undoneWorksSummary.plan = roundToFixed(planWorkValue * pprData.norm_of_time + undoneWorksSummary.plan);
      undoneWorksSummary.fact = roundToFixed(factWorkValue * pprData.norm_of_time + undoneWorksSummary.fact);
    } else if (planWorkValue < factWorkValue) {
      welldoneWorks.push({
        pprData,
        firstCompareValue: planWorkValue,
        secondCompareValue: factWorkValue,
      });

      welldoneWorksSummary.plan = roundToFixed(planWorkValue * pprData.norm_of_time + welldoneWorksSummary.plan);
      welldoneWorksSummary.fact = roundToFixed(factWorkValue * pprData.norm_of_time + welldoneWorksSummary.fact);
    }
  });

  const isPprUnderControl = checkIsPprInUserControl(ppr?.created_by, credential?.user).isForSubdivision;
  const isEditablePlanCorrections = monthStatus === "plan_creating" && isPprUnderControl;
  const isEditableDoneWorkCorrections = monthStatus === "fact_filling" && isPprUnderControl;
  const hasPlanCorrections = planCorrections.length > 0;
  const isShowDoneWorkCorrections =
    monthStatus === "fact_filling" ||
    monthStatus === "fact_on_agreement_sub_boss" ||
    monthStatus === "fact_verification_time_norm" ||
    monthStatus === "fact_verification_engineer" ||
    monthStatus === "done";
  const hasUndoneCorrections = undoneWorks.length > 0 && isShowDoneWorkCorrections;
  const hasWellDoneCorrections = welldoneWorks.length > 0 && isShowDoneWorkCorrections;

  const isMonthPlanFullDone = !hasPlanCorrections && !hasUndoneCorrections && !hasWellDoneCorrections;

  return (
    <div>
      <div className="print:hidden ml-auto mb-4">
        Текстовый рапорт: <Switch checked={isShowTextRaport} onChange={setIsShowTextRaport} />
      </div>
      <div
        className={clsx(
          "rounded-3xl bg-white flex flex-col gap-8 p-4 pt-8",
          isShowTextRaport && "text-justify mx-20 print:ml-0"
        )}
      >
        <p className="ml-[70%] text-left">
          Начальнику {ppr?.distanceShortName}
          <br />
          ____________
          <br />
          начальника {ppr?.subdivisionShortName}
          <br />
          ____________
        </p>
        <h2 className="text-center font-bold">РАПОРТ</h2>
        {hasPlanCorrections && (
          <div>
            <p className="font-bold text-justify">
              I. При планировании ведомости выполненных работ (форма ЭУ-99) на{" "}
              {translateRuTimePeriod(currentTimePeriod)} месяц {ppr?.year} г. возникла необходимость корректировки
              годового плана технического обслуживания и ремонта:
            </p>
            {isShowTextRaport ? (
              <CorrectionText
                corrections={planCorrections}
                summary={planCorrectionsSummary}
                fieldFrom={fieldFrom}
                type="plan"
              />
            ) : (
              <PlanCorrectionsTable
                pprMeta={pprMeta}
                fieldFrom={fieldFrom}
                summary={planCorrectionsSummary}
                planCorrections={planCorrections}
                isEditable={isEditablePlanCorrections}
              />
            )}
          </div>
        )}
        {hasUndoneCorrections && (
          <div>
            <p className="font-bold text-justify">
              II. За {translateRuTimePeriod(currentTimePeriod)} месяц не в полном объеме выполнены следующие работы:
            </p>
            {isShowTextRaport ? (
              <CorrectionText
                corrections={undoneWorks}
                summary={undoneWorksSummary}
                fieldFrom={fieldFrom}
                type="undone"
              />
            ) : (
              <DoneWorkCorrectionsTable
                pprMeta={pprMeta}
                fieldFrom={fieldFrom}
                summary={undoneWorksSummary}
                planCorrections={undoneWorks}
                isEditable={isEditableDoneWorkCorrections}
              />
            )}
          </div>
        )}
        {hasWellDoneCorrections && (
          <div>
            <p className="font-bold text-justify">
              III. За {translateRuTimePeriod(currentTimePeriod)} месяц возникли отвлечения, были перевыполнены или
              выполнены незапланированные работы:
            </p>
            {isShowTextRaport ? (
              <CorrectionText
                corrections={welldoneWorks}
                summary={welldoneWorksSummary}
                fieldFrom={fieldFrom}
                type="undone"
              />
            ) : (
              <DoneWorkCorrectionsTable
                pprMeta={pprMeta}
                fieldFrom={fieldFrom}
                summary={welldoneWorksSummary}
                planCorrections={welldoneWorks}
                isEditable={isEditableDoneWorkCorrections}
              />
            )}
          </div>
        )}
        {isMonthPlanFullDone && (
          <span>
            Техническое обслуживание и ремонт выполнено согласно утвержденным плнам на{" "}
            {translateRuTimePeriod(currentTimePeriod)} месяц.
          </span>
        )}
        <CorrectionNote
          initialValue={ppr?.reports_notes[currentTimePeriod]}
          isEditable={isEditablePlanCorrections || isEditableDoneWorkCorrections}
          handleBlur={handleBlurNote}
        />
        {!isMonthPlanFullDone && (
          <span>
            Прошу откорректировать план технического обслуживания и ремонта с сохранением премиальной оплаты труда.
          </span>
        )}
        <span className="text-center">{ppr?.subdivisionShortName}________________________</span>
      </div>
    </div>
  );
};
