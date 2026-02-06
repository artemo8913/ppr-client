"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import { YearPlan } from "../../model/ppr.types";
import { createPprMeta, IPprMeta } from "../../lib/createPprMeta";

import { PprDataContext } from "./PprDataContext";
import { WorksActionsProvider } from "./WorksActionsContext";
import { WorkingMenActionsProvider } from "./WorkingMenActionsContext";

interface IPprProviderProps extends PropsWithChildren {
  pprFromResponce: YearPlan;
}

const defaultPprMeta: IPprMeta = {
  worksRowSpan: [],
  branchesMeta: [],
  subbranchesList: [],
  worksOrder: {},
  branchesAndSubbrunchesOrder: {},
  totalValues: { final: { workingMans: {}, works: {} }, original: { workingMans: {}, works: {} } },
};

export const PprProvider: FC<IPprProviderProps> = ({ children, pprFromResponce }) => {
  const [ppr, setPpr] = useState<YearPlan | null>(null);

  // Вычисление pprMeta
  const pprMeta: IPprMeta = ppr
    ? createPprMeta({ pprData: ppr.data, workingMansData: ppr.workingMans })
    : defaultPprMeta;

  // Если ППР не хранится в контексте, то записать его
  useEffect(() => {
    setPpr({ ...pprFromResponce });
  }, [pprFromResponce]);

  return (
    <PprDataContext.Provider value={{ ppr, setPpr, pprMeta }}>
      <WorksActionsProvider>
        <WorkingMenActionsProvider>{children}</WorkingMenActionsProvider>
      </WorksActionsProvider>
    </PprDataContext.Provider>
  );
};
