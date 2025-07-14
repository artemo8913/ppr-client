import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import { FACT_NORM_TIME_FIELDS, FACT_TIME_FIELDS, PLAN_TIME_FIELDS, PLAN_WORK_FIELDS } from "./ppr.const";
import {
  PlannedWork,
  PlannedWorkId,
  PlannedWorkTotalTimes,
  WorkingMansTotalTimes,
  PlannedWorkWithCorrections,
  PlannedWorksAndWorkingMansTotalTimes,
} from "./ppr.types";

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

type BranchMeta = {
  name: string;
  type: "branch";
  orderIndex: string;
  prev: BranchMeta | null;
  subbranches: SubbranchMeta[];
  workIds: Set<PlannedWorkId>;
  total: PlannedWorkTotalTimes;
};

type SubbranchMeta = {
  name: string;
  type: "subbranch";
  orderIndex: string;
  prev: SubbranchMeta | null;
  workIds: Set<PlannedWorkId>;
  total: PlannedWorkTotalTimes;
};

type YearPlanMeta = {
  worksRowSpan: number[];
  subbranchesList: string[];
  branchesMeta: (BranchMeta | SubbranchMeta)[];
  worksOrder: { [id: PlannedWorkId]: string };
  totalWorkTime: PlannedWorkTotalTimes;
  totalWorkingManTime?: WorkingMansTotalTimes;
  branchesAndSubbrunchesIndexList: {
    [id: PlannedWorkId]: {
      branch?: BranchMeta;
      subbranch: SubbranchMeta;
    };
  };
};

export class PlannedWorkConverter {
  static convertToPlannedWorkFrom(work: PlannedWorkWithCorrections, type: "original" | "final"): PlannedWork {
    const planValues = PLAN_WORK_FIELDS.map((field) => ({ [field]: work[field][type] }));
    const planTimes = PLAN_TIME_FIELDS.map((field) => ({ [field]: work[field][type] }));

    return {
      ...work,
      ...Object.assign({}, ...planValues),
      ...Object.assign({}, ...planTimes),
    };
  }

  static convertManyToPlannedWorkFrom(manyWorks: PlannedWorkWithCorrections[], type: "original" | "final") {
    return manyWorks.map((work) => this.convertToPlannedWorkFrom(work, type));
  }
}

class SubbranchesList {
  private _subbranchesSet = new Set<string>();

  add(subbranch: string) {
    this._subbranchesSet.add(subbranch);
  }

  get() {
    return Array.from(this._subbranchesSet);
  }
}

class WorksOrderCalculator {
  private _worksOrderStore: { [id: PlannedWorkId]: string } = {};

  private _tempWorkOrder: number = 0;

  private _generateWorkOrder(subbranchOrder: string) {
    return `${subbranchOrder}${this._tempWorkOrder}`;
  }

  saveWorkOrderInStoreFor(index: number, subbranchOrder: string) {
    this._worksOrderStore[index] = this._generateWorkOrder(subbranchOrder);
  }

  increaseWorkOrder() {
    return ++this._tempWorkOrder;
  }

  resetWorkOrder() {
    this._tempWorkOrder = 1;
  }

  getWorksOrderStore() {
    return this._worksOrderStore;
  }
}

class RowSpanCalculator {
  private _rowSpans: number[] = [];

  increaseRowSpanFor(index: number) {
    this._rowSpans[index]++;
  }

  clearSpanFor(index: number) {
    this._rowSpans[index] = 0;
  }

  initRowSpanFor(index: number) {
    this._rowSpans[index] = 1;
  }

  getRowSpans() {
    return this._rowSpans;
  }
}

class YearPlanTotalCalculator {
  private _total: PlannedWorksAndWorkingMansTotalTimes = { workingMans: {}, works: {} };

  reset() {
    this._total = { workingMans: {}, works: {} };
  }

  addWorkTime(value: number, field: keyof PlannedWorkTotalTimes) {
    if (this._total.works[field] !== undefined) {
      this._total.works[field] = roundToFixed(value + this._total.works[field]!);
    } else {
      this._total.works[field] = roundToFixed(value);
    }
  }

  addWorkingManTime(value: number, field: keyof WorkingMansTotalTimes) {
    if (this._total.workingMans[field] !== undefined) {
      this._total.workingMans[field] = roundToFixed(value + this._total.workingMans[field]!);
    } else {
      this._total.workingMans[field] = roundToFixed(value);
    }
  }

  getWorks() {
    return this._total.works;
  }

  getWorkingMans() {
    return this._total.workingMans;
  }
}

class BranchAndSubbranchMetaCreator {
  private _totalCalculator = new YearPlanTotalCalculator();
  private _branchTotalCalculator = new YearPlanTotalCalculator();
  private _subbranchTotalCalculator = new YearPlanTotalCalculator();

  private _tempBranchMeta: BranchMeta | null = null;
  private _tempSubbranchMeta: SubbranchMeta | null = null;

  private _branchesMeta: BranchMeta[] = [];

  private _branchesAndSubbranchesIndexList: {
    [id: PlannedWorkId]: {
      branch?: BranchMeta;
      subbranch: SubbranchMeta;
    };
  } = {};

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

  createNewBranchMetaBy(index: number, work: PlannedWork): BranchMeta {
    this._branchTotalCalculator.reset();

    const newBranch: BranchMeta = {
      name: work.branch,
      prev: this._tempBranchMeta,
      orderIndex: `${this._branchesMeta.length + 1}.`,
      type: "branch",
      subbranches: [],
      workIds: new Set(),
      total: this._branchTotalCalculator.getWorks(),
    };

    this._updateBranchInIndexList(index, newBranch);
    this._branchesMeta.push(newBranch);
    this._tempBranchMeta = newBranch;

    return newBranch;
  }

  createNewSubbranchMetaBy(index: number, work: PlannedWork): SubbranchMeta {
    this._subbranchTotalCalculator.reset();

    const newSubbranch: SubbranchMeta = {
      name: work.subbranch,
      prev: this._tempSubbranchMeta,
      orderIndex: `${this._branchesMeta.length}.${(this._tempBranchMeta?.subbranches.length || 0) + 1}.`,
      type: "subbranch",
      workIds: new Set(),
      total: this._subbranchTotalCalculator.getWorks(),
    };

    this._updateSubbranchInIndexList(index, newSubbranch);
    this._tempSubbranchMeta = newSubbranch;
    this._tempBranchMeta?.subbranches.push(newSubbranch);

    return newSubbranch;
  }

  addTimeInAllTotals(work: PlannedWork) {
    [...PLAN_TIME_FIELDS, ...FACT_NORM_TIME_FIELDS, ...FACT_TIME_FIELDS].forEach((field) => {
      this._branchTotalCalculator.addWorkTime(work[field], field);
      this._subbranchTotalCalculator.addWorkTime(work[field], field);
      this._totalCalculator.addWorkTime(work[field], field);
    });
  }

  getCurrentSubbranchOrder(): string {
    return this._tempSubbranchMeta?.orderIndex || "";
  }

  getIndexList() {
    return this._branchesAndSubbranchesIndexList;
  }

  getBranchesMeta() {
    return this._branchesMeta;
  }

  getTotalTime() {
    return this._totalCalculator.getWorks();
  }
}

export class YearPlanMetaCreator {
  private _subbranchList = new SubbranchesList();
  private _rowSpanCalculator = new RowSpanCalculator();
  private _workOrderCalculator = new WorksOrderCalculator();
  private _branchesAndSubbranchesCreator = new BranchAndSubbranchMetaCreator();

  private _tempWork = {
    index: -1,
    name: "",
    note: "",
    subbranch: "",
    branch: "additional",
  };

  constructor(yearPlannedWorks: PlannedWorkWithCorrections[], type: "original" | "final") {
    yearPlannedWorks.forEach((pprData, index) =>
      this._updateBy(PlannedWorkConverter.convertToPlannedWorkFrom(pprData, type), index)
    );
  }

  private _updateTempWork(index: number, pprData: PlannedWork) {
    this._tempWork = {
      index,
      name: pprData.name,
      note: pprData.note,
      branch: pprData.branch,
      subbranch: pprData.subbranch,
    };
  }

  private _updateBy(pprData: PlannedWork, index: number) {
    const isSameName = this._tempWork.name === pprData.name;
    const isSameBranch = this._tempWork.branch === pprData.branch;
    const isSameSubbranch = this._tempWork.subbranch === pprData.subbranch;
    const isSameNote = this._tempWork.note === pprData.note;

    const isSameWork = isSameName && isSameNote && isSameBranch && isSameSubbranch;
    const isBranchChanged = !isSameBranch;
    const isSubbranchChanged = !isSameBranch || !isSameSubbranch;

    const subbranchOrder = this._branchesAndSubbranchesCreator.getCurrentSubbranchOrder();

    if (isSameWork) {
      this._rowSpanCalculator.increaseRowSpanFor(index);
      this._rowSpanCalculator.clearSpanFor(index);
    } else {
      this._workOrderCalculator.saveWorkOrderInStoreFor(this._tempWork.index, subbranchOrder);
      this._workOrderCalculator.increaseWorkOrder();
      this._updateTempWork(index, pprData);
      this._rowSpanCalculator.initRowSpanFor(index);
    }

    if (isBranchChanged) {
      this._branchesAndSubbranchesCreator.createNewBranchMetaBy(index, pprData);
    }

    if (isSubbranchChanged) {
      this._branchesAndSubbranchesCreator.createNewSubbranchMetaBy(index, pprData);
      this._workOrderCalculator.saveWorkOrderInStoreFor(index, subbranchOrder);
      this._workOrderCalculator.resetWorkOrder();
    }

    this._subbranchList.add(pprData.subbranch);
    this._branchesAndSubbranchesCreator.addTimeInAllTotals(pprData);
  }

  getYearPlanMeta(): YearPlanMeta {
    return {
      worksRowSpan: this._rowSpanCalculator.getRowSpans(),
      worksOrder: this._workOrderCalculator.getWorksOrderStore(),
      subbranchesList: this._subbranchList.get(),
      branchesAndSubbrunchesIndexList: this._branchesAndSubbranchesCreator.getIndexList(),
      branchesMeta: this._branchesAndSubbranchesCreator.getBranchesMeta(),
      totalWorkTime: this._branchesAndSubbranchesCreator.getTotalTime(),
      totalWorkingManTime: {},
    };
  }
}

export function createPprMeta2(yearPlannedWorks: PlannedWorkWithCorrections[]): YearPlanMeta {
  return new YearPlanMetaCreator(yearPlannedWorks, "final").getYearPlanMeta();
}
