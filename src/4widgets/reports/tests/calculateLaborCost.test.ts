// Мокируем server actions чтобы не тянуть next-auth/БД в unit-тесты
jest.mock("@/2entities/ppr/model/ppr.actions", () => ({}));

import { calculateLaborCost } from "../lib/calculateLaborCost";
import { TPprDataForReport } from "@/2entities/ppr";

const makePprData = (overrides: Partial<TPprDataForReport> = {}): TPprDataForReport => ({
  id: 1,
  common_work_id: 100,
  is_work_aproved: false,
  branch: "exploitation",
  subbranch: "Контактная сеть",
  name: "Осмотр",
  location: "",
  line_class: "",
  measure: "км",
  total_count: "",
  entry_year: "",
  periodicity_normal: "",
  periodicity_fact: "",
  last_maintenance_year: "",
  norm_of_time: 2,
  norm_of_time_document: "",
  unity: "",
  note: "",
  idDirection: 1,
  idDistance: 10,
  idSubdivision: 100,
  directionShortName: "ЭД",
  distanceShortName: "ЭЧ-1",
  subdivisionShortName: "ЭЧК-1",
  year_plan_work: { original: 10, handCorrection: null, final: 10, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  jan_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  feb_plan_work: { original: 5, handCorrection: null, final: 5, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  mar_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  apr_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  may_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  june_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  july_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  aug_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  sept_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  oct_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  nov_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  dec_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  year_plan_time: { original: 0, final: 0 },
  jan_plan_time: { original: 0, final: 0 },
  feb_plan_time: { original: 0, final: 0 },
  mar_plan_time: { original: 0, final: 0 },
  apr_plan_time: { original: 0, final: 0 },
  may_plan_time: { original: 0, final: 0 },
  june_plan_time: { original: 0, final: 0 },
  july_plan_time: { original: 0, final: 0 },
  aug_plan_time: { original: 0, final: 0 },
  sept_plan_time: { original: 0, final: 0 },
  oct_plan_time: { original: 0, final: 0 },
  nov_plan_time: { original: 0, final: 0 },
  dec_plan_time: { original: 0, final: 0 },
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
  jan_fact_time: 3,
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
  ...overrides,
});

describe("calculateLaborCost", () => {
  describe("расчёт plan_time", () => {
    it("plan_time = original × norm_of_time когда handCorrection=null", () => {
      // feb_plan_work.original=5, norm_of_time=2 → feb_plan_time = 10
      const data = [makePprData({ norm_of_time: 2 })];
      const { report } = calculateLaborCost(data);

      const subdivRow = report.find(
        (r) => r.divisionType === "subdivision" && r.divisionId === 100
      );
      expect(subdivRow?.divisionData.feb_plan_time).toBe(10);
    });

    it("план использует handCorrection вместо original+outsideCorrections когда handCorrection задан", () => {
      // handCorrection=3, norm_of_time=2 → feb_plan_time = 3 × 2 = 6
      const data = [makePprData({
        norm_of_time: 2,
        feb_plan_work: { original: 5, handCorrection: 3, final: 3, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
      })];
      const { report } = calculateLaborCost(data);

      const subdivRow = report.find(
        (r) => r.divisionType === "subdivision" && r.divisionId === 100
      );
      expect(subdivRow?.divisionData.feb_plan_time).toBe(6);
    });

    it("fact_time берётся напрямую из записи", () => {
      // jan_fact_time = 3
      const data = [makePprData()];
      const { report } = calculateLaborCost(data);

      const subdivRow = report.find(
        (r) => r.divisionType === "subdivision" && r.divisionId === 100
      );
      expect(subdivRow?.divisionData.jan_fact_time).toBe(3);
    });
  });

  describe("группировка по разделу (branch) и подразделу (subbranch)", () => {
    it("одна запись → одна строка по подразделу + итого по разделу (для каждого типа подразделения)", () => {
      const data = [makePprData()];
      const { report } = calculateLaborCost(data);

      // Должны быть строки для subbranch И итого по branch
      const subbranchRows = report.filter((r) => r.name === "Контактная сеть");
      const totalRows = report.filter((r) => r.name.startsWith("Итого по разделу"));

      expect(subbranchRows.length).toBeGreaterThan(0);
      expect(totalRows.length).toBeGreaterThan(0);
    });

    it("две работы разных подразделов одного раздела — два подраздела в отчёте", () => {
      const data = [
        makePprData({ subbranch: "Контактная сеть" }),
        makePprData({ subbranch: "Другой подраздел" }),
      ];
      const { report } = calculateLaborCost(data);

      const subbranchNames = report.map((r) => r.name);
      expect(subbranchNames).toContain("Контактная сеть");
      expect(subbranchNames).toContain("Другой подраздел");
    });

    it("данные одного подраздела агрегируются по всем типам подразделений", () => {
      const data = [makePprData()];
      const { report } = calculateLaborCost(data);

      const subbranchRows = report.filter((r) => r.name === "Контактная сеть");
      const divisionTypes = new Set(subbranchRows.map((r) => r.divisionType));

      expect(divisionTypes.has("subdivision")).toBe(true);
      expect(divisionTypes.has("distance")).toBe(true);
      expect(divisionTypes.has("direction")).toBe(true);
      expect(divisionTypes.has("transenergo")).toBe(true);
    });
  });

  describe("суммирование двух записей одного подраздела", () => {
    it("plan_time суммируется для двух подразделений в distance-итоге", () => {
      const data = [
        makePprData({ idSubdivision: 100, norm_of_time: 2, feb_plan_work: { original: 5, handCorrection: null, final: 5, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null } }),
        makePprData({ idSubdivision: 200, norm_of_time: 2, feb_plan_work: { original: 3, handCorrection: null, final: 3, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null } }),
      ];
      const { report } = calculateLaborCost(data);

      // distance: feb_plan_time = (5+3) × 2 = 16
      const distanceSubbranchRow = report.find(
        (r) => r.divisionType === "distance" && r.name === "Контактная сеть"
      );
      expect(distanceSubbranchRow?.divisionData.feb_plan_time).toBe(16);
    });
  });

  describe("filterLevel", () => {
    it("filterLevel='subdivision' — только строки subdivision", () => {
      const data = [makePprData()];
      const { report } = calculateLaborCost(data, "subdivision");
      expect(report.every((r) => r.divisionType === "subdivision")).toBe(true);
    });

    it("filterLevel='distance' — subdivision и distance", () => {
      const data = [makePprData()];
      const { report } = calculateLaborCost(data, "distance");
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("subdivision")).toBe(true);
      expect(types.has("distance")).toBe(true);
      expect(types.has("direction")).toBe(false);
    });

    it("filterLevel='transenergo' — direction и transenergo", () => {
      const data = [makePprData()];
      const { report } = calculateLaborCost(data, "transenergo");
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("direction")).toBe(true);
      expect(types.has("transenergo")).toBe(true);
      expect(types.has("subdivision")).toBe(false);
    });

    it("без filterLevel — все 4 типа присутствуют", () => {
      const data = [makePprData()];
      const { report } = calculateLaborCost(data);
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("subdivision")).toBe(true);
      expect(types.has("distance")).toBe(true);
      expect(types.has("direction")).toBe(true);
      expect(types.has("transenergo")).toBe(true);
    });
  });
});
