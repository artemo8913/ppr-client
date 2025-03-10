import { TMonth } from "@/1shared/lib/date";
import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { getFactWorkFieldByTimePeriod, getPlanWorkFieldByTimePeriod, IPlanWorkValues, IPprData } from "@/2entities/ppr";

import { createRaportMeta } from "./createRaportMeta";
import { TCorrectionItem } from "../model/correctionRaport.types";

function isWorkCorrectedByUser(plan: IPlanWorkValues) {
  if (plan.handCorrection === null) {
    return false;
  }

  return plan.handCorrection !== plan.original + plan.outsideCorrectionsSum || plan.planTransfers;
}

function isWorkUndone(plan: IPlanWorkValues, factWorkValue: number) {
  const originalPlanWorkValue = plan.original + plan.outsideCorrectionsSum;

  const planWorkValue = plan.handCorrection !== null ? plan.handCorrection : originalPlanWorkValue;

  return planWorkValue > factWorkValue || (plan.undoneTransfers && planWorkValue === factWorkValue);
}

function isWorkWelldone(plan: IPlanWorkValues, factWorkValue: number) {
  const originalPlanWorkValue = plan.original + plan.outsideCorrectionsSum;

  const planWorkValue = plan.handCorrection !== null ? plan.handCorrection : originalPlanWorkValue;

  return planWorkValue < factWorkValue;
}

// TODO: Проверить использование слова Raport (где-то report пишу)

export function calculateMonthRaport(allPprData: IPprData[], currentTimePeriod: TMonth) {
  const planField = getPlanWorkFieldByTimePeriod(currentTimePeriod);
  const factField = getFactWorkFieldByTimePeriod(currentTimePeriod);

  const filteredCorrectedPprData: IPprData[] = [];
  const filteredUndonePprData: IPprData[] = [];
  const filteredWelldonePprData: IPprData[] = [];

  const correctedWorks: TCorrectionItem[] = [];
  const undoneWorks: TCorrectionItem[] = [];
  const welldoneWorks: TCorrectionItem[] = [];

  allPprData.forEach((pprData) => {
    // Отфильтровать измененные, невыполненные и перевыполненные работы. Сформировать массивы TCorrectionItem[]
    if (isWorkCorrectedByUser(pprData[planField])) {
      filteredCorrectedPprData.push(pprData);

      const planWork = roundToFixed(pprData[planField].original + pprData[planField].outsideCorrectionsSum);
      const factWork = roundToFixed(Number(pprData[planField].handCorrection));
      const planTime = roundToFixed(planWork * pprData.norm_of_time);
      const factTime = roundToFixed(factWork * pprData.norm_of_time);

      const workDiff = roundToFixed(planWork - factWork);
      const timeDiff = roundToFixed(planTime - factTime);

      correctedWorks.push({
        pprData,
        planWork,
        factWork,
        planTime,
        factTime,
        workDiff,
        timeDiff,
      });
    }

    if (
      !isWorkUndone(pprData[planField], pprData[factField]) &&
      !isWorkWelldone(pprData[planField], pprData[factField])
    ) {
      return;
    }

    const planWork = roundToFixed(
      pprData[planField].handCorrection !== null
        ? Number(pprData[planField].handCorrection)
        : pprData[planField].original + pprData[planField].outsideCorrectionsSum
    );
    const factWork = pprData[factField];
    const planTime = roundToFixed(planWork * pprData.norm_of_time);
    const factTime = roundToFixed(factWork * pprData.norm_of_time);

    const workDiff = roundToFixed(planWork - factWork);
    const timeDiff = roundToFixed(planTime - factTime);

    const correctionItem = {
      pprData,
      planWork,
      factWork,
      planTime,
      factTime,
      workDiff,
      timeDiff,
    };

    if (isWorkUndone(pprData[planField], pprData[factField])) {
      filteredUndonePprData.push(pprData);
      undoneWorks.push(correctionItem);
    }
    if (isWorkWelldone(pprData[planField], pprData[factField])) {
      filteredWelldonePprData.push(pprData);
      welldoneWorks.push(correctionItem);
    }
  });

  const correctedWorksMeta = createRaportMeta(correctedWorks);
  const undoneWorksMeta = createRaportMeta(undoneWorks);
  const welldoneWorksMeta = createRaportMeta(welldoneWorks);

  return {
    filteredCorrectedPprData,
    filteredUndonePprData,
    filteredWelldonePprData,
    correctedWorks,
    undoneWorks,
    welldoneWorks,
    correctedWorksMeta,
    undoneWorksMeta,
    welldoneWorksMeta,
  };
}
