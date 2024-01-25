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

export interface IData {
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
