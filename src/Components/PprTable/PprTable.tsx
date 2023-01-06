import styled from "styled-components";
import Title from "./Title";
import Row from "./Row";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import { IRowData } from "../../Interface";
import settings, { fullMounthsList, fullWorkAndTimeColumnsList, fullInfoColumnsList } from "../../settings";

const TableStyled = styled.table`
  margin: 10px;
  table-layout: fixed;
  width: 200%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 12px;
`;

function excludeFromList(fullList: Array<string>, excludedList: Array<string>) {
  return fullList.filter((el) => excludedList.indexOf(el) === -1);
}

function verticalSpanCells(rowData: IRowData, index: number, data: IRowData[]) {
  let sectionVSpan = 1;
  let subsectionVSpan = 1;
  let sectionIsShow = true;
  let subsectionIsShow = true;
  if (index !== data.length - 1) {
    for (let j = index + 1; j < data.length && rowData.section === data[j].section; j++) sectionVSpan++;
    for (let j = index + 1; j < data.length && rowData.subsection === data[j].subsection && rowData.section === data[j].section; j++)
      subsectionVSpan++;
  }
  if (index !== 0) {
    const prevSection = data[index - 1].section;
    const prevSubsection = data[index - 1].subsection;
    if (rowData.section === prevSection) sectionIsShow = false;
    if (rowData.subsection === prevSubsection && rowData.section === prevSection) subsectionIsShow = false;
  }
  return { sectionVSpan, subsectionVSpan, sectionIsShow, subsectionIsShow };
}

export default function PprTable() {
  const data = useSelector((state: RootState) => state.ppr.value);

  const infoColumnList = excludeFromList(fullInfoColumnsList, ["normOfTime"]);
  const titleInfoColumnList = excludeFromList(fullInfoColumnsList, ["subsection","normOfTime"]);
  const workAndTimeColumnList = excludeFromList(fullWorkAndTimeColumnsList, ["factWork", "factNormTime", "factTime"]);
  const mounthList = excludeFromList(fullMounthsList, []);

  const rows = data.map((rowData: IRowData, index: number, data: IRowData[]) => {
    const { sectionVSpan, subsectionVSpan, sectionIsShow, subsectionIsShow } = verticalSpanCells(rowData, index, data);
    let bodyInfoColumnList = infoColumnList;
    if (!sectionIsShow) {
      bodyInfoColumnList = excludeFromList(bodyInfoColumnList, ["section"]);
    }
    if (!subsectionIsShow) {
      bodyInfoColumnList = excludeFromList(bodyInfoColumnList, ["subsection"]);
    }
    return (
      <Row
        infoColumnsList={bodyInfoColumnList}
        workAndTimeColumnsList={workAndTimeColumnList}
        mounthList={mounthList}
        key={rowData.rowId}
        data={rowData}
        sectionVSpan={sectionVSpan}
        subsectionVSpan={subsectionVSpan}
      />
    );
  });
  return (
    <div className="app">
      <TableStyled>
        <Title workAndTimeColumnsList={workAndTimeColumnList} infoColumnsList={titleInfoColumnList} mounthList={mounthList} />
        <tbody>{rows}</tbody>
      </TableStyled>
    </div>
  );
}
