"use client";
import { FC, MutableRefObject, useEffect, useState } from "react";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { Arrow } from "@/1shared/ui/arrow";

interface ICorrectionArrowsConteinerProps {
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  objectId: string;
  fieldFrom: string;
}

export const CorrectionArrowsConteiner: FC<ICorrectionArrowsConteinerProps> = ({
  planCellRef,
  objectId,
  fieldFrom,
}) => {
  const [basicArrowWidth, setBasicArrowWidth] = useState(10);
  const { filterColumns } = usePprTableViewSettings();
  const { getTransfers: getCorrectionTransfers } = usePprTableData();

  const correctionTransfers = getCorrectionTransfers(objectId, fieldFrom);

  useEffect(() => {
    const width = planCellRef.current?.getBoundingClientRect().width || 0;
    setBasicArrowWidth(width * 6);
  }, [filterColumns, planCellRef]);

  return (
    <div>
      {correctionTransfers?.map((field, index) => (
        <Arrow key={index} width={basicArrowWidth} value={String(field.value)} />
      ))}
    </div>
  );
};
