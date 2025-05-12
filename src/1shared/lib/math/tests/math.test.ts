import { roundToFixed } from "../roundToFixed";
import { convertCommaToDot, isSimilarToNumber } from "../stringifiedNumber";

describe("Проверка модуля math", () => {
  test("Окргулить строку 1.2345 до 2х знаков после запятой", () => {
    expect(roundToFixed("1.2345", 2)).toBe(1.23);
  });
  test("Окргулить строку 1.23456666 до 4х знаков после запятой", () => {
    expect(roundToFixed("1.23456666")).toBe(1.2346);
  });
  test("Окргулить число 1.23456666 до 4х знаков после запятой", () => {
    expect(roundToFixed(1.23456666)).toBe(1.2346);
  });
  test("Окргулить число 1.23456666 до 3х знаков после запятой", () => {
    expect(roundToFixed(1.23456666, 3)).toBe(1.235);
  });
  test("Окргулить число 1.23456666 до 3х знаков после запятой", () => {
    expect(roundToFixed(1.23456666, 3)).toBe(1.235);
  });
  test("Не верно записанное число будет NaN", () => {
    expect(roundToFixed("asd")).toBeNaN();
  });
  test("Строка '1,2' похожа на число", () => {
    expect(isSimilarToNumber("1,2")).toBeTruthy();
  });
  test("Строка '1.2' похожа на число", () => {
    expect(isSimilarToNumber("1.2")).toBeTruthy();
  });
  test("Строка 'asd' не похожа на число", () => {
    expect(isSimilarToNumber("asd")).toBeFalsy();
  });
  test("Строка '1.1.1' не похожа на число", () => {
    expect(isSimilarToNumber("1.1.1")).toBeFalsy();
  });
  test("Строка '1,1' преобразуется в '1.1'", () => {
    expect(convertCommaToDot("1,1")).toBe("1.1");
  });
});
