export interface IRowData {
  id: string;
  index: string;
  branch: string;
  subbranch: string;
  section: string;
  subsectionFirst: string;
  subsectionSecond: string;
  location: string;
  lineClass: string;
  measure: string;
  totalCount: string;
  entryYear: string;
  periodicityNormal: string;
  lastMaintenanceYear: string;
  periodicityLast: string;
  normOfTime: string;
  normOfTimeDocument: string;
  unity: string;
  planWork: IMonthData;
  planTime: IMonthData;
  factWork: IMonthData;
  factNormTime: IMonthData;
  factTime: IMonthData;
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
