/*
{index_number, work_id, user_branch, subbranch, user_section, user_subsection, user_legal_document, user_norm_of_time, user_norm_of_time_document, user_periodicity, location, entry_year, last_maintenance_year, totalcount, user_measure, class_of_line, year_plan, year_plan_time, year_fact, year_fact_norm_time, year_fact_time, jan_plan, jan_plan_time, jan_fact, jan_fact_norm_time, jan_fact_time, feb_plan, feb_plan_time, feb_fact, feb_fact_norm_time, feb_fact_time, mar_plan, mar_plan_time, mar_fact, mar_fact_norm_time, mar_fact_time}
*/
export const IMounthList = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"] as const;
export const IRowDataTypeList = [
  "id",
  "index_number",
  "type",
  "section",
  "subsection",
  "location",
  "lineClass",
  "meter",
  "totalCount",
  "yearOfLaunch",
  "periodicityNormal",
  "periodicityFact",
  "periodicityLast",
  "normOfTime",
  "normOfTimeDocumentSource",
  "unity",
  "yearPlanWork",
  "yearPlanTime",
  "yearFactWork",
  "yearFactNormTime",
  "yearFactTime",
  "planWork",
  "planTime",
  "factWork",
  "factNormTime",
  "factTime",
] as const;
export interface IRowData {
  id: string;
  index_number: number;
  type: string;
  section: string;
  subsection: string;
  location: string;
  lineClass: string;
  meter: string;
  totalCount: number;
  yearOfLaunch: number;
  periodicityNormal: string;
  periodicityFact: string;
  periodicityLast: string;
  normOfTime: number;
  normOfTimeDocumentSource: string;
  unity: string;
  yearPlanWork: number;
  yearPlanTime: number;
  yearFactWork: number;
  yearFactNormTime: number;
  yearFactTime: number;
  planWork: IMounthData;
  planTime: IMounthData;
  factWork: IMounthData;
  factNormTime: IMounthData;
  factTime: IMounthData;
}

export interface IRow extends IRowData {
  sectionIsShow?: boolean;
  subsectionIsShow?: boolean;
  sectionSpan?: number;
  subsectionSpan?: number;
}

export interface IMounthData {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  june: number;
  july: number;
  aug: number;
  sept: number;
  oct: number;
  nov: number;
  dec: number;
}

export interface ICell {
  rowId?: string;
  type?: string;
  children: string | number | undefined;
  verticalText?: boolean;
  editable?: boolean;
  dropdown?: boolean;
  textareaRows?: number;
  textareaCols?: number;
  colSpan?: number;
  rowSpan?: number;
  widthPercent?: number;
}
