export interface IRowData {
  rowId: string;
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
  planWork: IMounthData;
  planTime: IMounthData;
  factWork: IMounthData;
  factNormTime: IMounthData;
  factTime: IMounthData;
}

export interface IRow {
  data: IRowData;
  columnList: Array<string>;
  mounthList: Array<string>;
  sectionIsShow?: boolean;
  subsectionIsShow?: boolean;
  sectionVSpan?: number;
  subsectionVSpan?: number;
}

export interface ITitle {
  columnList: Array<string>;
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
