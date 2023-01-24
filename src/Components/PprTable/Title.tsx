import { ITitle } from "../../Interface";
import Cell from "./Cell";
import settings from "../../settings";
import { ReactNode } from "react";

const colSett = settings.pprColumnSettings;
export default function Title(props: ITitle) {
  let fullPlanColSpan = 0;
  let colCount = 1;
  const { infoColumnsList, monthList, workAndTimeColumnsList } = props;
  const monthTitles: Array<ReactNode> = [];
  const planFactTitles: Array<ReactNode> = [];
  const workAndTimeColumnsTitles: Array<ReactNode> = [];

  const infoColumnsTitles = infoColumnsList.map((col) => {
    const rowSpan = colSett[col].titleRowSpan;
    const colSpan = colSett[col].titleColSpan;
    const widthPercent = colSett[col].widthPercent;
    colCount++;
    return (
      <Cell widthPercent={widthPercent} vText rowSpan={rowSpan} colSpan={colSpan}>
        {colSett[col].title}
      </Cell>
    );
  });

  monthList.forEach((month) => {
    let monthColSpan = 0;
    let planColSpan = 0;
    let factColSpan = 0;
    workAndTimeColumnsList.forEach((col) => {
      if (col.startsWith("plan")) planColSpan++;
      else if (col.startsWith("fact")) factColSpan++;
      workAndTimeColumnsTitles.push(<Cell vText>{colSett[col].title}</Cell>);
      monthColSpan++;
      colCount++;
      fullPlanColSpan++;
    });
    if (planColSpan > 0) planFactTitles.push(<Cell colSpan={planColSpan}>План</Cell>);
    if (factColSpan > 0) planFactTitles.push(<Cell colSpan={factColSpan}>Факт</Cell>);
    monthTitles.push(<Cell colSpan={planColSpan + factColSpan}>{colSett[month].title}</Cell>);
  });

  const colCountTitleEl = new Array(colCount).fill(0).map((_, i) => <Cell>{i + 1}</Cell>);
  return (
    <thead>
      <tr>
        {infoColumnsTitles}
        <Cell widthPercent={colSett.fullPlanwidthPercent} colSpan={fullPlanColSpan}>
          Планируемое и фактическое выполнение работ за год и по месяцам:
        </Cell>
      </tr>
      <tr>{monthTitles}</tr>
      <tr>{planFactTitles}</tr>
      <tr>{workAndTimeColumnsTitles}</tr>
      <tr>{colCountTitleEl}</tr>
    </thead>
  );
}
