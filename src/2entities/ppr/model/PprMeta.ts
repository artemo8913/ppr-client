import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import { FACT_NORM_TIME_FIELDS, FACT_TIME_FIELDS, PLAN_TIME_FIELDS, PLAN_WORK_FIELDS } from "./ppr.const";
import {
  PlannedWorkWithCorrections,
  PlannedWorkId,
  PlannedWorkTotalTimes,
  WorkingMansTotalTimes,
  PlannedWork,
} from "./ppr.types";

type TotalWorkTime = { final: PlannedWorkTotalTimes; original: PlannedWorkTotalTimes };

type BranchMeta = {
  name: string;
  type: "branch";
  orderIndex: string;
  prev: BranchMeta | null;
  subbranches: SubbranchMeta[];
  workIds: Set<PlannedWorkId>;
  total: TotalWorkTime;
};

type SubbranchMeta = {
  name: string;
  type: "subbranch";
  orderIndex: string;
  prev: SubbranchMeta | null;
  workIds: Set<PlannedWorkId>;
  total: TotalWorkTime;
};

type BranchOrSubbranch = BranchMeta | SubbranchMeta;

type PprMetaType = {
  worksRowSpan: number[];
  subbranchesList: string[];
  branchesMeta: BranchOrSubbranch[];
  worksOrder: { [id: PlannedWorkId]: string };
  totalWorkTime: TotalWorkTime;
  totalWorkingManTime?: WorkingMansTotalTimes;
  branchesAndSubbrunchesList: {
    [id: PlannedWorkId]: {
      branch?: BranchMeta;
      subbranch: SubbranchMeta;
    };
  };
};

export class YearPlanDataStructureConverter {
  plannedWorks: PlannedWork[];

  private _simplifyDataStructure(work: PlannedWorkWithCorrections, type: "original" | "final"): PlannedWork {
    const planValues = PLAN_WORK_FIELDS.map((field) => ({ [field]: work[field][type] }));
    const planTimes = PLAN_TIME_FIELDS.map((field) => ({ [field]: work[field][type] }));

    return {
      ...work,
      ...Object.assign({}, ...planValues),
      ...Object.assign({}, ...planTimes),
    };
  }

  constructor(plannedWorks: PlannedWorkWithCorrections[], type: "original" | "final") {
    this.plannedWorks = plannedWorks.map((work) => this._simplifyDataStructure(work, type));
  }
}

//TODO: сделать какой-нибудь сервис Ppr, который в одном месте соберет все связанные сервисы в одном месте.

/**TODO: Разбить на подклассы. Также думаю, что необходимо сделать так, чтобы подсчет итоговых значений ничего не знал
 * о final и original значениях. Например, был бы какой-нибудь сервис, который бы предоставлял простую структуры запланированных
 * работ (field: number | string). А не как сейчас для плановых объемов работ PlanWorkFieldValues {original: number;} и т.п.
 * Это поможет свести функции _addTimeInTempBranch, _addTimeInTempSubbranch, _addTimeInTotalTime к одной единственной, и избавиться
 * от original | final values в расчетах - в зависимости от вида будут расчеты по разным полям.
 *
 * Структуру данных PlanWorkFieldValues может и нельзя упростить из-за выдуманного процесса переноса работ,
 * но её реализацию надо "спрятать", инкапсулировать куда-нибудь
 */
export class PprWorksMeta {
  private _tempBranchMeta: BranchMeta | null = null;
  private _tempSubbranchMeta: SubbranchMeta | null = null;
  private _tempWorkOrder: number = 0;

  private _branchesMeta: BranchMeta[] = [];

  private _branchesAndSubbranchesIndexList: {
    [id: PlannedWorkId]: {
      branch?: BranchMeta;
      subbranch: SubbranchMeta;
    };
  } = {};

  private _worksOrder: { [id: PlannedWorkId]: string } = {};

  private _totalTime: TotalWorkTime = { final: {}, original: {} };

  private _subbranchesSet = new Set<string>();

  private _rowSpans: number[] = [];

  private _tempWork = {
    index: -1,
    name: "",
    note: "",
    subbranch: "",
    branch: "additional",
  };

  constructor(yearPlannedWorks: PlannedWorkWithCorrections[]) {
    yearPlannedWorks.forEach((pprData, index) => this._updateBy(pprData, index));
  }

  private _createNewBranchMeta(pprData: PlannedWorkWithCorrections): BranchMeta {
    return {
      name: pprData.branch,
      prev: this._tempBranchMeta,
      orderIndex: `${this._branchesMeta.length + 1}.`,
      type: "branch",
      subbranches: [],
      workIds: new Set(),
      total: { final: {}, original: {} },
    };
  }

  private _createNewSubbranchMeta(pprData: PlannedWorkWithCorrections): SubbranchMeta {
    return {
      name: pprData.subbranch,
      prev: this._tempSubbranchMeta,
      orderIndex: `${this._branchesMeta.length}.${(this._tempBranchMeta?.subbranches.length || 0) + 1}.`,
      type: "subbranch",
      workIds: new Set(),
      total: { final: {}, original: {} },
    };
  }

  private _increaseRowSpanFor() {
    this._rowSpans[this._tempWork.index]++;
  }

  private _makeZeroRowSpanFor(index: number) {
    this._rowSpans[index] = 0;
  }

  private _initRowSpanFor(index: number) {
    this._rowSpans[index] = 1;
  }

  private _updateTempWork(index: number, pprData: PlannedWorkWithCorrections) {
    this._tempWork = {
      index,
      name: pprData.name,
      note: pprData.note,
      subbranch: pprData.subbranch,
      branch: pprData.branch,
    };
  }

  private _addToSubbranchList(subbranch: string) {
    this._subbranchesSet.add(subbranch);
  }

  private _updateBranchInIndexList(index: number, branch: BranchMeta) {
    this._branchesAndSubbranchesIndexList[index] = {
      ...this._branchesAndSubbranchesIndexList[index],
      branch: branch,
    };
  }

  private _updateSubbranchInIndexList(index: number, subbranch: SubbranchMeta) {
    this._branchesAndSubbranchesIndexList[index] = {
      ...this._branchesAndSubbranchesIndexList[index],
      subbranch: subbranch,
    };
  }

  private _updateTempBranchMeta(pprData: PlannedWorkWithCorrections): BranchMeta {
    this._tempBranchMeta = this._createNewBranchMeta(pprData);
    this._branchesMeta.push(this._tempBranchMeta);

    return this._tempBranchMeta;
  }

  private _updateTempSubbranchMeta(pprData: PlannedWorkWithCorrections): SubbranchMeta {
    this._tempSubbranchMeta = this._createNewSubbranchMeta(pprData);
    this._tempBranchMeta?.subbranches.push(this._tempSubbranchMeta);

    return this._tempSubbranchMeta;
  }

  private _addTimeInTempBranch(type: "original" | "final", value: number, field: keyof PlannedWorkTotalTimes) {
    if (!this._tempBranchMeta) {
      throw new Error("При попытке расчета итоговых значений категории произошла ошибка");
    }
    if (this._tempBranchMeta.total[type][field] !== undefined) {
      this._tempBranchMeta.total[type][field] = roundToFixed(value + this._tempBranchMeta.total[type][field]!);
    } else {
      this._tempBranchMeta.total[type][field] = roundToFixed(value);
    }
  }

  private _addTimeInTempSubbranch(type: "original" | "final", value: number, field: keyof PlannedWorkTotalTimes) {
    if (!this._tempSubbranchMeta) {
      throw new Error("При попытке расчета итоговых значений подкатегории произошла ошибка");
    }
    if (this._tempSubbranchMeta.total[type][field] !== undefined) {
      this._tempSubbranchMeta.total[type][field] = roundToFixed(value + this._tempSubbranchMeta.total[type][field]!);
    } else {
      this._tempSubbranchMeta.total[type][field] = roundToFixed(value);
    }
  }

  private _addTimeInTotalTime(type: "original" | "final", value: number, field: keyof PlannedWorkTotalTimes) {
    if (!this._totalTime) {
      throw new Error("При попытке расчета итога произошла ошибка");
    }
    if (this._totalTime[type][field] !== undefined) {
      this._totalTime[type][field] = roundToFixed(value + this._totalTime[type][field]!);
    } else {
      this._totalTime[type][field] = roundToFixed(value);
    }
  }

  private _addTimeInAllTotals(pprData: PlannedWorkWithCorrections) {
    PLAN_TIME_FIELDS.forEach((field) => {
      this._addTimeInTempBranch("original", pprData[field].original, field);
      this._addTimeInTempSubbranch("original", pprData[field].original, field);
      this._addTimeInTotalTime("original", pprData[field].original, field);
      this._addTimeInTempBranch("final", pprData[field].final, field);
      this._addTimeInTempSubbranch("final", pprData[field].final, field);
      this._addTimeInTotalTime("final", pprData[field].final, field);
    });
    FACT_NORM_TIME_FIELDS.forEach((field) => {
      this._addTimeInTempBranch("original", pprData[field], field);
      this._addTimeInTempSubbranch("original", pprData[field], field);
      this._addTimeInTotalTime("original", pprData[field], field);
      this._addTimeInTempBranch("final", pprData[field], field);
      this._addTimeInTempSubbranch("final", pprData[field], field);
      this._addTimeInTotalTime("final", pprData[field], field);
    });
    FACT_TIME_FIELDS.forEach((field) => {
      this._addTimeInTempBranch("original", pprData[field], field);
      this._addTimeInTempSubbranch("original", pprData[field], field);
      this._addTimeInTotalTime("original", pprData[field], field);
      this._addTimeInTempBranch("final", pprData[field], field);
      this._addTimeInTempSubbranch("final", pprData[field], field);
      this._addTimeInTotalTime("final", pprData[field], field);
    });
  }

  private _addWorkOrderFor(index: number, order: string) {
    this._worksOrder[index] = order;
  }

  private _generateWorkOrder() {
    return `${this._tempSubbranchMeta?.orderIndex}${this._tempWorkOrder}`;
  }

  private _increaseTempWorkOrder() {
    return ++this._tempWorkOrder;
  }

  private _resetTempWorkOrder() {
    this._tempWorkOrder = 1;
  }

  private _updateBy(pprData: PlannedWorkWithCorrections, index: number) {
    const isSameName = this._tempWork.name === pprData.name;
    const isSameBranch = this._tempBranchMeta?.name === pprData.branch;
    const isSameSubbranch = this._tempSubbranchMeta?.name === pprData.subbranch;
    const isSameNote = this._tempWork.note === pprData.note;

    const isSameWork = isSameName && isSameNote && isSameBranch && isSameSubbranch;
    const isChangedBranch = !isSameBranch;
    const isChangedSubbranch = !isSameBranch || !isSameSubbranch;

    if (isSameWork) {
      this._increaseRowSpanFor();
      this._makeZeroRowSpanFor(index);
    } else {
      this._addWorkOrderFor(this._tempWork.index, this._generateWorkOrder());
      this._increaseTempWorkOrder();
      this._updateTempWork(index, pprData);
      this._initRowSpanFor(index);
    }

    if (isChangedBranch) {
      const newBranch = this._updateTempBranchMeta(pprData);
      this._updateBranchInIndexList(index, newBranch);
    }

    if (isChangedSubbranch) {
      const newSubbranch = this._updateTempSubbranchMeta(pprData);
      this._updateSubbranchInIndexList(index, newSubbranch);
      this._resetTempWorkOrder();
      this._addWorkOrderFor(index, this._generateWorkOrder());
    }

    this._addToSubbranchList(pprData.subbranch);
    this._addTimeInAllTotals(pprData);
  }

  getIndexList() {
    return this._branchesAndSubbranchesIndexList;
  }

  getBranchesMeta() {
    return this._branchesMeta;
  }

  getTotalTime() {
    return this._totalTime;
  }

  getSubbranchList() {
    return Array.from(this._subbranchesSet);
  }

  getRowSpans() {
    return this._rowSpans;
  }

  getWorksOrder() {
    return this._worksOrder;
  }
}

export function createPprMeta2(yearPlannedWorks: PlannedWorkWithCorrections[]): PprMetaType {
  const workMeta = new PprWorksMeta(yearPlannedWorks);

  return {
    worksRowSpan: workMeta.getRowSpans(),
    totalWorkTime: workMeta.getTotalTime(),
    branchesMeta: workMeta.getBranchesMeta(),
    subbranchesList: workMeta.getSubbranchList(),
    branchesAndSubbrunchesList: workMeta.getIndexList(),
    worksOrder: workMeta.getWorksOrder(),
  };
}
