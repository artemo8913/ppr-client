import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { IRowData } from "../../Interface";
import apiFetch from "../../healper/ApiFetch";
import settings, { fullMounthsList, fullWorkAndTimeColumnsList, fullInfoColumnsList } from "../../settings";
import Title from "./Title";
import Row from "./Row";
import PprStateSandbox from "./PprStateSandBox";

const TableStyled = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 12px;
`;

function excludeFromList(fullList: Array<string>, excludedList: Array<string> = []) {
  return fullList.filter((el) => excludedList.indexOf(el) === -1);
}
//не нравится эта функция, надо переделать способ объединения строк с возможностью выбора столбцов
function connectVCells(rowData: IRowData, index: number, data: IRowData[]) {
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
  const { status, fulfullingMounth, data } = useSelector((state: RootState) => state.pprData);
  const { hidden, uniteCells, editableState } = useSelector((state: RootState) => state.pprUI);

  const [ppr, setPpr] = React.useState<IRowData[]>();
  React.useEffect(() => {
    console.log('юзе эфект');
    apiFetch.getData(`http://localhost:5000/api/ppr/3`, "stringify", setPpr, "get");
  }, []);
  const hiddenColumnsList = [...settings.hiddenPprColumns[hidden]];
  const editableList = [...settings.editablePprColumns[editableState]];

  if (hidden === "fulfilling" && status === "fulfilling" && fulfullingMounth !== "year") {
    hiddenColumnsList.push(...excludeFromList(fullMounthsList, [fulfullingMounth]));
  }
  if (status === "fulfilling" && fulfullingMounth !== "year") {
    editableList.push(fulfullingMounth);
  } else if (status === "creating" && fulfullingMounth === "year") {
    editableList.push(...excludeFromList(fullMounthsList, ["year"]));
  }
  const infoColumnList = excludeFromList(fullInfoColumnsList, hiddenColumnsList);
  const titleInfoColumnList = excludeFromList(fullInfoColumnsList, ["subsection", ...hiddenColumnsList]);
  const workAndTimeColumnList = excludeFromList(fullWorkAndTimeColumnsList, hiddenColumnsList);
  const mounthList = excludeFromList(fullMounthsList, hiddenColumnsList);

  const rows = data.map((rowData: IRowData, index: number, data: IRowData[]) => {
    let sectionVSpan = 1,
      subsectionVSpan = 1,
      sectionIsShow = true,
      subsectionIsShow = true;
    if (uniteCells) {
      ({ sectionVSpan, subsectionVSpan, sectionIsShow, subsectionIsShow } = connectVCells(rowData, index, data));
    }
    let bodyInfoColumnList = infoColumnList;
    if (!sectionIsShow) {
      bodyInfoColumnList = excludeFromList(bodyInfoColumnList, ["section"]);
    }
    if (!subsectionIsShow) {
      bodyInfoColumnList = excludeFromList(bodyInfoColumnList, ["subsection"]);
    }
    return (
      <Row
        editableColumnsList={editableList}
        infoColumnsList={bodyInfoColumnList}
        workAndTimeColumnsList={workAndTimeColumnList}
        mounthList={mounthList}
        key={rowData.id}
        data={rowData}
        sectionVSpan={sectionVSpan}
        subsectionVSpan={subsectionVSpan}
      />
    );
  });
  return (
    <div>
      <PprStateSandbox />
      <TableStyled>
        <Title workAndTimeColumnsList={workAndTimeColumnList} infoColumnsList={titleInfoColumnList} mounthList={mounthList} />
        <tbody>{rows}</tbody>
      </TableStyled>
    </div>
  );
}
