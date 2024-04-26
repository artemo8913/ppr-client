export interface IWorkingManYearPlan {
  id: string;
  full_name: string;
  work_position: string;
  participation: number;
  plan?: {
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
  };
  fact?: {
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
  };
}

export interface IPprWorkersHours {
  ppr_id: string;
  workers: IWorkingManYearPlan[];
}
