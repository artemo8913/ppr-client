export type TDivisions = "directions" | "distances" | "subdivisions";

interface basicInfo {
  name: string;
  short_name: string;
}

interface IDistancesInfo extends basicInfo {
  subdivisions: Record<number, basicInfo>;
}

export interface IDivisionInfo extends basicInfo {
  distances: Record<number, IDistancesInfo>;
}

export const directionsMock: Record<number, IDivisionInfo> = {
  88: {
    name: "Красноярская НТЭ",
    short_name: "КрасНТЭ",
    distances: {
      1: {
        name: "ЭЧ Боготол",
        short_name: "ЭЧ-1",
        subdivisions: {},
      },
      2: {
        name: "ЭЧ Ачинск",
        short_name: "ЭЧ-2",
        subdivisions: {},
      },
      3: {
        name: "ЭЧ Красноярск",
        short_name: "ЭЧ-3",
        subdivisions: {
          9: { name: "Район контактной сети ЭЧК-9 Козулька", short_name: "ЭЧК-9" },
          10: { name: "Район контактной сети ЭЧК-10 Кемчуг", short_name: "ЭЧК-10" },
          12: { name: "Район контактной сети ЭЧК-12 Минино", short_name: "ЭЧК-12" },
          13: { name: "Район контактной сети ЭЧК-13 Красноярск", short_name: "ЭЧК-13" },
          14: { name: "Район контактной сети ЭЧК-14 Дивногорск", short_name: "ЭЧК-14" },
          15: { name: "Район контактной сети ЭЧК-15 Базаиха", short_name: "ЭЧК-15" },
          46: { name: "Район контактной сети ЭЧК-46 Бугач", short_name: "ЭЧК-46" },
          47: { name: "Район контактной сети ЭЧК-47 Красноярск-Восточный", short_name: "ЭЧК-47" },
        },
      },
      4: { name: "ЭЧ Уяр", short_name: "ЭЧ-4", subdivisions: {} },
      5: { name: "ЭЧ Иланская", short_name: "ЭЧ-5", subdivisions: {} },
      6: { name: "ЭЧ Абакан", short_name: "ЭЧ-6", subdivisions: {} },
      7: { name: "ЭЧ Саянская", short_name: "ЭЧ-7", subdivisions: {} },
    },
  },
};
