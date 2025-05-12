import { getMonthsByQuartal, getQuartal, getTimePeriodFromString } from "../lib/getTimePeriod";
import { Month } from "../model/date.types";

describe("Проверка модуля date", () => {
  test("Строка jan - это январь (jan)", () => {
    expect(getTimePeriodFromString("jan")).toBe("jan");
  });
  test("Строка jan_123 - это январь (jan)", () => {
    expect(getTimePeriodFromString("jan_123")).toBe("jan");
  });
  test("Строка 123_jan - не январь", () => {
    expect(getTimePeriodFromString("123_jan")).toBe(undefined);
  });
  test("Март - это 1 квартал", () => {
    expect(getQuartal("mar")).toBe(1);
  });
  test("Апрель - это 2 квартал", () => {
    expect(getQuartal("apr")).toBe(2);
  });
  test("Декабрь - это 4 квартал", () => {
    expect(getQuartal("dec")).toBe(4);
  });
  test("Сентябрь - это 3 квартал", () => {
    expect(getQuartal("sept")).toBe(3);
  });
  test("1 квартал - это январь, февраль, март", () => {
    const months: Month[] = ["jan", "feb", "mar"];
    expect(getMonthsByQuartal(1)).toEqual(months);
  });
  test("2 квартал - это апрель, май, июнь", () => {
    const months: Month[] = ["apr", "may", "june"];
    expect(getMonthsByQuartal(2)).toEqual(months);
  });
  test("3 квартал - это июль, август, сентябрь, ", () => {
    const months: Month[] = ["july", "aug", "sept"];
    expect(getMonthsByQuartal(3)).toEqual(months);
  });
  test("4 квартал - это октябрь, ноябрь, декабрь", () => {
    const months: Month[] = ["oct", "nov", "dec"];
    expect(getMonthsByQuartal(4)).toEqual(months);
  });
});
