"use client";
import { FC, MutableRefObject, memo, useEffect, useState } from "react";
import { TFilterPlanFactOption, usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { Arrow } from "@/1shared/ui/arrow";
import { IPlanWorkPeriods, checkIsPlanWorkField, planWorkFields } from "@/2entities/ppr";
import { usePpr } from "@/1shared/providers/pprProvider";

interface ICorrectionArrowsConteinerProps {
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  objectId: string;
  fieldFrom: keyof IPlanWorkPeriods;
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

const CorrectionArrowsConteiner: FC<ICorrectionArrowsConteinerProps> = ({ objectId, planCellRef, fieldFrom }) => {
  const [basicArrowWidth, setBasicArrowWidth] = useState(0);
  const { getWorkTransfers } = usePpr();
  const { filterColumns } = usePprTableSettings();
  const fieldFromIndex = checkIsPlanWorkField(fieldFrom)
    ? planWorkFields.indexOf(fieldFrom as keyof IPlanWorkPeriods)
    : undefined;

  useEffect(() => {
    const width = planCellRef.current?.getBoundingClientRect().width || 0;
    const widthFactor = getArrowWidthFactor(filterColumns.planFact);
    setBasicArrowWidth(width * widthFactor);
  }, [filterColumns, planCellRef]);

  const planTransfers = getWorkTransfers("plan", objectId, fieldFrom);
  const undoneTransfers = getWorkTransfers("undone", objectId, fieldFrom);

  const transfers = [...(planTransfers || []), ...(undoneTransfers || [])];

  const arrows = transfers?.map((field, index) => {
    const fieldToIndex = checkIsPlanWorkField(field.fieldTo) ? planWorkFields.indexOf(field.fieldTo) : undefined;
    const indexDiff = Math.abs((fieldFromIndex || 0) - (fieldToIndex || 0)) || 1;
    return <Arrow key={index} width={basicArrowWidth * indexDiff} value={field.value} />;
  });
  if (!arrows || arrows.length === 0) {
    return null;
  }
  return <div>{arrows}</div>;
};

const CorrectionArrowsConteinerMemo = memo(CorrectionArrowsConteiner);
export { CorrectionArrowsConteiner, CorrectionArrowsConteinerMemo };
