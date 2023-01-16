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
  planWork: IMounthData;
  planTime: IMounthData;
  factWork: IMounthData;
  factNormTime: IMounthData;
  factTime: IMounthData;
}

export interface IRow {
  data: IRowData;
  infoColumnsList: Array<string>;
  editableColumnsList: Array<string>;
  workAndTimeColumnsList: Array<string>;
  mounthList: Array<string>;
  sectionVSpan?: number;
  subsectionVSpan?: number;
}

export interface ITitle {
  infoColumnsList: Array<string>;
  workAndTimeColumnsList: Array<string>;
  mounthList: Array<string>;
}

export interface IMounthData {
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
