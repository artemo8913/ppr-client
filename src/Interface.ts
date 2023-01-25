export interface IRowData {
  id: string;
  index: string;
  branch: string;
  subbranch: string;
  section: string;
  subsection_first: string;
  subsection_second: string;
  location: string;
  line_class: string;
  measure: string;
  total_count: string;
  entry_year: string;
  periodicity_normal: string;
  periodicity_fact: string;
  last_maintenance_year: string;
  norm_of_time: string;
  norm_of_time_document: string;
  unity: string;
  plan_work: IMonthData;
  plan_time: IMonthData;
  fact_work: IMonthData;
  fact_norm_time: IMonthData;
  fact_time: IMonthData;
}

export interface IRow {
  data: IRowData;
  infoColumnsList: Array<string>;
  editableColumnsList: Array<string>;
  workAndTimeColumnsList: Array<string>;
  monthList: Array<string>;
  sectionVSpan?: number;
  subsectionVSpan?: number;
}

export interface ITitle {
  infoColumnsList: Array<string>;
  workAndTimeColumnsList: Array<string>;
  monthList: Array<string>;
}

export interface IMonthData {
  year: number;
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
  children?: string | number;
  vText?: boolean;
  editable?: boolean;
  dropdown?: boolean;
  textareaRows?: number;
  textareaCols?: number;
  colSpan?: number;
  rowSpan?: number;
  widthPercent?: number;
}

export interface IUser {
  login: string;
  roles: Array<string>;
  id_subdivision: string;
  id_distance: string;
  id_direction: string;
}

export interface IPprGeneralData {
  id: string;
  year: string;
  id_subdivision: string;
  id_distance: string;
  id_direction: string;
  status: string;
  name: string;
  month: string;
  dir_name: string;
  dis_name: string;
  sub_name: string;
  dir_name_short: string;
  dis_name_short: string;
  sub_name_short: string;
}
