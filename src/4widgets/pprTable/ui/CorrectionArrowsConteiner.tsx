"use client";
import { FC, MutableRefObject, memo, useEffect, useState } from "react";
import {
  TTransfer,
  PLAN_WORK_FIELDS,
  PprField,
  usePprTableSettings,
  TFilterPlanFactOption,
  TPlanWorkPeriodsFields,
} from "@/2entities/ppr";

import { CorrectionArrow } from "./CorrectionArrow";

interface ICorrectionArrowsConteinerProps {
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  field: keyof TPlanWorkPeriodsFields;
  transfers: TTransfer[];
}

function getArrowWidthFactor(planFactFilter: TFilterPlanFactOption): number {
  const timePeriodCount = 1;
  const planFactFieldCount =
    planFactFilter === "SHOW_ALL"
      ? 5.2
      : planFactFilter === "SHOW_ONLY_PLAN"
      ? 2.2
      : planFactFilter === "SHOW_ONLY_FACT"
      ? 0
      : planFactFilter === "SHOW_ONLY_VALUES"
      ? 2.2
      : 0;
  return timePeriodCount * planFactFieldCount;
}

const CorrectionArrowsConteiner: FC<ICorrectionArrowsConteinerProps> = ({ planCellRef, field, transfers }) => {
  const [basicArrowWidth, setBasicArrowWidth] = useState(0);
  const { filterColumns } = usePprTableSettings();
  const fieldFromIndex = PprField.isPlanWork(field) ? PLAN_WORK_FIELDS.indexOf(field) : null;

  useEffect(() => {
    const width = planCellRef.current?.getBoundingClientRect().width || 0;
    const widthFactor = getArrowWidthFactor(filterColumns.planFact);
    setBasicArrowWidth(width * widthFactor);
  }, [filterColumns, planCellRef]);

  const arrows = transfers?.map((field, index) => {
    const fieldToIndex = PprField.isPlanWork(field.fieldTo) ? PLAN_WORK_FIELDS.indexOf(field.fieldTo) : null;
    const indexDiff = Math.abs((fieldFromIndex || 0) - (fieldToIndex || 0)) || 1;
    return <CorrectionArrow key={index} width={basicArrowWidth * indexDiff} value={field.value} />;
  });

  if (!arrows || arrows.length === 0) {
    return null;
  }

  return (
    <div
      className="relative z-10 opacity-50 hover:opacity-100 hover:z-5 hover:scale-105 transition-transform cursor-default"
      style={{ width: basicArrowWidth }}
    >
      {arrows}
    </div>
  );
};

const CorrectionArrowsConteinerMemo = memo(CorrectionArrowsConteiner);
export { CorrectionArrowsConteiner, CorrectionArrowsConteinerMemo };
