import { checkIsPprInUserControl } from "../lib/isPprInUserControl";
import { User } from "@/2entities/user/@x/ppr";

const makeUser = (overrides: Partial<User>): User => ({
  id: 1,
  firstName: "Иван",
  lastName: "Иванов",
  middleName: "Иванович",
  role: "subdivision",
  idSubdivision: null,
  idDistance: null,
  idDirection: null,
  ...overrides,
});

const SUBDIVISION_ID = 10;
const DISTANCE_ID = 20;
const OTHER_SUBDIVISION_ID = 99;
const OTHER_DISTANCE_ID = 88;

describe("checkIsPprInUserControl", () => {
  describe("когда данные не переданы", () => {
    it("возвращает все false если ppr_created_by не передан", () => {
      const result = checkIsPprInUserControl(undefined, makeUser({ role: "subdivision" }));
      expect(result.isForSubdivision).toBe(false);
      expect(result.isForEngineer).toBe(false);
      expect(result.isPprCreatedByThisUser).toBe(false);
    });

    it("возвращает все false если userData не передан", () => {
      const result = checkIsPprInUserControl(makeUser({ role: "subdivision" }), undefined);
      expect(result.isForSubdivision).toBe(false);
      expect(result.isForBoss).toBe(false);
      expect(result.isPprCreatedByThisUser).toBe(false);
    });

    it("возвращает все false если оба аргумента не переданы", () => {
      const result = checkIsPprInUserControl(undefined, undefined);
      expect(result).toEqual({
        isPprCreatedByThisUser: false,
        isForSubdivision: false,
        isForEngineer: false,
        isForTimeNorm: false,
        isForSecurityEngineer: false,
        isForSubBoss: false,
        isForBoss: false,
        isUserDistance: false,
      });
    });
  });

  describe("isPprCreatedByThisUser", () => {
    it("true если id совпадает", () => {
      const user = makeUser({ id: 5 });
      const result = checkIsPprInUserControl(user, user);
      expect(result.isPprCreatedByThisUser).toBe(true);
    });

    it("false если id отличается", () => {
      const creator = makeUser({ id: 5 });
      const currentUser = makeUser({ id: 6 });
      const result = checkIsPprInUserControl(creator, currentUser);
      expect(result.isPprCreatedByThisUser).toBe(false);
    });
  });

  describe("isForSubdivision", () => {
    it("true если роль subdivision и idSubdivision совпадает", () => {
      const creator = makeUser({ idSubdivision: SUBDIVISION_ID });
      const user = makeUser({ role: "subdivision", idSubdivision: SUBDIVISION_ID });
      expect(checkIsPprInUserControl(creator, user).isForSubdivision).toBe(true);
    });

    it("false если роль subdivision но idSubdivision другой", () => {
      const creator = makeUser({ idSubdivision: SUBDIVISION_ID });
      const user = makeUser({ role: "subdivision", idSubdivision: OTHER_SUBDIVISION_ID });
      expect(checkIsPprInUserControl(creator, user).isForSubdivision).toBe(false);
    });

    it("false если idSubdivision совпадает но роль другая", () => {
      const creator = makeUser({ idSubdivision: SUBDIVISION_ID });
      const user = makeUser({ role: "distance_engineer", idSubdivision: SUBDIVISION_ID });
      expect(checkIsPprInUserControl(creator, user).isForSubdivision).toBe(false);
    });
  });

  describe("isForEngineer", () => {
    it("true если роль distance_engineer и idDistance совпадает", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_engineer", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForEngineer).toBe(true);
    });

    it("false если роль distance_engineer но idDistance другой", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_engineer", idDistance: OTHER_DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForEngineer).toBe(false);
    });

    it("false если idDistance совпадает но роль другая", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "subdivision", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForEngineer).toBe(false);
    });
  });

  describe("isForTimeNorm", () => {
    it("true если роль distance_time_norm и idDistance совпадает", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_time_norm", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForTimeNorm).toBe(true);
    });

    it("false если idDistance другой", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_time_norm", idDistance: OTHER_DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForTimeNorm).toBe(false);
    });
  });

  describe("isForSecurityEngineer", () => {
    it("true если роль distance_security_engineer и idDistance совпадает", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_security_engineer", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForSecurityEngineer).toBe(true);
    });

    it("false если idDistance другой", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_security_engineer", idDistance: OTHER_DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForSecurityEngineer).toBe(false);
    });
  });

  describe("isForSubBoss", () => {
    it("true если роль distance_sub_boss и idDistance совпадает", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_sub_boss", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForSubBoss).toBe(true);
    });

    it("false если idDistance другой", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_sub_boss", idDistance: OTHER_DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForSubBoss).toBe(false);
    });
  });

  describe("isForBoss", () => {
    it("true если роль distance_boss и idDistance совпадает", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_boss", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForBoss).toBe(true);
    });

    it("false если idDistance другой", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_boss", idDistance: OTHER_DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isForBoss).toBe(false);
    });
  });

  describe("isUserDistance", () => {
    it("true если idDistance совпадает вне зависимости от роли", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "subdivision", idDistance: DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isUserDistance).toBe(true);
    });

    it("false если idDistance отличается", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_boss", idDistance: OTHER_DISTANCE_ID });
      expect(checkIsPprInUserControl(creator, user).isUserDistance).toBe(false);
    });
  });

  describe("совмещённые сценарии", () => {
    it("начальник цеха своей дистанции — isForSubdivision true, остальные false", () => {
      const creator = makeUser({ id: 1, idSubdivision: SUBDIVISION_ID, idDistance: DISTANCE_ID });
      const user = makeUser({ id: 2, role: "subdivision", idSubdivision: SUBDIVISION_ID, idDistance: DISTANCE_ID });
      const result = checkIsPprInUserControl(creator, user);
      expect(result.isForSubdivision).toBe(true);
      expect(result.isForEngineer).toBe(false);
      expect(result.isForBoss).toBe(false);
      expect(result.isPprCreatedByThisUser).toBe(false);
    });

    it("инженер чужой дистанции — все false", () => {
      const creator = makeUser({ idDistance: DISTANCE_ID });
      const user = makeUser({ role: "distance_engineer", idDistance: OTHER_DISTANCE_ID });
      const result = checkIsPprInUserControl(creator, user);
      expect(result.isForEngineer).toBe(false);
      expect(result.isForBoss).toBe(false);
      expect(result.isUserDistance).toBe(false);
    });
  });
});
