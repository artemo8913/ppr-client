import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { DivisionType } from "@/2entities/division/@x/ppr";
import {
  BRANCHES,
  FACT_TIME_FIELDS,
  PprField,
  IPprData,
  PLAN_TIME_FIELDS,
  TFactTimePeriods,
  TPlanTimePeriods,
  TPprDataForReport,
  translateRuPprBranchName,
  TWorkBranch,
} from "@/2entities/ppr";

const TRANSENERGO_ID = 0;

type TPlanFactWorkFields = {
  [key in TFactTimePeriods | TPlanTimePeriods]: number;
};

interface IDivisionData extends TPlanFactWorkFields {
  shortName: string;
}

type TDivision = { [id: number]: IDivisionData };

type TAllDivisionsData = {
  [key in DivisionType]: TDivision;
};

interface ILaborCostReportSettings {
  [index: number]: { rowSpan: number };
}

interface ILaborCostReportData {
  divisionId: number;
  branch: TWorkBranch;
  name: TWorkBranch | string;
  divisionType: DivisionType;
  divisionData: IDivisionData;
}

const DIVISIONS_TYPES: DivisionType[] = ["subdivision", "distance", "direction", "transenergo"] as const;

function getMonthPlanTime(planField: TPlanTimePeriods, pprData?: IPprData) {
  if (!pprData) {
    return 0;
  }
  const planWork = pprData[PprField.getPlanWorkFieldByPlanTimeField(planField)];

  const planWorkValue =
    planWork.handCorrection !== null ? planWork.handCorrection : planWork.original + planWork.outsideCorrectionsSum;

  return roundToFixed(planWorkValue * pprData.norm_of_time);
}

function createPlanFactTimeInstance(pprData?: IPprData): TPlanFactWorkFields {
  return {
    year_plan_time: getMonthPlanTime("year_plan_time", pprData),
    jan_plan_time: getMonthPlanTime("jan_plan_time", pprData),
    feb_plan_time: getMonthPlanTime("feb_plan_time", pprData),
    mar_plan_time: getMonthPlanTime("mar_plan_time", pprData),
    apr_plan_time: getMonthPlanTime("apr_plan_time", pprData),
    may_plan_time: getMonthPlanTime("may_plan_time", pprData),
    june_plan_time: getMonthPlanTime("june_plan_time", pprData),
    july_plan_time: getMonthPlanTime("july_plan_time", pprData),
    aug_plan_time: getMonthPlanTime("aug_plan_time", pprData),
    sept_plan_time: getMonthPlanTime("sept_plan_time", pprData),
    oct_plan_time: getMonthPlanTime("oct_plan_time", pprData),
    nov_plan_time: getMonthPlanTime("nov_plan_time", pprData),
    dec_plan_time: getMonthPlanTime("dec_plan_time", pprData),
    year_fact_time: pprData?.year_fact_time || 0,
    jan_fact_time: pprData?.jan_fact_time || 0,
    feb_fact_time: pprData?.feb_fact_time || 0,
    mar_fact_time: pprData?.mar_fact_time || 0,
    apr_fact_time: pprData?.apr_fact_time || 0,
    may_fact_time: pprData?.may_fact_time || 0,
    june_fact_time: pprData?.june_fact_time || 0,
    july_fact_time: pprData?.july_fact_time || 0,
    aug_fact_time: pprData?.aug_fact_time || 0,
    sept_fact_time: pprData?.sept_fact_time || 0,
    oct_fact_time: pprData?.oct_fact_time || 0,
    nov_fact_time: pprData?.nov_fact_time || 0,
    dec_fact_time: pprData?.dec_fact_time || 0,
  };
}

function sumPlanFactTimeInstance(planFactData: TPlanFactWorkFields, pprData?: IPprData): TPlanFactWorkFields {
  PLAN_TIME_FIELDS.forEach((field) => (planFactData[field] += getMonthPlanTime(field, pprData)));
  FACT_TIME_FIELDS.forEach((field) => (planFactData[field] += pprData ? pprData[field] : 0));

  return planFactData;
}

function getDivisionShortName(divisionType: DivisionType, pprData: TPprDataForReport) {
  if (divisionType === "subdivision") {
    return pprData.subdivisionShortName;
  }
  if (divisionType === "distance") {
    return pprData.distanceShortName;
  }
  if (divisionType === "direction") {
    return pprData.directionShortName;
  }
  if (divisionType === "transenergo") {
    return "ТЭ";
  }
  return `${pprData.idSubdivision}-${pprData.idDistance}-${pprData.idDirection}`;
}

function handlePlanFactTimeValues({
  pprData,
  divisionId,
  divisionType,
  divisionData,
}: {
  pprData: TPprDataForReport;
  divisionId: number;
  divisionType: DivisionType;
  divisionData: TDivision;
}) {
  if (divisionType === "transenergo") {
    if (divisionData[TRANSENERGO_ID]) {
      sumPlanFactTimeInstance(divisionData[TRANSENERGO_ID], pprData);
    } else {
      divisionData[TRANSENERGO_ID] = {
        ...createPlanFactTimeInstance(pprData),
        shortName: getDivisionShortName(divisionType, pprData),
      };
    }
  } else if (divisionId in divisionData) {
    sumPlanFactTimeInstance(divisionData[divisionId], pprData);
  } else {
    divisionData[divisionId] = {
      ...createPlanFactTimeInstance(pprData),
      shortName: getDivisionShortName(divisionType, pprData),
    };
  }
}

export function calculateLaborCost(data: TPprDataForReport[], filterLevel?: DivisionType) {
  const divisionsDataByBranch: {
    [branch in TWorkBranch]: {
      [subbranch: string]: TAllDivisionsData;
    };
  } = { additional: {}, exploitation: {}, unforeseen: {} };

  const totalValuesByBranches: {
    [branch in TWorkBranch]: TAllDivisionsData;
  } = {
    additional: { direction: {}, distance: {}, subdivision: {}, transenergo: {} },
    exploitation: { direction: {}, distance: {}, subdivision: {}, transenergo: {} },
    unforeseen: { direction: {}, distance: {}, subdivision: {}, transenergo: {} },
  };

  data.forEach((pprData) => {
    const { branch, subbranch, idSubdivision, idDistance, idDirection } = pprData;

    if (!(subbranch in divisionsDataByBranch[branch])) {
      divisionsDataByBranch[branch][subbranch] = {
        direction: {},
        distance: {},
        subdivision: {},
        transenergo: {},
      };
    }

    DIVISIONS_TYPES.forEach((divisionType) => {
      const divisionId =
        divisionType === "subdivision"
          ? idSubdivision
          : divisionType === "distance"
          ? idDistance
          : divisionType === "direction"
          ? idDirection
          : TRANSENERGO_ID;

      handlePlanFactTimeValues({
        pprData,
        divisionId,
        divisionType,
        divisionData: divisionsDataByBranch[branch][subbranch][divisionType],
      });

      handlePlanFactTimeValues({
        pprData,
        divisionId,
        divisionType,
        divisionData: totalValuesByBranches[branch][divisionType],
      });
    });
  });

  const report: ILaborCostReportData[] = [];

  BRANCHES.forEach((branch) => {
    Object.entries(divisionsDataByBranch[branch]).forEach(([name, subbranch]) => {
      DIVISIONS_TYPES.forEach((divisionType) => {
        Object.entries(subbranch[divisionType]).forEach(([divisionId, divisionData]) =>
          report.push({
            name,
            branch,
            divisionType,
            divisionData,
            divisionId: Number(divisionId),
          })
        );
      });
    });

    DIVISIONS_TYPES.forEach((divisionType) => {
      Object.entries(totalValuesByBranches[branch][divisionType]).forEach(([divisionId, divisionData]) => {
        report.push({
          name: `Итого по разделу "${translateRuPprBranchName(branch)}"`,
          branch,
          divisionType,
          divisionData,
          divisionId: Number(divisionId),
        });
      });
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

  const reportSettings: ILaborCostReportSettings = {};

  let tempBranchName: string | undefined = filteredReport[0] && filteredReport[0].name;
  let tempRowSpan: number = 0;
  let tempIndex: number = 0;

  filteredReport.forEach((reportData, index, arr) => {
    if (tempBranchName !== reportData.name) {
      reportSettings[tempIndex] = { rowSpan: tempRowSpan };
      tempIndex = index;
      tempRowSpan = 1;
      tempBranchName = reportData.name;
    } else {
      tempRowSpan++;
    }

    if (index === arr.length - 1) {
      reportSettings[tempIndex] = { rowSpan: tempRowSpan };
    }
  });

  return { report: filteredReport, reportSettings };
}
