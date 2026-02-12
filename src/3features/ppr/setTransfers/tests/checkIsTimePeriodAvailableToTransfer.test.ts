// Мокируем server actions чтобы не тянуть next-auth/БД в unit-тесты
jest.mock("@/2entities/ppr/model/ppr.actions", () => ({}));

import { checkIsTimePeriodAvailableToTransfer } from "../lib/checkIsTimePeriodAvailableToTransfer";
import { Month } from "@/1shared/lib/date";
import { MonthPlanStatus } from "@/2entities/ppr/model/ppr.types";

type MonthsStatuses = { [month in Month]: MonthPlanStatus };

const makeStatuses = (status: MonthPlanStatus): MonthsStatuses =>
  ({
    jan: status,
    feb: status,
    mar: status,
    apr: status,
    may: status,
    june: status,
    july: status,
    aug: status,
    sept: status,
    oct: status,
    nov: status,
    dec: status,
  } as MonthsStatuses);

describe("checkIsTimePeriodAvailableToTransfer", () => {
  describe("timePeriod === 'year'", () => {
    it("всегда возвращает false для year, если статус none", () => {
      expect(checkIsTimePeriodAvailableToTransfer("year", makeStatuses("none"))).toBe(false);
    });

    it("всегда возвращает false для year, независимо от статусов", () => {
      expect(checkIsTimePeriodAvailableToTransfer("year", makeStatuses("done"))).toBe(false);
    });
  });

  describe("timePeriod — конкретный месяц", () => {
    it("true если статус месяца 'none'", () => {
      const statuses = makeStatuses("done");
      statuses["jan"] = "none";
      expect(checkIsTimePeriodAvailableToTransfer("jan", statuses)).toBe(true);
    });

    it("false если статус месяца 'plan_creating'", () => {
      const statuses = makeStatuses("none");
      statuses["feb"] = "plan_creating";
      expect(checkIsTimePeriodAvailableToTransfer("feb", statuses)).toBe(false);
    });

    it("false если статус месяца 'in_process'", () => {
      const statuses = makeStatuses("none");
      statuses["mar"] = "in_process";
      expect(checkIsTimePeriodAvailableToTransfer("mar", statuses)).toBe(false);
    });

    it("false если статус месяца 'done'", () => {
      const statuses = makeStatuses("none");
      statuses["apr"] = "done";
      expect(checkIsTimePeriodAvailableToTransfer("apr", statuses)).toBe(false);
    });

    it("false если статус месяца 'fact_filling'", () => {
      const statuses = makeStatuses("none");
      statuses["may"] = "fact_filling";
      expect(checkIsTimePeriodAvailableToTransfer("may", statuses)).toBe(false);
    });

    it("проверяет именно переданный месяц, а не все", () => {
      const statuses = makeStatuses("done");
      statuses["june"] = "none";
      // june доступен
      expect(checkIsTimePeriodAvailableToTransfer("june", statuses)).toBe(true);
      // july не доступен (done)
      expect(checkIsTimePeriodAvailableToTransfer("july", statuses)).toBe(false);
    });
  });
});
