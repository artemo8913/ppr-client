import { IPprData } from "../model/ppr.types";

type IPprDataWithoutId = Omit<IPprData, "id">;

export const createNewPprWorkInstance = (newData: Partial<IPprDataWithoutId>): IPprData => {
  return {
    common_work_id: null,
    branch: "additional",
    subbranch: "",
    name: "",
    location: "",
    line_class: "",
    measure: "",
    total_count: "",
    entry_year: "",
    periodicity_normal: "",
    periodicity_fact: "",
    last_maintenance_year: "",
    norm_of_time: 0,
    norm_of_time_document: "",
    unity: "",
    note: "",
    year_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    jan_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    feb_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    mar_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    apr_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    may_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    june_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    july_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    aug_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    sept_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    oct_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    nov_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    dec_plan_work: {
      original: 0,
      handCorrection: null,
      planTransfers: null,
      planTransfersSum: 0,
      undoneTransfers: null,
      undoneTransfersSum: 0,
      outsideCorrectionsSum: 0,
      final: 0,
    },
    year_plan_time: { final: 0, original: 0 },
    jan_plan_time: { final: 0, original: 0 },
    feb_plan_time: { final: 0, original: 0 },
    mar_plan_time: { final: 0, original: 0 },
    apr_plan_time: { final: 0, original: 0 },
    may_plan_time: { final: 0, original: 0 },
    june_plan_time: { final: 0, original: 0 },
    july_plan_time: { final: 0, original: 0 },
    aug_plan_time: { final: 0, original: 0 },
    sept_plan_time: { final: 0, original: 0 },
    oct_plan_time: { final: 0, original: 0 },
    nov_plan_time: { final: 0, original: 0 },
    dec_plan_time: { final: 0, original: 0 },
    year_fact_work: 0,
    jan_fact_work: 0,
    feb_fact_work: 0,
    mar_fact_work: 0,
    apr_fact_work: 0,
    may_fact_work: 0,
    june_fact_work: 0,
    july_fact_work: 0,
    aug_fact_work: 0,
    sept_fact_work: 0,
    oct_fact_work: 0,
    nov_fact_work: 0,
    dec_fact_work: 0,
    year_fact_norm_time: 0,
    jan_fact_norm_time: 0,
    feb_fact_norm_time: 0,
    mar_fact_norm_time: 0,
    apr_fact_norm_time: 0,
    may_fact_norm_time: 0,
    june_fact_norm_time: 0,
    july_fact_norm_time: 0,
    aug_fact_norm_time: 0,
    sept_fact_norm_time: 0,
    oct_fact_norm_time: 0,
    nov_fact_norm_time: 0,
    dec_fact_norm_time: 0,
    year_fact_time: 0,
    jan_fact_time: 0,
    feb_fact_time: 0,
    mar_fact_time: 0,
    apr_fact_time: 0,
    may_fact_time: 0,
    june_fact_time: 0,
    july_fact_time: 0,
    aug_fact_time: 0,
    sept_fact_time: 0,
    oct_fact_time: 0,
    nov_fact_time: 0,
    dec_fact_time: 0,
    ...newData,
    id: String(new Date().toString() + Math.random()),
    is_work_aproved: false,
  };
};
