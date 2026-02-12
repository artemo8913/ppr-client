import { MonthPlanStatusUpdater } from "../model/service/PprMonthPlanStatusUpdater";
import { MonthPlanStatus, AllMonthsPlansStatuses } from "../model/ppr.types";
import { UserRole } from "@/2entities/user/@x/ppr";
import { MONTHS } from "@/1shared/lib/date";

describe("MonthPlanStatusUpdater", () => {
  const updater = new MonthPlanStatusUpdater();

  const ALL_ROLES: UserRole[] = [
    "subdivision",
    "distance_engineer",
    "distance_time_norm",
    "distance_security_engineer",
    "distance_sub_boss",
    "distance_boss",
    "direction",
    "transenergo",
  ];

  describe("getNextStatus", () => {
    it("none → plan_creating", () => {
      expect(updater.getNextStatus("none")).toBe("plan_creating");
    });

    it("plan_creating → plan_on_agreement_time_norm", () => {
      expect(updater.getNextStatus("plan_creating")).toBe("plan_on_agreement_time_norm");
    });

    it("plan_on_agreement_time_norm → plan_on_agreement_engineer", () => {
      expect(updater.getNextStatus("plan_on_agreement_time_norm")).toBe("plan_on_agreement_engineer");
    });

    it("plan_on_agreement_engineer → plan_on_aprove", () => {
      expect(updater.getNextStatus("plan_on_agreement_engineer")).toBe("plan_on_aprove");
    });

    it("plan_on_aprove → in_process", () => {
      expect(updater.getNextStatus("plan_on_aprove")).toBe("in_process");
    });

    it("in_process → fact_filling", () => {
      expect(updater.getNextStatus("in_process")).toBe("fact_filling");
    });

    it("fact_filling → fact_verification_time_norm", () => {
      expect(updater.getNextStatus("fact_filling")).toBe("fact_verification_time_norm");
    });

    it("fact_verification_time_norm → fact_verification_engineer", () => {
      expect(updater.getNextStatus("fact_verification_time_norm")).toBe("fact_verification_engineer");
    });

    it("fact_verification_engineer → fact_on_agreement_sub_boss", () => {
      expect(updater.getNextStatus("fact_verification_engineer")).toBe("fact_on_agreement_sub_boss");
    });

    it("fact_on_agreement_sub_boss → done", () => {
      expect(updater.getNextStatus("fact_on_agreement_sub_boss")).toBe("done");
    });

    it("done → null", () => {
      expect(updater.getNextStatus("done")).toBeNull();
    });
  });

  describe("getStatusForReject", () => {
    it("статусы стадии планирования откатываются к plan_creating", () => {
      const planningStageStatuses: MonthPlanStatus[] = [
        "plan_creating",
        "plan_on_agreement_engineer",
        "plan_on_agreement_time_norm",
        "plan_on_aprove",
      ];
      planningStageStatuses.forEach((status) => {
        expect(updater.getStatusForReject(status)).toBe("plan_creating");
      });
    });

    it("статусы стадии заполнения факта откатываются к fact_filling", () => {
      const fillingStageStatuses: MonthPlanStatus[] = [
        "fact_filling",
        "fact_verification_engineer",
        "fact_verification_time_norm",
        "fact_on_agreement_sub_boss",
      ];
      fillingStageStatuses.forEach((status) => {
        expect(updater.getStatusForReject(status)).toBe("fact_filling");
      });
    });

    it("none, in_process, done откатываются к самим себе", () => {
      const unchangedStatuses: MonthPlanStatus[] = ["none", "in_process", "done"];
      unchangedStatuses.forEach((status) => {
        expect(updater.getStatusForReject(status)).toBe(status);
      });
    });
  });

  describe("checkIsDoneAll", () => {
    const makeStatuses = (status: MonthPlanStatus): AllMonthsPlansStatuses =>
      Object.fromEntries(MONTHS.map((m) => [m, status])) as AllMonthsPlansStatuses;

    it("все месяцы done → true", () => {
      expect(updater.checkIsDoneAll(makeStatuses("done"))).toBe(true);
    });

    it("все месяцы none → false", () => {
      expect(updater.checkIsDoneAll(makeStatuses("none"))).toBe(false);
    });

    it("один месяц не done → false", () => {
      const statuses = makeStatuses("done");
      statuses["jan"] = "fact_on_agreement_sub_boss";
      expect(updater.checkIsDoneAll(statuses)).toBe(false);
    });
  });

  describe("checkIsCanUpdate", () => {
    it("none: только subdivision", () => {
      expect(updater.checkIsCanUpdate("none", "subdivision")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "subdivision");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("none", role)).toBe(false);
      });
    });

    it("plan_creating: только subdivision", () => {
      expect(updater.checkIsCanUpdate("plan_creating", "subdivision")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "subdivision");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("plan_creating", role)).toBe(false);
      });
    });

    it("plan_on_agreement_engineer: только distance_engineer", () => {
      expect(updater.checkIsCanUpdate("plan_on_agreement_engineer", "distance_engineer")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_engineer");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("plan_on_agreement_engineer", role)).toBe(false);
      });
    });

    it("plan_on_agreement_time_norm: только distance_time_norm", () => {
      expect(updater.checkIsCanUpdate("plan_on_agreement_time_norm", "distance_time_norm")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_time_norm");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("plan_on_agreement_time_norm", role)).toBe(false);
      });
    });

    it("plan_on_aprove: только distance_sub_boss", () => {
      expect(updater.checkIsCanUpdate("plan_on_aprove", "distance_sub_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_sub_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("plan_on_aprove", role)).toBe(false);
      });
    });

    it("in_process: только subdivision", () => {
      expect(updater.checkIsCanUpdate("in_process", "subdivision")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "subdivision");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("in_process", role)).toBe(false);
      });
    });

    it("fact_filling: только subdivision", () => {
      expect(updater.checkIsCanUpdate("fact_filling", "subdivision")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "subdivision");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("fact_filling", role)).toBe(false);
      });
    });

    it("fact_verification_engineer: только distance_engineer", () => {
      expect(updater.checkIsCanUpdate("fact_verification_engineer", "distance_engineer")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_engineer");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("fact_verification_engineer", role)).toBe(false);
      });
    });

    it("fact_verification_time_norm: только distance_time_norm", () => {
      expect(updater.checkIsCanUpdate("fact_verification_time_norm", "distance_time_norm")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_time_norm");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("fact_verification_time_norm", role)).toBe(false);
      });
    });

    it("fact_on_agreement_sub_boss: только distance_sub_boss", () => {
      expect(updater.checkIsCanUpdate("fact_on_agreement_sub_boss", "distance_sub_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_sub_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("fact_on_agreement_sub_boss", role)).toBe(false);
      });
    });

    it("done: никто не может продвинуть", () => {
      ALL_ROLES.forEach((role) => {
        expect(updater.checkIsCanUpdate("done", role)).toBe(false);
      });
    });
  });

  describe("checkIsCanReject", () => {
    it("plan_on_agreement_engineer: только distance_engineer может отклонить", () => {
      expect(updater.checkIsCanReject("plan_on_agreement_engineer", "distance_engineer")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_engineer");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("plan_on_agreement_engineer", role)).toBe(false);
      });
    });

    it("plan_on_agreement_time_norm: только distance_time_norm может отклонить", () => {
      expect(updater.checkIsCanReject("plan_on_agreement_time_norm", "distance_time_norm")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_time_norm");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("plan_on_agreement_time_norm", role)).toBe(false);
      });
    });

    it("plan_on_aprove: только distance_sub_boss может отклонить", () => {
      expect(updater.checkIsCanReject("plan_on_aprove", "distance_sub_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_sub_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("plan_on_aprove", role)).toBe(false);
      });
    });

    it("fact_verification_engineer: только distance_engineer может отклонить", () => {
      expect(updater.checkIsCanReject("fact_verification_engineer", "distance_engineer")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_engineer");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("fact_verification_engineer", role)).toBe(false);
      });
    });

    it("fact_verification_time_norm: только distance_time_norm может отклонить", () => {
      expect(updater.checkIsCanReject("fact_verification_time_norm", "distance_time_norm")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_time_norm");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("fact_verification_time_norm", role)).toBe(false);
      });
    });

    it("fact_on_agreement_sub_boss: только distance_sub_boss может отклонить", () => {
      expect(updater.checkIsCanReject("fact_on_agreement_sub_boss", "distance_sub_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_sub_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("fact_on_agreement_sub_boss", role)).toBe(false);
      });
    });

    it("none, plan_creating, in_process, fact_filling, done: никто не может отклонить", () => {
      const noRejectStatuses: MonthPlanStatus[] = [
        "none",
        "plan_creating",
        "in_process",
        "fact_filling",
        "done",
      ];
      noRejectStatuses.forEach((status) => {
        ALL_ROLES.forEach((role) => {
          expect(updater.checkIsCanReject(status, role)).toBe(false);
        });
      });
    });
  });
});
