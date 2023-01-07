export interface IRowData {
  id: string;
  index: string;
  type: string;
  section: string;
  subsection: string;
  location: string;
  lineClass: string;
  meter: string;
  totalCount: string;
  yearOfLaunch: string;
  periodicityNormal: string;
  periodicityFact: string;
  periodicityLast: string;
  normOfTime: string;
  normOfTimeDocumentSource: string;
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
