export interface IWorkAndTimeData {
  plan_work: number;
  plan_time: number;
  fact_work: number;
  fact_norm_time: number;
  fact_time: number;
}
export interface IPprData {
  id: string;
  index: string;
  branch: string;
  subbranch: string;
  section: string;
  subsection_first: string;
  subsection_second: string;
  location: string;
  line_class: number;
  measure: string;
  total_count: number;
  entry_year: number;
  periodicity_normal: number;
  periodicity_fact: number;
  last_maintenance_year: number;
  norm_of_time: number;
  norm_of_time_document: string;
  unity: string;
  year: IWorkAndTimeData;
  jan: IWorkAndTimeData;
  feb: IWorkAndTimeData;
  mar: IWorkAndTimeData;
  apr: IWorkAndTimeData;
  may: IWorkAndTimeData;
  june: IWorkAndTimeData;
  july: IWorkAndTimeData;
  aug: IWorkAndTimeData;
  sept: IWorkAndTimeData;
  oct: IWorkAndTimeData;
  nov: IWorkAndTimeData;
  dec: IWorkAndTimeData;
}
