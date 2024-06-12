"use client";
import { FC, MutableRefObject, useEffect, useState } from "react";
import { TFilterPlanFactOption, usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { Arrow } from "@/1shared/ui/arrow";
import { IPlanWorkPeriods, TTransfer, checkIsPlanWorkField, planWorkFields } from "@/2entities/ppr";

interface ICorrectionArrowsConteinerProps {
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  objectId: string;
  fieldFrom: keyof IPlanWorkPeriods | string;
  transfers: TTransfer<IPlanWorkPeriods>[];
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
  fieldFrom,
  transfers,
}) => {
  const [basicArrowWidth, setBasicArrowWidth] = useState(0);
  const { filterColumns } = usePprTableSettings();
  const fieldFromIndex = checkIsPlanWorkField(fieldFrom)
    ? planWorkFields.indexOf(fieldFrom as keyof IPlanWorkPeriods)
    : undefined;

  useEffect(() => {
    const width = planCellRef.current?.getBoundingClientRect().width || 0;
    const widthFactor = getArrowWidthFactor(filterColumns.planFact);
    setBasicArrowWidth(width * widthFactor);
  }, [filterColumns, planCellRef]);

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
