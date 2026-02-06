import { WorksService } from "../lib/services/WorksService";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { PlannedWorkWithCorrections } from "../model/ppr.types";

describe("WorksService", () => {
  const createTestWork = (
    overrides: Partial<PlannedWorkWithCorrections> = {}
  ): PlannedWorkWithCorrections => {
    return createNewPprWorkInstance({
      name: "Test Work",
      branch: "exploitation",
      subbranch: "test-subbranch",
      norm_of_time: 1,
      ...overrides,
    });
  };

  describe("addWork", () => {
    it("добавляет работу в конец пустого массива", () => {
      const result = WorksService.addWork([], { name: "New Work" });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("New Work");
    });

    it("добавляет работу в конец массива если nearWorkId не указан", () => {
      const existingWork = createTestWork({ name: "Existing" });
      const data = [existingWork];

      const result = WorksService.addWork(data, { name: "New Work" });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Existing");
      expect(result[1].name).toBe("New Work");
    });

    it("добавляет работу после указанной nearWorkId", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const work2 = createTestWork({ name: "Work 2" });
      const data = [work1, work2];

      const result = WorksService.addWork(data, { name: "New Work" }, work1.id);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Work 1");
      expect(result[1].name).toBe("New Work");
      expect(result[2].name).toBe("Work 2");
    });

    it("добавляет работу в конец если nearWorkId не найден", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const data = [work1];

      const result = WorksService.addWork(data, { name: "New Work" }, "non-existent-id");

      expect(result).toHaveLength(2);
      expect(result[1].name).toBe("New Work");
    });
  });

  describe("copyWork", () => {
    it("копирует работу и вставляет после оригинала", () => {
      const work = createTestWork({
        name: "Original",
        branch: "exploitation",
        subbranch: "sub1",
        norm_of_time: 2.5,
        unity: "шт",
      });
      const data = [work];

      const result = WorksService.copyWork(data, work.id);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Original");
      expect(result[1].name).toBe("Original");
      expect(result[1].branch).toBe("exploitation");
      expect(result[1].subbranch).toBe("sub1");
      expect(result[1].norm_of_time).toBe(2.5);
      expect(result[1].unity).toBe("шт");
      expect(result[0].id).not.toBe(result[1].id);
    });

    it("не копирует если id не найден", () => {
      const work = createTestWork({ name: "Work" });
      const data = [work];

      const result = WorksService.copyWork(data, "non-existent");

      expect(result).toHaveLength(2);
    });
  });

  describe("deleteWork", () => {
    it("удаляет работу по id", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const work2 = createTestWork({ name: "Work 2" });
      const data = [work1, work2];

      const result = WorksService.deleteWork(data, work1.id);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Work 2");
    });

    it("возвращает тот же массив если id не найден", () => {
      const work = createTestWork({ name: "Work" });
      const data = [work];

      const result = WorksService.deleteWork(data, "non-existent");

      expect(result).toHaveLength(1);
    });

    it("возвращает пустой массив при удалении последней работы", () => {
      const work = createTestWork();
      const data = [work];

      const result = WorksService.deleteWork(data, work.id);

      expect(result).toHaveLength(0);
    });
  });

  describe("editWork", () => {
    it("обновляет базовые данные работы", () => {
      const work = createTestWork({ name: "Old Name", location: "Old Location" });
      const data = [work];

      const result = WorksService.editWork(data, {
        id: work.id,
        name: "New Name",
        location: "New Location",
      });

      expect(result[0].name).toBe("New Name");
      expect(result[0].location).toBe("New Location");
    });

    it("пересчитывает plan_time при изменении norm_of_time", () => {
      const work = createTestWork({ norm_of_time: 1 });
      work.jan_plan_work = { ...work.jan_plan_work, original: 10, final: 10 };
      work.jan_plan_time = { original: 10, final: 10 };
      const data = [work];

      const result = WorksService.editWork(data, {
        id: work.id,
        norm_of_time: 2,
      });

      expect(result[0].jan_plan_time.original).toBe(20);
      expect(result[0].jan_plan_time.final).toBe(20);
    });

    it("не изменяет работу если id не совпадает", () => {
      const work = createTestWork({ name: "Work" });
      const data = [work];

      const result = WorksService.editWork(data, {
        id: "different-id",
        name: "New Name",
      });

      expect(result[0].name).toBe("Work");
    });
  });

  describe("updateNormOfTime", () => {
    it("обновляет норму времени", () => {
      const work = createTestWork({ norm_of_time: 1 });
      const data = [work];

      const result = WorksService.updateNormOfTime(data, work.id, 2.5);

      expect(result[0].norm_of_time).toBe(2.5);
    });

    it("пересчитывает plan_time для всех месяцев", () => {
      const work = createTestWork({ norm_of_time: 1 });
      work.jan_plan_work = { ...work.jan_plan_work, original: 10, final: 10 };
      work.feb_plan_work = { ...work.feb_plan_work, original: 5, final: 5 };
      const data = [work];

      const result = WorksService.updateNormOfTime(data, work.id, 2);

      expect(result[0].jan_plan_time.original).toBe(20);
      expect(result[0].feb_plan_time.original).toBe(10);
    });

    it("пересчитывает fact_norm_time для всех месяцев", () => {
      const work = createTestWork({ norm_of_time: 1 });
      work.jan_fact_work = 10;
      const data = [work];

      const result = WorksService.updateNormOfTime(data, work.id, 2);

      expect(result[0].jan_fact_norm_time).toBe(20);
    });
  });

  describe("updatePlanWork", () => {
    it("обновляет плановый объём работ", () => {
      const work = createTestWork({ norm_of_time: 1 });
      const data = [work];

      const result = WorksService.updatePlanWork(data, work.id, "jan_plan_work", 10);

      expect(result[0].jan_plan_work.original).toBe(10);
      expect(result[0].jan_plan_work.final).toBe(10);
    });

    it("пересчитывает годовой итог", () => {
      const work = createTestWork({ norm_of_time: 1 });
      work.feb_plan_work = { ...work.feb_plan_work, original: 5, final: 5 };
      const data = [work];

      const result = WorksService.updatePlanWork(data, work.id, "jan_plan_work", 10);

      expect(result[0].year_plan_work.original).toBe(15);
      expect(result[0].year_plan_work.final).toBe(15);
    });

    it("пересчитывает plan_time", () => {
      const work = createTestWork({ norm_of_time: 2 });
      const data = [work];

      const result = WorksService.updatePlanWork(data, work.id, "jan_plan_work", 10);

      expect(result[0].jan_plan_time.original).toBe(20);
      expect(result[0].jan_plan_time.final).toBe(20);
    });
  });

  describe("updateFactWork", () => {
    it("обновляет фактический объём работ", () => {
      const work = createTestWork({ norm_of_time: 1 });
      const data = [work];

      const result = WorksService.updateFactWork(data, work.id, "jan_fact_work", 10);

      expect(result[0].jan_fact_work).toBe(10);
    });

    it("пересчитывает годовой итог", () => {
      const work = createTestWork();
      work.feb_fact_work = 5;
      const data = [work];

      const result = WorksService.updateFactWork(data, work.id, "jan_fact_work", 10);

      expect(result[0].year_fact_work).toBe(15);
    });

    it("пересчитывает fact_norm_time", () => {
      const work = createTestWork({ norm_of_time: 2 });
      const data = [work];

      const result = WorksService.updateFactWork(data, work.id, "jan_fact_work", 10);

      expect(result[0].jan_fact_norm_time).toBe(20);
      expect(result[0].year_fact_norm_time).toBe(20);
    });
  });

  describe("updateFactWorkTime", () => {
    it("обновляет фактическое время", () => {
      const work = createTestWork();
      const data = [work];

      const result = WorksService.updateFactWorkTime(data, work.id, "jan_fact_time", 10);

      expect(result[0].jan_fact_time).toBe(10);
    });

    it("пересчитывает годовой итог", () => {
      const work = createTestWork();
      work.feb_fact_time = 5;
      const data = [work];

      const result = WorksService.updateFactWorkTime(data, work.id, "jan_fact_time", 10);

      expect(result[0].year_fact_time).toBe(15);
    });
  });

  describe("updatePlanWorkValueByUser", () => {
    it("сохраняет handCorrection", () => {
      const work = createTestWork();
      work.jan_plan_work = { ...work.jan_plan_work, original: 10, final: 10 };
      const data = [work];

      const result = WorksService.updatePlanWorkValueByUser(data, work.id, "jan_plan_work", 15);

      expect(result[0].jan_plan_work.handCorrection).toBe(15);
      expect(result[0].jan_plan_work.final).toBe(15);
      expect(result[0].jan_plan_work.original).toBe(10);
    });

    it("пересчитывает годовой final", () => {
      const work = createTestWork();
      work.jan_plan_work = { ...work.jan_plan_work, original: 10, final: 10 };
      work.feb_plan_work = { ...work.feb_plan_work, original: 5, final: 5 };
      const data = [work];

      const result = WorksService.updatePlanWorkValueByUser(data, work.id, "jan_plan_work", 15);

      expect(result[0].year_plan_work.final).toBe(20);
    });
  });

  describe("setOneUnityInAllWorks", () => {
    it("устанавливает unity во всех работах", () => {
      const work1 = createTestWork({ unity: "old1" });
      const work2 = createTestWork({ unity: "old2" });
      const data = [work1, work2];

      const result = WorksService.setOneUnityInAllWorks(data, "new-unity");

      expect(result[0].unity).toBe("new-unity");
      expect(result[1].unity).toBe("new-unity");
    });
  });

  describe("increaseWorkPosition", () => {
    it("перемещает работу вниз", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const work2 = createTestWork({ name: "Work 2" });
      const work3 = createTestWork({ name: "Work 3" });
      const data = [work1, work2, work3];

      const result = WorksService.increaseWorkPosition(data, work1.id);

      expect(result[0].name).toBe("Work 2");
      expect(result[1].name).toBe("Work 1");
      expect(result[2].name).toBe("Work 3");
    });

    it("не перемещает последнюю работу", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const work2 = createTestWork({ name: "Work 2" });
      const data = [work1, work2];

      const result = WorksService.increaseWorkPosition(data, work2.id);

      expect(result[0].name).toBe("Work 1");
      expect(result[1].name).toBe("Work 2");
    });

    it("возвращает тот же массив если id не найден", () => {
      const work = createTestWork({ name: "Work" });
      const data = [work];

      const result = WorksService.increaseWorkPosition(data, "non-existent");

      expect(result).toBe(data);
    });
  });

  describe("decreaseWorkPosition", () => {
    it("перемещает работу вверх", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const work2 = createTestWork({ name: "Work 2" });
      const work3 = createTestWork({ name: "Work 3" });
      const data = [work1, work2, work3];

      const result = WorksService.decreaseWorkPosition(data, work2.id);

      expect(result[0].name).toBe("Work 2");
      expect(result[1].name).toBe("Work 1");
      expect(result[2].name).toBe("Work 3");
    });

    it("не перемещает первую работу", () => {
      const work1 = createTestWork({ name: "Work 1" });
      const work2 = createTestWork({ name: "Work 2" });
      const data = [work1, work2];

      const result = WorksService.decreaseWorkPosition(data, work1.id);

      expect(result[0].name).toBe("Work 1");
      expect(result[1].name).toBe("Work 2");
    });
  });

  describe("updateSubbranch", () => {
    it("обновляет subbranch для указанных работ", () => {
      const work1 = createTestWork({ subbranch: "old" });
      const work2 = createTestWork({ subbranch: "old" });
      const work3 = createTestWork({ subbranch: "old" });
      const data = [work1, work2, work3];

      const workIdsSet = new Set([work1.id, work3.id]);
      const result = WorksService.updateSubbranch(data, "new-subbranch", workIdsSet);

      expect(result[0].subbranch).toBe("new-subbranch");
      expect(result[1].subbranch).toBe("old");
      expect(result[2].subbranch).toBe("new-subbranch");
    });
  });

  describe("copyFactNormTimeToFactTime", () => {
    it("копирует fact_norm_time в fact_time для всех работ (mode EVERY)", () => {
      const work1 = createTestWork();
      work1.jan_fact_norm_time = 10;
      work1.jan_fact_time = 5;
      const work2 = createTestWork();
      work2.jan_fact_norm_time = 20;
      work2.jan_fact_time = 0;
      const data = [work1, work2];

      const result = WorksService.copyFactNormTimeToFactTime(data, "EVERY", "jan");

      expect(result[0].jan_fact_time).toBe(10);
      expect(result[1].jan_fact_time).toBe(20);
    });

    it("копирует только в пустые поля (mode NOT_FILLED)", () => {
      const work1 = createTestWork();
      work1.jan_fact_norm_time = 10;
      work1.jan_fact_time = 5;
      const work2 = createTestWork();
      work2.jan_fact_norm_time = 20;
      work2.jan_fact_time = 0;
      const data = [work1, work2];

      const result = WorksService.copyFactNormTimeToFactTime(data, "NOT_FILLED", "jan");

      expect(result[0].jan_fact_time).toBe(5);
      expect(result[1].jan_fact_time).toBe(20);
    });

    it("пересчитывает годовой итог fact_time", () => {
      const work = createTestWork();
      work.jan_fact_norm_time = 10;
      work.feb_fact_time = 5;
      const data = [work];

      const result = WorksService.copyFactNormTimeToFactTime(data, "EVERY", "jan");

      expect(result[0].year_fact_time).toBe(15);
    });
  });

  describe("updateTransfers", () => {
    it("добавляет planTransfers", () => {
      const work = createTestWork({ norm_of_time: 1 });
      work.jan_plan_work = { ...work.jan_plan_work, original: 10, final: 10 };
      const data = [work];

      const transfers = [{ fieldTo: "feb_plan_work" as const, value: 5 }];
      const result = WorksService.updateTransfers(
        data,
        work.id,
        "jan_plan_work",
        transfers,
        "plan"
      );

      expect(result[0].jan_plan_work.planTransfers).toEqual(transfers);
      expect(result[0].jan_plan_work.planTransfersSum).toBe(5);
    });

    it("пересчитывает outsideCorrectionsSum для целевого поля", () => {
      const work = createTestWork({ norm_of_time: 1 });
      work.jan_plan_work = { ...work.jan_plan_work, original: 10, final: 10 };
      work.feb_plan_work = { ...work.feb_plan_work, original: 0, final: 0 };
      const data = [work];

      const transfers = [{ fieldTo: "feb_plan_work" as const, value: 5 }];
      const result = WorksService.updateTransfers(
        data,
        work.id,
        "jan_plan_work",
        transfers,
        "plan"
      );

      expect(result[0].feb_plan_work.outsideCorrectionsSum).toBe(5);
      expect(result[0].feb_plan_work.final).toBe(5);
    });
  });
});
