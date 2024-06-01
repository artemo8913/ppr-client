import { IHandlePprData, IPprData } from "@/2entities/ppr";

export function handlePprData(data: IPprData[]): IHandlePprData[] {
  let name: string;
  let id: string;
  let firstIndex: number;
  let lastIndex: number;

  function clearTempData(datum: IPprData, index: number) {
    id = datum.id;
    name = datum.name;
    firstIndex = index;
    lastIndex = index;
  }

  const rowSpanData: { [id: string]: number | undefined } = {};

  data.forEach((datum, index, arr) => {
    if (index === 0) {
      clearTempData(datum, index);
      return;
    }
    lastIndex = index;
    const diff = lastIndex - firstIndex;
    if (name !== datum.name) {
      if (diff > 1) {
        rowSpanData[id] = diff;
      }
      clearTempData(datum, index);
      return;
    }
    if (arr.length - 1 === index && diff >= 1) {
      rowSpanData[id] = diff + 1;
    }
  });

  return data.map((datum) => {
    return { ...datum, rowSpan: rowSpanData[datum.id] };
  });
}
