import { TDirectionDB, TDistanceDB, TSubdivisionDB } from "@/1shared/database";
import {
  IPprData,
  TPlanWorkPeriods,
  TFactWorkPeriods,
  PLAN_WORK_FIELDS,
  FACT_WORK_FIELDS,
  TPprDataWorkId,
} from "@/2entities/ppr";

type TPlanFactWorkFields = {
  [key in TPlanWorkPeriods | TFactWorkPeriods]: number;
};

type TDistancePlanFactWorkSummary = {
  [idSubdivision: number]: TPlanFactWorkFields;
  total: TPlanFactWorkFields;
};

type TDirectionPlanFactWorkSummary = {
  [idDistance: number]: TDistancePlanFactWorkSummary;
  total: TPlanFactWorkFields;
};

type TWorkPlanFactWorkSummary = {
  [idDirection: number]: TDirectionPlanFactWorkSummary;
  total: TPlanFactWorkFields;
  workData: {
    id: TPprDataWorkId;
    commonWorkId: number;
    name: string;
    measure: string;
  };
};

interface IFulfillmentReport {
  [commonWorkId: number]: TWorkPlanFactWorkSummary;
}

export interface IFulfillmentReportData extends TPlanFactWorkFields {
  id: TPprDataWorkId;
  common_work_id: number;
  name: string;
  measure: string;
  divisionId: string;
  summaryRowType: "direction" | "distance" | "subdivision" | "total";
}

export interface IFulfillmentReportSettings {
  [index: number]: { rowSpan: number };
}

interface IPprDataWithDivisionsId extends IPprData {
  idDirection: number;
  idDistance: number;
  idSubdivision: number;
}

function createPlanFactWorkInstance(): {
  [key in TPlanWorkPeriods | TFactWorkPeriods]: number;
} {
  return {
    year_plan_work: 0,
    jan_plan_work: 0,
    feb_plan_work: 0,
    mar_plan_work: 0,
    apr_plan_work: 0,
    may_plan_work: 0,
    june_plan_work: 0,
    july_plan_work: 0,
    aug_plan_work: 0,
    sept_plan_work: 0,
    oct_plan_work: 0,
    nov_plan_work: 0,
    dec_plan_work: 0,
    year_fact_work: 0,
    jan_fact_work: 0,
    feb_fact_work: 0,
    mar_fact_work: 0,
    apr_fact_work: 0,
    may_fact_work: 0,
    june_fact_work: 0,
    july_fact_work: 0,
    aug_fact_work: 0,
    sept_fact_work: 0,
    oct_fact_work: 0,
    nov_fact_work: 0,
    dec_fact_work: 0,
  };
}

function handlePlanFactWorkValues(
  pprData: IPprData,
  subdivisionSummary: TPlanFactWorkFields,
  distanceSummary: TDistancePlanFactWorkSummary,
  directionSummary: TDirectionPlanFactWorkSummary,
  workSummary: TWorkPlanFactWorkSummary
) {
  PLAN_WORK_FIELDS.forEach((planWorkPeriod) => {
    subdivisionSummary[planWorkPeriod] += pprData[planWorkPeriod].original;
    distanceSummary.total[planWorkPeriod] += pprData[planWorkPeriod].original;
    directionSummary.total[planWorkPeriod] += pprData[planWorkPeriod].original;
    workSummary.total[planWorkPeriod] += pprData[planWorkPeriod].original;
  });

  FACT_WORK_FIELDS.forEach((factWorkPeriod) => {
    subdivisionSummary[factWorkPeriod] += pprData[factWorkPeriod];
    distanceSummary.total[factWorkPeriod] += pprData[factWorkPeriod];
    directionSummary.total[factWorkPeriod] += pprData[factWorkPeriod];
    workSummary.total[factWorkPeriod] += pprData[factWorkPeriod];
  });
}

export function calculateFulfillmentReport(
  pprDataOrderedByCommonWorkId: IPprDataWithDivisionsId[],
  divisions: {
    subdivisionsMap: Map<number, TSubdivisionDB>;
    distancesMap: Map<number, TDistanceDB>;
    directionsMap: Map<number, TDirectionDB>;
  }
) {
  const commonWorkReport: IFulfillmentReport = {};

  const reportSettings: IFulfillmentReportSettings = {};

  let tempRowSpan: number = 1;
  let tempIndex: number = 0;
  let tempCommonWorkId: number | null = pprDataOrderedByCommonWorkId[0].common_work_id;

  pprDataOrderedByCommonWorkId.forEach((pprData, index) => {
    if (!pprData.common_work_id) {
      return;
    }

    // формирование commonWorkReport
    if (pprData.common_work_id in commonWorkReport) {
      const workSummary = commonWorkReport[pprData.common_work_id];

      if (pprData.idDirection in workSummary) {
        const directionSummary = workSummary[pprData.idDirection];

        if (pprData.idDistance in directionSummary) {
          const distanceSummary = directionSummary[pprData.idDistance];

          if (pprData.idSubdivision in distanceSummary) {
            const subdivisionSummary = distanceSummary[pprData.idSubdivision];

            handlePlanFactWorkValues(pprData, subdivisionSummary, distanceSummary, directionSummary, workSummary);
          } else {
            // В расчет попалась новое подразделение в дистанции
            const subdivisionSummary = createPlanFactWorkInstance();

            directionSummary[pprData.idDistance] = {
              ...directionSummary[pprData.idDistance],
              [pprData.idSubdivision]: subdivisionSummary,
            };

            handlePlanFactWorkValues(pprData, subdivisionSummary, distanceSummary, directionSummary, workSummary);
          }
        } else {
          // В расчет попалась новая дистанция в дирекции
          const subdivisionSummary = createPlanFactWorkInstance();

          const distanceSummary = {
            [pprData.idSubdivision]: subdivisionSummary,
            total: createPlanFactWorkInstance(),
          };

          workSummary[pprData.idDirection] = {
            ...workSummary[pprData.idDirection],
            [pprData.idDistance]: distanceSummary,
          };

          handlePlanFactWorkValues(pprData, subdivisionSummary, distanceSummary, directionSummary, workSummary);
        }
      } else {
        // В расчет попалась новая дирекция
        const subdivisionSummary = createPlanFactWorkInstance();

        const distanceSummary = {
          [pprData.idSubdivision]: subdivisionSummary,
          total: createPlanFactWorkInstance(),
        };

        const directionSummary = {
          [pprData.idDistance]: distanceSummary,
          total: createPlanFactWorkInstance(),
        };

        commonWorkReport[pprData.common_work_id] = { ...workSummary, [pprData.idDirection]: directionSummary };

        handlePlanFactWorkValues(pprData, subdivisionSummary, distanceSummary, directionSummary, workSummary);
      }
    } else {
      const subdivisionSummary = createPlanFactWorkInstance();

      const distanceSummary = {
        [pprData.idSubdivision]: subdivisionSummary,
        total: createPlanFactWorkInstance(),
      };

      const directionSummary = {
        [pprData.idDistance]: distanceSummary,
        total: createPlanFactWorkInstance(),
      };

      const workSummary: TWorkPlanFactWorkSummary = {
        [pprData.idDirection]: directionSummary,
        workData: {
          id: pprData.id,
          commonWorkId: pprData.common_work_id,
          name: pprData.name,
          measure: pprData.measure,
        },
        total: createPlanFactWorkInstance(),
      };

      commonWorkReport[pprData.common_work_id] = workSummary;

      handlePlanFactWorkValues(pprData, subdivisionSummary, distanceSummary, directionSummary, workSummary);
    }
  });
  const reportData: IFulfillmentReportData[] = [];

  Object.keys(commonWorkReport).map((commonWorkId) => {
    const workSummary = commonWorkReport[Number(commonWorkId)];

    workSummary &&
      Object.keys(workSummary).map((directionId, directionIndex, directionsList) => {
        if (directionId !== "total") {
          const directionSummary = workSummary[Number(directionId)];

          directionSummary &&
            Object.keys(directionSummary).map((distanceId, distanceIndex, distancesList) => {
              if (distanceId !== "total") {
                const distanceSummary = directionSummary[Number(distanceId)];

                distanceSummary &&
                  Object.keys(distanceSummary).map((subdivisionId, subdivisionIndex, subdivisionsList) => {
                    if (subdivisionId !== "total") {
                      const subdivisionSummary = distanceSummary[Number(subdivisionId)];

                      reportData.push({
                        ...subdivisionSummary,
                        id: workSummary.workData.id,
                        common_work_id: workSummary.workData.commonWorkId,
                        name: workSummary.workData.name,
                        measure: workSummary.workData.measure,
                        divisionId:
                          divisions.subdivisionsMap.get(Number(subdivisionId))?.shortName || `Цех id ${subdivisionId}`,
                        summaryRowType: "subdivision",
                      });
                    }
                    if (subdivisionIndex === subdivisionsList.length - 1) {
                      reportData.push({
                        ...distanceSummary.total,
                        id: workSummary.workData.id,
                        common_work_id: workSummary.workData.commonWorkId,
                        name: workSummary.workData.name,
                        measure: workSummary.workData.measure,
                        divisionId:
                          divisions.distancesMap.get(Number(distanceId))?.shortName || `Дистанция id ${distanceId}`,
                        summaryRowType: "distance",
                      });
                    }
                  });
              }
              if (distanceIndex === distancesList.length - 1) {
                reportData.push({
                  ...directionSummary.total,
                  id: workSummary.workData.id,
                  common_work_id: workSummary.workData.commonWorkId,
                  name: workSummary.workData.name,
                  measure: workSummary.workData.measure,
                  divisionId:
                    divisions.directionsMap.get(Number(directionId))?.shortName || `Дирекция id ${directionId}`,
                  summaryRowType: "direction",
                });
              }
            });
        }
        if (directionIndex === directionsList.length - 1) {
          reportData.push({
            ...workSummary.total,
            id: workSummary.workData.id,
            common_work_id: workSummary.workData.commonWorkId,
            name: workSummary.workData.name,
            measure: workSummary.workData.measure,
            divisionId: `Итого`,
            summaryRowType: "total",
          });
        }
      });
  });

  // расчет rowSpan для объединения ячеек с одинаковыми работами
  reportData.forEach((pprData, index, arr) => {
    if (tempCommonWorkId !== pprData.common_work_id) {
      reportSettings[tempIndex] = { rowSpan: tempRowSpan };
      tempIndex = index;
      tempRowSpan = 1;
      tempCommonWorkId = pprData.common_work_id;
    } else {
      tempRowSpan++;
    }

    if (index === arr.length - 1) {
      reportSettings[tempIndex] = { rowSpan: tempRowSpan };
    }
  });

  return { reportData, reportSettings };
}
