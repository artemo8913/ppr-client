import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { setData } from "../../Redux/slice/pprDataSlice";
import { IRowData } from "../../Interface";
import apiFetch from "../../healper/ApiFetch";
import settings, { fullMonthsList, fullWorkAndTimeColumnsList, fullInfoColumnsList } from "../../settings";
import Title from "./Title";
import Row from "./Row";

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
    for (
      let j = index + 1;
      j < data.length && rowData.subsection_first === data[j].subsection_first && rowData.section === data[j].section;
      j++
    )
      subsectionVSpan++;
  }
  if (index !== 0) {
    const prevSection = data[index - 1].section;
    const prevSubsection = data[index - 1].subsection_first;
    if (rowData.section === prevSection) sectionIsShow = false;
    if (rowData.subsection_first === prevSubsection && rowData.section === prevSection) subsectionIsShow = false;
  }
  return { sectionVSpan, subsectionVSpan, sectionIsShow, subsectionIsShow };
}

export default function PprTable() {
  const { status, fulfullingMonth, data } = useSelector((state: RootState) => state.pprData);
  const { hidden, uniteCells, editableState } = useSelector((state: RootState) => state.pprUI);
  const dispatch = useDispatch();
  const { pprId } = useParams();
  const [ppr, setPpr] = React.useState<IRowData[]>();
  React.useEffect(() => {
    apiFetch.exchangeData(
      `http://localhost:5000/api/ppr/${pprId}`,
      "parse",
      (apiResult: { data: Array<IRowData> }) => dispatch(setData({ apiResult })),
      "get"
    );
  }, []);
  console.log(data);
  const hiddenColumnsList = [...settings.hiddenPprColumns[hidden]];
  const editableList = [...settings.editablePprColumns[editableState]];

  if (hidden === "fulfilling" && status === "fulfilling" && fulfullingMonth !== "year") {
    hiddenColumnsList.push(...excludeFromList(fullMonthsList, [fulfullingMonth]));
  }
  if (status === "fulfilling" && fulfullingMonth !== "year") {
    editableList.push(fulfullingMonth);
  } else if (status === "creating" && fulfullingMonth === "year") {
    editableList.push(...excludeFromList(fullMonthsList, ["year"]));
  }
  const infoColumnList = excludeFromList(fullInfoColumnsList, hiddenColumnsList);
  const titleInfoColumnList = excludeFromList(fullInfoColumnsList, ["subsection_first", ...hiddenColumnsList]);
  const workAndTimeColumnList = excludeFromList(fullWorkAndTimeColumnsList, hiddenColumnsList);
  const monthList = excludeFromList(fullMonthsList, hiddenColumnsList);

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
      bodyInfoColumnList = excludeFromList(bodyInfoColumnList, ["subsection_first"]);
    }
    return (
      <Row
        editableColumnsList={editableList}
        infoColumnsList={bodyInfoColumnList}
        workAndTimeColumnsList={workAndTimeColumnList}
        monthList={monthList}
        key={rowData.id}
        data={rowData}
        sectionVSpan={sectionVSpan}
        subsectionVSpan={subsectionVSpan}
      />
    );
  });
  return (
    <div>
      <TableStyled>
        <Title workAndTimeColumnsList={workAndTimeColumnList} infoColumnsList={titleInfoColumnList} monthList={monthList} />
        <tbody>{rows}</tbody>
      </TableStyled>
    </div>
  );
}
