import { YearPlanStatusUpdater } from "../model/service/PprYearPlanStatusUpdater";
import { YearPlanStatus } from "../model/ppr.types";
import { UserRole } from "@/2entities/user/@x/ppr";

describe("YearPlanStatusUpdater", () => {
  const updater = new YearPlanStatusUpdater();

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
    it("template → null", () => {
      expect(updater.getNextStatus("template")).toBeNull();
    });

    it("plan_creating → plan_on_agreement_engineer", () => {
      expect(updater.getNextStatus("plan_creating")).toBe("plan_on_agreement_engineer");
    });

    it("plan_on_agreement_engineer → plan_on_agreement_time_norm", () => {
      expect(updater.getNextStatus("plan_on_agreement_engineer")).toBe("plan_on_agreement_time_norm");
    });

    it("plan_on_agreement_time_norm → plan_on_agreement_sub_boss", () => {
      expect(updater.getNextStatus("plan_on_agreement_time_norm")).toBe("plan_on_agreement_sub_boss");
    });

    it("plan_on_agreement_sub_boss → plan_on_aprove", () => {
      expect(updater.getNextStatus("plan_on_agreement_sub_boss")).toBe("plan_on_aprove");
    });

    it("plan_on_aprove → in_process", () => {
      expect(updater.getNextStatus("plan_on_aprove")).toBe("in_process");
    });

    it("in_process → done", () => {
      expect(updater.getNextStatus("in_process")).toBe("done");
    });

    it("done → null", () => {
      expect(updater.getNextStatus("done")).toBeNull();
    });
  });

  describe("getStatusForReject", () => {
    it("всегда возвращает plan_creating", () => {
      const statuses: YearPlanStatus[] = [
        "plan_on_agreement_engineer",
        "plan_on_agreement_time_norm",
        "plan_on_agreement_sub_boss",
        "plan_on_aprove",
        "in_process",
      ];
      statuses.forEach((status) => {
        expect(updater.getStatusForReject()).toBe("plan_creating");
      });
    });
  });

  describe("checkIsCanUpdate", () => {
    it("plan_creating: только subdivision может продвинуть", () => {
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

    it("plan_on_agreement_sub_boss: только distance_sub_boss", () => {
      expect(updater.checkIsCanUpdate("plan_on_agreement_sub_boss", "distance_sub_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_sub_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("plan_on_agreement_sub_boss", role)).toBe(false);
      });
    });

    it("plan_on_aprove: только distance_boss", () => {
      expect(updater.checkIsCanUpdate("plan_on_aprove", "distance_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("plan_on_aprove", role)).toBe(false);
      });
    });

    it("in_process: только distance_boss", () => {
      expect(updater.checkIsCanUpdate("in_process", "distance_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanUpdate("in_process", role)).toBe(false);
      });
    });

    it("template: никто не может продвинуть", () => {
      ALL_ROLES.forEach((role) => {
        expect(updater.checkIsCanUpdate("template", role)).toBe(false);
      });
    });

    it("done: никто не может продвинуть", () => {
      ALL_ROLES.forEach((role) => {
        expect(updater.checkIsCanUpdate("done", role)).toBe(false);
      });
    });
  });

  describe("checkIsCanReject", () => {
    it("plan_creating: никто не может отклонить", () => {
      ALL_ROLES.forEach((role) => {
        expect(updater.checkIsCanReject("plan_creating", role)).toBe(false);
      });
    });

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

    it("plan_on_agreement_sub_boss: только distance_sub_boss может отклонить", () => {
      expect(updater.checkIsCanReject("plan_on_agreement_sub_boss", "distance_sub_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_sub_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("plan_on_agreement_sub_boss", role)).toBe(false);
      });
    });

    it("plan_on_aprove: только distance_boss может отклонить", () => {
      expect(updater.checkIsCanReject("plan_on_aprove", "distance_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("plan_on_aprove", role)).toBe(false);
      });
    });

    it("in_process: только distance_boss может отклонить", () => {
      expect(updater.checkIsCanReject("in_process", "distance_boss")).toBe(true);
      const otherRoles = ALL_ROLES.filter((r) => r !== "distance_boss");
      otherRoles.forEach((role) => {
        expect(updater.checkIsCanReject("in_process", role)).toBe(false);
      });
    });

    it("template и done: никто не может отклонить", () => {
      (["template", "done"] as YearPlanStatus[]).forEach((status) => {
        ALL_ROLES.forEach((role) => {
          expect(updater.checkIsCanReject(status, role)).toBe(false);
        });
      });
    });
  });
});
