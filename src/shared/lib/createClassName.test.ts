import { createClassName } from "shared/lib/createClassName";

describe("className", () => {
  test("Только название класса", () => {
    expect(createClassName("class")).toBe("class");
  });
  test("Название класса и модуль", () => {
    expect(createClassName("class", { mod1: true, mod2: false })).toBe("class mod1");
  });
  test("Название класса, модуль и доп.класс", () => {
    expect(createClassName("class", { mod1: true, mod2: false }, ["dop1"])).toBe("class mod1 dop1");
  });
  test("Название класса, модуль и два доп.класс", () => {
    expect(createClassName("class", { mod1: true, mod2: true }, ["dop1"])).toBe("class mod1 mod2 dop1");
  });
  test("Пустая строка", () => {
    expect(createClassName("", { mod2: false }, [])).toBe("");
  });
});
