"use client";
import { FC, MutableRefObject, useEffect, useState } from "react";
import { TFilterPlanFactOption, usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { Arrow } from "@/1shared/ui/arrow";
import { IPlanWorkPeriods, planWorkPeriods, planWorkPeriodsSet } from "@/2entities/ppr";

interface ICorrectionArrowsConteinerProps {
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  objectId: string;
  fieldFrom: keyof IPlanWorkPeriods | string;
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

export const CorrectionArrowsConteiner: FC<ICorrectionArrowsConteinerProps> = ({
  planCellRef,
  objectId,
  fieldFrom,
}) => {
  const [basicArrowWidth, setBasicArrowWidth] = useState(0);
  const { filterColumns } = usePprTableViewSettings();
  const { getTransfers } = usePprTableData();

  const fieldFromIndex = planWorkPeriodsSet.has(fieldFrom)
    ? planWorkPeriods.indexOf(fieldFrom as keyof IPlanWorkPeriods)
    : undefined;

  useEffect(() => {
    const width = planCellRef.current?.getBoundingClientRect().width || 0;
    const widthFactor = getArrowWidthFactor(filterColumns.planFact);
    setBasicArrowWidth(width * widthFactor);
  }, [filterColumns, planCellRef]);

  return (
    <div>
      {getTransfers(objectId, fieldFrom)?.map((field, index) => {
        const fieldToIndex = planWorkPeriodsSet.has(field.fieldTo) ? planWorkPeriods.indexOf(field.fieldTo) : undefined;
        const indexDiff = Math.abs((fieldFromIndex || 0) - (fieldToIndex || 0)) || 1;
        return <Arrow key={index} width={basicArrowWidth * indexDiff} value={field.value} />;
      })}
    </div>
  );
};
