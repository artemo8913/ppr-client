import { findFirstUndonePprPeriod } from "../lib/findFirstUndonePprPeriod";
import { YearPlanBasicData, MonthPlanStatus, AllMonthsPlansStatuses } from "../model/ppr.types";
import { MONTHS } from "@/1shared/lib/date";

const makeMonthsStatuses = (status: MonthPlanStatus): AllMonthsPlansStatuses =>
  Object.fromEntries(MONTHS.map((m) => [m, status])) as AllMonthsPlansStatuses;

const makePpr = (overrides: Partial<YearPlanBasicData>): YearPlanBasicData => ({
  id: 1,
  name: "ППР 2025",
  year: 2025,
  status: "in_process",
  created_by: { id: 1, firstName: "Иван", lastName: "Иванов", middleName: "Иванович", role: "subdivision", idSubdivision: 1, idDistance: 10, idDirection: 1 },
  created_at: new Date("2025-01-01"),
  idDirection: 1,
  idDistance: 10,
  idSubdivision: 100,
  months_statuses: makeMonthsStatuses("none"),
  ...overrides,
});

describe("findFirstUndonePprPeriod", () => {
  describe("когда статус года не 'in_process'", () => {
    const nonInProcessStatuses = [
      "template",
      "plan_creating",
      "plan_on_agreement_engineer",
      "plan_on_agreement_time_norm",
      "plan_on_agreement_sub_boss",
      "plan_on_aprove",
      "done",
    ] as const;

    nonInProcessStatuses.forEach((yearStatus) => {
      it(`возвращает 'year' при статусе года '${yearStatus}'`, () => {
        const ppr = makePpr({ status: yearStatus });
        expect(findFirstUndonePprPeriod(ppr)).toBe("year");
      });
    });
  });

  describe("когда статус года 'in_process'", () => {
    it("возвращает первый месяц со статусом не 'done'", () => {
      const statuses = makeMonthsStatuses("done");
      statuses["jan"] = "done";
      statuses["feb"] = "done";
      statuses["mar"] = "none"; // первый незакрытый
      const ppr = makePpr({ months_statuses: statuses });

      expect(findFirstUndonePprPeriod(ppr)).toBe("mar");
    });

    it("возвращает январь если все месяцы 'none'", () => {
      const ppr = makePpr({ months_statuses: makeMonthsStatuses("none") });
      expect(findFirstUndonePprPeriod(ppr)).toBe("jan");
    });

    it("возвращает 'year' если все месяцы 'done'", () => {
      const ppr = makePpr({ months_statuses: makeMonthsStatuses("done") });
      expect(findFirstUndonePprPeriod(ppr)).toBe("year");
    });

    it("возвращает первый незакрытый месяц, игнорируя уже закрытые", () => {
      const statuses = makeMonthsStatuses("done");
      statuses["sept"] = "in_process"; // первый незакрытый
      statuses["oct"] = "none";
      statuses["nov"] = "none";
      statuses["dec"] = "none";
      const ppr = makePpr({ months_statuses: statuses });

      expect(findFirstUndonePprPeriod(ppr)).toBe("sept");
    });

    it("возвращает декабрь если только он не закрыт", () => {
      const statuses = makeMonthsStatuses("done");
      statuses["dec"] = "fact_filling";
      const ppr = makePpr({ months_statuses: statuses });

      expect(findFirstUndonePprPeriod(ppr)).toBe("dec");
    });
  });
});
