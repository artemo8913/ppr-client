"use client";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { YearPlan } from "../../model/ppr.types";
import { IPprMeta } from "../../lib/createPprMeta";

export interface IPprDataContext {
  ppr: YearPlan | null;
  setPpr: Dispatch<SetStateAction<YearPlan | null>>;
  pprMeta: IPprMeta;
}

const defaultPprMeta: IPprMeta = {
  worksRowSpan: [],
  branchesMeta: [],
  subbranchesList: [],
  worksOrder: {},
  branchesAndSubbrunchesOrder: {},
  totalValues: { final: { workingMans: {}, works: {} }, original: { workingMans: {}, works: {} } },
};

export const PprDataContext = createContext<IPprDataContext>({
  ppr: null,
  setPpr: () => {},
  pprMeta: defaultPprMeta,
});

export const usePprData = () => {
  const context = useContext(PprDataContext);
  if (!context) {
    throw new Error("usePprData must be used within PprDataProvider");
  }
  return context;
};
