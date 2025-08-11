import { PprField } from "./PprField";
import { MonthPlanStatusUpdater } from "./PprMonthPlanStatusUpdater";
import { YearPlanStatusUpdater } from "./PprYearPlanStatusUpdater";

class YearPlanService {
  fields: PprField;
  statusUpdater: {
    month: MonthPlanStatusUpdater;
    year: YearPlanStatusUpdater;
  };

  constructor() {
    this.fields = new PprField();
    this.statusUpdater = {
      month: new MonthPlanStatusUpdater(),
      year: new YearPlanStatusUpdater(),
    };
  }
}

export const pprService = new YearPlanService();
