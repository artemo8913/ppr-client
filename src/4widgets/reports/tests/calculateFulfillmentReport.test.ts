// Мокируем server actions чтобы не тянуть next-auth/БД в unit-тесты
jest.mock("@/2entities/ppr/model/ppr.actions", () => ({}));

import { calculateFulfillmentReport } from "../lib/calculateFulfillmentReport";
import { TPprDataForReport } from "@/2entities/ppr";
import { Subdivision, Distance, Direction } from "@/2entities/division/@x/ppr";

// Фабрика минимальной записи работы для отчёта
const makePprData = (overrides: Partial<TPprDataForReport> = {}): TPprDataForReport => ({
  id: 1,
  common_work_id: 100,
  is_work_aproved: false,
  branch: "exploitation",
  subbranch: "Контактная сеть",
  name: "Осмотр контактной сети",
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
  // plan work values
  year_plan_work: { original: 10, handCorrection: null, final: 10, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  jan_plan_work: { original: 0, handCorrection: null, final: 0, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
  feb_plan_work: { original: 2, handCorrection: null, final: 2, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
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
  // plan time values
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
  // fact work values
  year_fact_work: 5,
  jan_fact_work: 0,
  feb_fact_work: 1,
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
  // fact norm time values
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
  // fact time values
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
  ...overrides,
});

const makeDivisions = () => ({
  subdivisionsMap: new Map<number, Subdivision>([
    [100, { id: 100, idDistance: 10, name: "Электромеханический цех 1", shortName: "ЭЧК-1" }],
    [200, { id: 200, idDistance: 10, name: "Электромеханический цех 2", shortName: "ЭЧК-2" }],
  ]),
  distancesMap: new Map<number, Distance>([
    [10, { id: 10, idDirection: 1, name: "Дистанция 1", shortName: "ЭЧ-1" }],
  ]),
  directionsMap: new Map<number, Direction>([
    [1, { id: 1, name: "Дирекция", shortName: "ЭД" }],
  ]),
});

describe("calculateFulfillmentReport", () => {
  describe("структура отчёта для одной записи", () => {
    it("создаёт строки для subdivision, distance, direction и transenergo", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const divisionTypes = report.map((r) => r.divisionType);
      expect(divisionTypes).toContain("subdivision");
      expect(divisionTypes).toContain("distance");
      expect(divisionTypes).toContain("direction");
      expect(divisionTypes).toContain("transenergo");
    });

    it("использует original (не final) из plan_work для агрегации", () => {
      const data = [makePprData({
        year_plan_work: { original: 10, handCorrection: 999, final: 999, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null },
      })];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const subdivisionRow = report.find((r) => r.divisionType === "subdivision");
      expect(subdivisionRow?.year_plan_work).toBe(10);
    });

    it("агрегирует fact_work напрямую (без обёртки с correction)", () => {
      const data = [makePprData({ feb_fact_work: 3 })];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const subdivisionRow = report.find((r) => r.divisionType === "subdivision");
      expect(subdivisionRow?.feb_fact_work).toBe(3);
    });

    it("строка transenergo имеет divisionId 'ТЭ'", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const transRow = report.find((r) => r.divisionType === "transenergo");
      expect(transRow?.divisionId).toBe("ТЭ");
    });

    it("подразделение отображается с shortName из subdivisionsMap", () => {
      const data = [makePprData({ idSubdivision: 100 })];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const subdivRow = report.find((r) => r.divisionType === "subdivision");
      expect(subdivRow?.divisionId).toBe("ЭЧК-1");
    });
  });

  describe("агрегация нескольких записей", () => {
    it("суммирует plan_work.original из двух подразделений для одного common_work_id", () => {
      const data = [
        makePprData({ idSubdivision: 100, year_plan_work: { original: 3, handCorrection: null, final: 3, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null } }),
        makePprData({ idSubdivision: 200, year_plan_work: { original: 7, handCorrection: null, final: 7, outsideCorrectionsSum: 0, planTransfersSum: 0, planTransfers: null, undoneTransfersSum: 0, undoneTransfers: null } }),
      ];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const transRow = report.find((r) => r.divisionType === "transenergo");
      expect(transRow?.year_plan_work).toBe(10);
    });

    it("суммирует fact_work из двух подразделений", () => {
      const data = [
        makePprData({ idSubdivision: 100, year_fact_work: 2 }),
        makePprData({ idSubdivision: 200, year_fact_work: 8 }),
      ];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const transRow = report.find((r) => r.divisionType === "transenergo");
      expect(transRow?.year_fact_work).toBe(10);
    });

    it("два разных common_work_id → два отдельных блока в отчёте", () => {
      const data = [
        makePprData({ id: 1, common_work_id: 100 }),
        makePprData({ id: 2, common_work_id: 200 }),
      ];
      const { report } = calculateFulfillmentReport(data, makeDivisions());

      const commonWorkIds = report.map((r) => r.common_work_id);
      expect(commonWorkIds.filter((id) => id === 100).length).toBeGreaterThan(0);
      expect(commonWorkIds.filter((id) => id === 200).length).toBeGreaterThan(0);
    });
  });

  describe("filterLevel", () => {
    it("filterLevel='subdivision' — только строки subdivision", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions(), "subdivision");
      expect(report.every((r) => r.divisionType === "subdivision")).toBe(true);
    });

    it("filterLevel='distance' — subdivision и distance", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions(), "distance");
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("subdivision")).toBe(true);
      expect(types.has("distance")).toBe(true);
      expect(types.has("direction")).toBe(false);
      expect(types.has("transenergo")).toBe(false);
    });

    it("filterLevel='direction' — distance и direction", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions(), "direction");
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("distance")).toBe(true);
      expect(types.has("direction")).toBe(true);
      expect(types.has("subdivision")).toBe(false);
    });

    it("filterLevel='transenergo' — direction и transenergo", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions(), "transenergo");
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("direction")).toBe(true);
      expect(types.has("transenergo")).toBe(true);
      expect(types.has("subdivision")).toBe(false);
    });

    it("без filterLevel — все 4 типа присутствуют", () => {
      const data = [makePprData()];
      const { report } = calculateFulfillmentReport(data, makeDivisions());
      const types = new Set(report.map((r) => r.divisionType));
      expect(types.has("subdivision")).toBe(true);
      expect(types.has("distance")).toBe(true);
      expect(types.has("direction")).toBe(true);
      expect(types.has("transenergo")).toBe(true);
    });
  });

  describe("reportSettings (rowSpan)", () => {
    it("rowSpan вычисляется для блока строк одного common_work_id", () => {
      const data = [makePprData()];
      const { report, reportSettings } = calculateFulfillmentReport(data, makeDivisions());
      // NOTE: в текущей реализации rowSpan = report.length + 1 из-за инициализации tempRowSpan=1
      // плюс инкремент при обходе первого элемента — потенциальный баг
      expect(reportSettings[0].rowSpan).toBe(report.length + 1);
    });

    it("для двух common_work_id создаются два отдельных блока в reportSettings", () => {
      const data = [
        makePprData({ id: 1, common_work_id: 100 }),
        makePprData({ id: 2, common_work_id: 200 }),
      ];
      const { reportSettings } = calculateFulfillmentReport(data, makeDivisions());

      // Два блока — ключи 0 и 4 (после 4 строк первого блока)
      expect(Object.keys(reportSettings).length).toBe(2);
    });
  });
});
