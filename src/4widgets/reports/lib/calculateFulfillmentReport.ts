import { TDirection, TDistance, TDivisionType, TSubdivision } from "@/2entities/division/@x/ppr";

import {
  FACT_WORK_FIELDS,
  PLAN_WORK_FIELDS,
  IPprData,
  TFactWorkPeriods,
  TPlanWorkPeriods,
  TPprDataWorkId,
  TPprDataForReport,
} from "@/2entities/ppr";

//TODO: Подумать как упростить, затем переписать код. Что-то перемудрил, получилось очень сложно для восприятия.
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

interface IFulfillmentReportData extends TPlanFactWorkFields {
  id: TPprDataWorkId;
  common_work_id: number;
  name: string;
  measure: string;
  divisionId: string;
  divisionType: TDivisionType;
}

interface IFulfillmentReportSettings {
  [index: number]: { rowSpan: number };
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
  pprDataOrderedByCommonWorkId: TPprDataForReport[],
  divisions: {
    subdivisionsMap: Map<number, TSubdivision>;
    distancesMap: Map<number, TDistance>;
    directionsMap: Map<number, TDirection>;
  },
  filterLevel?: TDivisionType
) {
  const report: IFulfillmentReportData[] = [];

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

                      report.push({
                        ...subdivisionSummary,
                        id: workSummary.workData.id,
                        common_work_id: workSummary.workData.commonWorkId,
                        name: workSummary.workData.name,
                        measure: workSummary.workData.measure,
                        divisionId:
                          divisions.subdivisionsMap.get(Number(subdivisionId))?.shortName || `Цех id ${subdivisionId}`,
                        divisionType: "subdivision",
                      });
                    }
                    if (subdivisionIndex === subdivisionsList.length - 1) {
                      report.push({
                        ...distanceSummary.total,
                        id: workSummary.workData.id,
                        common_work_id: workSummary.workData.commonWorkId,
                        name: workSummary.workData.name,
                        measure: workSummary.workData.measure,
                        divisionId:
                          divisions.distancesMap.get(Number(distanceId))?.shortName || `Дистанция id ${distanceId}`,
                        divisionType: "distance",
                      });
                    }
                  });
              }
              if (distanceIndex === distancesList.length - 1) {
                report.push({
                  ...directionSummary.total,
                  id: workSummary.workData.id,
                  common_work_id: workSummary.workData.commonWorkId,
                  name: workSummary.workData.name,
                  measure: workSummary.workData.measure,
                  divisionId:
                    divisions.directionsMap.get(Number(directionId))?.shortName || `Дирекция id ${directionId}`,
                  divisionType: "direction",
                });
              }
            });
        }
        if (directionIndex === directionsList.length - 1) {
          report.push({
            ...workSummary.total,
            id: workSummary.workData.id,
            common_work_id: workSummary.workData.commonWorkId,
            name: workSummary.workData.name,
            measure: workSummary.workData.measure,
            divisionId: `ТЭ`,
            divisionType: "transenergo",
          });
        }
      });
  });

  const filteredReport = report.filter((reportData) => {
    if (filterLevel === "subdivision") {
      return reportData.divisionType === "subdivision";
    } else if (filterLevel === "distance") {
      return reportData.divisionType === "subdivision" || reportData.divisionType === "distance";
    } else if (filterLevel === "direction") {
      return reportData.divisionType === "distance" || reportData.divisionType === "direction";
    } else if (filterLevel === "transenergo") {
      return reportData.divisionType === "direction" || reportData.divisionType === "transenergo";
    }
    return true;
  });

  filteredReport.forEach((reportData, index, arr) => {
    if (tempCommonWorkId !== reportData.common_work_id) {
      reportSettings[tempIndex] = { rowSpan: tempRowSpan };
      tempIndex = index;
      tempRowSpan = 1;
      tempCommonWorkId = reportData.common_work_id;
    } else {
      tempRowSpan++;
    }

    if (index === arr.length - 1) {
      reportSettings[tempIndex] = { rowSpan: tempRowSpan };
    }
  });

  return { report: filteredReport, reportSettings };
}
