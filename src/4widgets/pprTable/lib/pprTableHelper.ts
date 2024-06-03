import { IPprDataWithRowSpan, IPprData } from "@/2entities/ppr";

export function handlePprData(data: IPprData[]): IPprDataWithRowSpan[] {
  let prevWorkId: string = "";
  let prevWorkName: string = "";
  let prevWorkIndex: number = 0;

  const rowSpanData: { [id: string]: number } = {};

  for (let i = 0; i < data.length; i++) {
    const work = data[i];
    if (i === 0) {
      prevWorkId = work.id;
      prevWorkName = work.name;
    }
    const diff = i - prevWorkIndex;
    if (prevWorkName === work.name && diff >= 1) {
      rowSpanData[work.id] = 0;
      if (i === data.length - 1) {
        rowSpanData[prevWorkId] = diff + 1;
      }
      continue;
    } else if (prevWorkName !== work.name) {
      rowSpanData[prevWorkId] = diff;
      prevWorkId = work.id;
      prevWorkName = work.name;
      prevWorkIndex = i;
      continue;
    }
  }

  return data.map((datum) => {
    return { ...datum, rowSpan: rowSpanData[datum.id] };
  });
}
