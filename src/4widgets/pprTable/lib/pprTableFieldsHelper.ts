import { MONTHS, TMonth, TTimePeriod } from "@/1shared/const/date";
import { ITableCellProps } from "@/1shared/ui/table";
import {
  IPprData,
  PLAN_WORK_FIELDS,
  FACT_WORK_FIELDS,
  FACT_TIME_FIELDS,
  checkIsWorkOrTimeField,
  getPlanWorkFieldByTimePeriod,
  getFactWorkFieldByTimePeriod,
  getFactTimeFieldByTimePeriod,
} from "@/2entities/ppr";

export type TPprFieldSettings = { [key in keyof IPprData]?: ITableCellProps };

export function getThStyle(key?: keyof IPprData): React.CSSProperties {
  switch (key) {
    case "name":
      return { width: "13%" };
    case "location":
      return { width: "6%" };
    case "norm_of_time_document":
      return { width: "6%" };
    case "measure":
      return { width: "8%" };
    case "last_maintenance_year":
      return { width: "5%" };
    default:
      return {};
  }
}

export function checkIsFieldVertical(field: keyof IPprData): boolean {
  return (
    checkIsWorkOrTimeField(field) ||
    field === "total_count" ||
    field === "entry_year" ||
    field === "periodicity_fact" ||
    field === "periodicity_normal" ||
    field === "line_class" ||
    field === "unity" ||
    field === "norm_of_time"
  );
}

const EDITABLE_NUMBER_CELL: ITableCellProps = { cellType: "input", type: "number" };

const EDITABLE_WORK_DATA_FIELDS: TPprFieldSettings = {
  name: { cellType: "textarea" },
  measure: { cellType: "textarea" },
  norm_of_time: { cellType: "input" },
  norm_of_time_document: { cellType: "textarea" },
};

const EDITABLE_PLACE_DATA_FIELDS: TPprFieldSettings = {
  location: { cellType: "textarea" },
  line_class: { cellType: "input" },
  total_count: { cellType: "input" },
  entry_year: { cellType: "input" },
  periodicity_normal: { cellType: "input" },
  last_maintenance_year: { cellType: "textarea" },
  unity: { cellType: "input" },
};

const EDITABLE_ALL_WORK_AND_PLACE_DATA_FIELDS: TPprFieldSettings = {
  ...EDITABLE_WORK_DATA_FIELDS,
  ...EDITABLE_PLACE_DATA_FIELDS,
};

const ALL_PLAN_FACT_MONTH_FIELDS = [...PLAN_WORK_FIELDS, ...FACT_WORK_FIELDS, ...FACT_TIME_FIELDS].filter(
  (field) => !field.startsWith("year")
);

function createEditableAllPlanFactFields(): TPprFieldSettings {
  const settings: TPprFieldSettings = {};

  ALL_PLAN_FACT_MONTH_FIELDS.forEach((field) => (settings[field] = EDITABLE_NUMBER_CELL));

  return settings;
}

function createEditablePlanWorkFieldByMonth(month: TMonth): TPprFieldSettings {
  const settings: TPprFieldSettings = {};

  const planWorkField = getPlanWorkFieldByTimePeriod(month);

  return Object.assign(settings, { [planWorkField]: EDITABLE_NUMBER_CELL });
}

function createEditableFactWorkAndFactTimeFieldByMonth(month: TMonth): TPprFieldSettings {
  const settings: TPprFieldSettings = {};

  const factWorkField = getFactWorkFieldByTimePeriod(month);
  const factTimeField = getFactTimeFieldByTimePeriod(month);

  return Object.assign(settings, { [factWorkField]: EDITABLE_NUMBER_CELL, [factTimeField]: EDITABLE_NUMBER_CELL });
}

export interface IEditableFieldsSettings {
  commonWork: TPprFieldSettings;
  notCommonWork: TPprFieldSettings;
  timePeriod: {
    [key in TTimePeriod]: { plan: TPprFieldSettings; fact: TPprFieldSettings };
  };
}

export const editableFieldsSettings: IEditableFieldsSettings = {
  commonWork: EDITABLE_PLACE_DATA_FIELDS,
  notCommonWork: EDITABLE_ALL_WORK_AND_PLACE_DATA_FIELDS,
  timePeriod: {
    year: { plan: createEditableAllPlanFactFields(), fact: {} },
    ...Object.assign(
      {},
      ...MONTHS.map((month) => ({
        [month]: {
          plan: createEditablePlanWorkFieldByMonth(month),
          fact: createEditableFactWorkAndFactTimeFieldByMonth(month),
        },
      }))
    ),
  },
};

