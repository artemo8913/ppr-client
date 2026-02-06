import { WorkingMenService } from "../lib/services/WorkingMenService";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";
import { PlannedWorkingMans } from "../model/ppr.types";

describe("WorkingMenService", () => {
  const createTestWorkingMan = (
    overrides: Partial<PlannedWorkingMans> = {}
  ): PlannedWorkingMans => {
    return {
      ...createNewWorkingManInstance(),
      ...overrides,
    };
  };

  describe("addWorkingMan", () => {
    it("добавляет работника в конец пустого массива", () => {
      const result = WorkingMenService.addWorkingMan([]);

      expect(result).toHaveLength(1);
      expect(result[0].full_name).toBe("Иванов И.И.");
    });

    it("добавляет работника в конец массива если nearWorkingManId не указан", () => {
      const existingMan = createTestWorkingMan({ full_name: "Existing" });
      const data = [existingMan];

      const result = WorkingMenService.addWorkingMan(data);

      expect(result).toHaveLength(2);
      expect(result[0].full_name).toBe("Existing");
      expect(result[1].full_name).toBe("Иванов И.И.");
    });

    it("добавляет работника после указанного nearWorkingManId", () => {
      const man1 = createTestWorkingMan({ full_name: "Man 1" });
      const man2 = createTestWorkingMan({ full_name: "Man 2" });
      const data = [man1, man2];

      const result = WorkingMenService.addWorkingMan(data, man1.id);

      expect(result).toHaveLength(3);
      expect(result[0].full_name).toBe("Man 1");
      expect(result[1].full_name).toBe("Иванов И.И.");
      expect(result[2].full_name).toBe("Man 2");
    });

    it("добавляет работника в конец если nearWorkingManId не найден", () => {
      const man = createTestWorkingMan({ full_name: "Man" });
      const data = [man];

      const result = WorkingMenService.addWorkingMan(data, "non-existent-id");

      expect(result).toHaveLength(2);
      expect(result[1].full_name).toBe("Иванов И.И.");
    });
  });

  describe("deleteWorkingMan", () => {
    it("удаляет работника по id", () => {
      const man1 = createTestWorkingMan({ full_name: "Man 1" });
      const man2 = createTestWorkingMan({ full_name: "Man 2" });
      const data = [man1, man2];

      const result = WorkingMenService.deleteWorkingMan(data, man1.id);

      expect(result).toHaveLength(1);
      expect(result[0].full_name).toBe("Man 2");
    });

    it("возвращает тот же массив если id не найден", () => {
      const man = createTestWorkingMan({ full_name: "Man" });
      const data = [man];

      const result = WorkingMenService.deleteWorkingMan(data, "non-existent");

      expect(result).toHaveLength(1);
    });

    it("возвращает пустой массив при удалении последнего работника", () => {
      const man = createTestWorkingMan();
      const data = [man];

      const result = WorkingMenService.deleteWorkingMan(data, man.id);

      expect(result).toHaveLength(0);
    });
  });

  describe("updateWorkingMan", () => {
    it("обновляет данные работника по индексу", () => {
      const man = createTestWorkingMan({ full_name: "Old Name" });
      const data = [man];

      const result = WorkingMenService.updateWorkingMan(data, 0, "full_name", "New Name");

      expect(result[0].full_name).toBe("New Name");
    });

    it("обновляет work_position", () => {
      const man = createTestWorkingMan({ work_position: "мкс" });
      const data = [man];

      const result = WorkingMenService.updateWorkingMan(data, 0, "work_position", "эмк");

      expect(result[0].work_position).toBe("эмк");
    });

    it("не изменяет других работников", () => {
      const man1 = createTestWorkingMan({ full_name: "Man 1" });
      const man2 = createTestWorkingMan({ full_name: "Man 2" });
      const data = [man1, man2];

      const result = WorkingMenService.updateWorkingMan(data, 0, "full_name", "Updated");

      expect(result[0].full_name).toBe("Updated");
      expect(result[1].full_name).toBe("Man 2");
    });
  });

  describe("updateWorkingManPlanNormTime", () => {
    it("обновляет план нормативного времени", () => {
      const man = createTestWorkingMan();
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanNormTime(
        data,
        0,
        "jan_plan_norm_time",
        100
      );

      expect(result[0].jan_plan_norm_time).toBe(100);
    });

    it("пересчитывает годовой итог", () => {
      const man = createTestWorkingMan({ feb_plan_norm_time: 50 });
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanNormTime(
        data,
        0,
        "jan_plan_norm_time",
        100
      );

      expect(result[0].year_plan_norm_time).toBe(150);
    });

    it("не включает year_plan_norm_time в расчёт суммы", () => {
      const man = createTestWorkingMan({
        jan_plan_norm_time: 10,
        feb_plan_norm_time: 20,
        year_plan_norm_time: 999,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanNormTime(
        data,
        0,
        "mar_plan_norm_time",
        30
      );

      expect(result[0].year_plan_norm_time).toBe(60);
    });
  });

  describe("updateWorkingManPlanTabelTime", () => {
    it("обновляет план табельного времени", () => {
      const man = createTestWorkingMan({ participation: 1 });
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanTabelTime(
        data,
        0,
        "jan_plan_tabel_time",
        100
      );

      expect(result[0].jan_plan_tabel_time).toBe(100);
    });

    it("пересчитывает годовой итог", () => {
      const man = createTestWorkingMan({
        participation: 1,
        feb_plan_tabel_time: 50,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanTabelTime(
        data,
        0,
        "jan_plan_tabel_time",
        100
      );

      expect(result[0].year_plan_tabel_time).toBe(150);
    });

    it("пересчитывает plan_time с учётом participation", () => {
      const man = createTestWorkingMan({ participation: 0.5 });
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanTabelTime(
        data,
        0,
        "jan_plan_tabel_time",
        100
      );

      expect(result[0].jan_plan_time).toBe(50);
    });

    it("пересчитывает year_plan_time с учётом participation", () => {
      const man = createTestWorkingMan({
        participation: 0.5,
        feb_plan_tabel_time: 100,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManPlanTabelTime(
        data,
        0,
        "jan_plan_tabel_time",
        100
      );

      expect(result[0].year_plan_time).toBe(100);
      expect(result[0].year_plan_tabel_time).toBe(200);
    });
  });

  describe("updateWorkingManFactTime", () => {
    it("обновляет фактическое время", () => {
      const man = createTestWorkingMan();
      const data = [man];

      const result = WorkingMenService.updateWorkingManFactTime(data, 0, "jan_fact_time", 100);

      expect(result[0].jan_fact_time).toBe(100);
    });

    it("пересчитывает годовой итог", () => {
      const man = createTestWorkingMan({ feb_fact_time: 50 });
      const data = [man];

      const result = WorkingMenService.updateWorkingManFactTime(data, 0, "jan_fact_time", 100);

      expect(result[0].year_fact_time).toBe(150);
    });

    it("не включает year_fact_time в расчёт суммы", () => {
      const man = createTestWorkingMan({
        jan_fact_time: 10,
        feb_fact_time: 20,
        year_fact_time: 999,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManFactTime(data, 0, "mar_fact_time", 30);

      expect(result[0].year_fact_time).toBe(60);
    });
  });

  describe("updateWorkingManParticipation", () => {
    it("обновляет коэффициент участия", () => {
      const man = createTestWorkingMan({ participation: 1 });
      const data = [man];

      const result = WorkingMenService.updateWorkingManParticipation(data, 0, 0.75);

      expect(result[0].participation).toBe(0.75);
    });

    it("пересчитывает plan_time для всех месяцев", () => {
      const man = createTestWorkingMan({
        participation: 1,
        jan_plan_tabel_time: 100,
        feb_plan_tabel_time: 200,
        jan_plan_time: 100,
        feb_plan_time: 200,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManParticipation(data, 0, 0.5);

      expect(result[0].jan_plan_time).toBe(50);
      expect(result[0].feb_plan_time).toBe(100);
    });

    it("пересчитывает year_plan_time", () => {
      const man = createTestWorkingMan({
        participation: 1,
        year_plan_tabel_time: 1200,
        year_plan_time: 1200,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManParticipation(data, 0, 0.5);

      expect(result[0].year_plan_time).toBe(600);
    });

    it("корректно округляет значения", () => {
      const man = createTestWorkingMan({
        participation: 1,
        jan_plan_tabel_time: 100,
      });
      const data = [man];

      const result = WorkingMenService.updateWorkingManParticipation(data, 0, 0.333);

      expect(result[0].jan_plan_time).toBe(33.3);
    });
  });
});
