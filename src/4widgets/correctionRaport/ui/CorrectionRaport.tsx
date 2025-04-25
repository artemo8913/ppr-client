"use client";
import clsx from "clsx";
import { Switch } from "antd";
import Select from "antd/es/select";
import Checkbox from "antd/es/checkbox/Checkbox";
import React, { FC, useCallback, useState } from "react";
import { useSession } from "next-auth/react";

import { translateRuTimePeriod } from "@/1shared/lib/date";
import { TOptionType } from "@/1shared/lib/form/TOptionType";
import { TPlanWorkPeriodsFields, usePpr, checkIsPprInUserControl, usePprTableSettings } from "@/2entities/ppr";

import { CorrectionNote } from "./CorrectionNote";
import { CorrectionText } from "./CorrectionText";
import { calculateMonthRaport } from "../lib/calculateRaport";
import { CorrectionTable } from "./CorrectionTable";

interface ICorrectionRaportProps {}

export const CorrectionRaport: FC<ICorrectionRaportProps> = () => {
  const { data: credential } = useSession();

  const { ppr, pprMeta, updateRaportNote } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  const [isShowTextRaport, setIsShowTextRaport] = useState(false);

  const [isShowSubtotal, setIsShowSubtotal] = useState({ branch: false, subbranch: false });

  const toggleIsShowSubtotalForBranch = useCallback(
    () => setIsShowSubtotal((prev) => ({ ...prev, branch: !prev.branch })),
    []
  );

  const toggleIsShowSubtotalForSubranch = useCallback(
    () => setIsShowSubtotal((prev) => ({ ...prev, subbranch: !prev.subbranch })),
    []
  );

  const [subbranchOptions] = useState<TOptionType<string>[]>(
    pprMeta.subbranchesList.map((subbranch) => {
      return { value: subbranch, label: subbranch };
    })
  );

  const [selectedSubbranches, setSelectedSubbranches] = useState<Set<string>>();

  const handleChangeSelectSubbranch = useCallback((subbranchesList: string[]) => {
    setSelectedSubbranches(new Set(subbranchesList));
  }, []);

  if (!ppr) {
    return "ППР не найден";
  }

  if (!credential?.user) {
    return "Не авторизирован пользователь";
  }

  if (currentTimePeriod === "year") {
    return "Рапорт доступен только при просмотре ППР за конкретный месяц";
  }

  const handleBlurNote = (note: string) => {
    updateRaportNote(note, currentTimePeriod);
  };

  const fieldFrom: keyof TPlanWorkPeriodsFields = `${currentTimePeriod}_plan_work`;

  const monthStatus = ppr?.months_statuses[currentTimePeriod];

  const { correctedWorks, correctedWorksMeta, undoneWorks, undoneWorksMeta, welldoneWorks, welldoneWorksMeta } =
    calculateMonthRaport(
      ppr.data.filter((pprData) => (selectedSubbranches?.size ? selectedSubbranches?.has(pprData.subbranch) : true)),
      currentTimePeriod
    );

  const isPprUnderControl = checkIsPprInUserControl(ppr?.created_by, credential?.user).isForSubdivision;
  const isEditablePlanCorrections = monthStatus === "plan_creating" && isPprUnderControl;
  const isEditableDoneWorkCorrections = monthStatus === "fact_filling" && isPprUnderControl;
  const hasPlanCorrections = correctedWorks.length > 0;
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
      <div className="print:hidden mx-10 mb-4 flex-wrap flex gap-2 items-center">
        Текстовый рапорт: <Switch checked={isShowTextRaport} onChange={setIsShowTextRaport} />
        Отфильтровать пункты работ в рапорте:
        <Select
          mode="tags"
          allowClear
          className="flex-grow"
          options={subbranchOptions}
          onChange={handleChangeSelectSubbranch}
          placeholder="Выбрать пункты работ"
        />
        {!isShowTextRaport && (
          <>
            <label className="cursor-pointer">
              <Checkbox checked={isShowSubtotal.branch} onChange={toggleIsShowSubtotalForBranch} />
              Отобразить итоги по разделам
            </label>
            <label className="cursor-pointer">
              <Checkbox checked={isShowSubtotal.subbranch} onChange={toggleIsShowSubtotalForSubranch} />
              Отобразить итоги по пунктам
            </label>
          </>
        )}
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
              {translateRuTimePeriod(currentTimePeriod)} месяц {ppr?.year} г. возникла необходимость корректировки плана
              технического обслуживания и ремонта:
            </p>
            {isShowTextRaport ? (
              <CorrectionText
                corrections={correctedWorks}
                meta={correctedWorksMeta}
                fieldFrom={fieldFrom}
                type="plan"
              />
            ) : (
              <CorrectionTable
                pprMeta={pprMeta}
                transferType="plan"
                fieldFrom={fieldFrom}
                raportMeta={correctedWorksMeta}
                isShowSubtotal={isShowSubtotal}
                planCorrections={correctedWorks}
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
              <CorrectionText corrections={undoneWorks} meta={undoneWorksMeta} fieldFrom={fieldFrom} type="undone" />
            ) : (
              <CorrectionTable
                pprMeta={pprMeta}
                transferType="undone"
                fieldFrom={fieldFrom}
                raportMeta={undoneWorksMeta}
                planCorrections={undoneWorks}
                isShowSubtotal={isShowSubtotal}
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
                meta={welldoneWorksMeta}
                fieldFrom={fieldFrom}
                type="undone"
              />
            ) : (
              <CorrectionTable
                pprMeta={pprMeta}
                transferType="undone"
                fieldFrom={fieldFrom}
                raportMeta={welldoneWorksMeta}
                isShowSubtotal={isShowSubtotal}
                planCorrections={welldoneWorks}
                isEditable={isEditableDoneWorkCorrections}
              />
            )}
          </div>
        )}
        {isMonthPlanFullDone && (
          <span>
            Техническое обслуживание и ремонт выполнено согласно утвержденным планам на{" "}
            {translateRuTimePeriod(currentTimePeriod)} месяц.
          </span>
        )}
        <CorrectionNote
          initialValue={ppr?.raports_notes[currentTimePeriod]}
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
