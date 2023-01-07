import styled from "styled-components";
import Title from "./Title";
import Row from "./Row";
import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addRow } from "../../Redux/slice/pprSlice";
import { IRowData } from "../../Interface";
import settings, { fullMounthsList, fullWorkAndTimeColumnsList, fullInfoColumnsList } from "../../settings";
import { nanoid } from "nanoid";

const TableStyled = styled.table`
  table-layout: fixed;
  width: 100%;
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
  const dispath = useDispatch();
  function addNewRow() {
    const newId = nanoid();
    if(newId){
      dispath(addRow({id: newId}));
    }
  }

  const infoColumnList = excludeFromList(fullInfoColumnsList, settings.hiddenPprColumns.createPlan);
  const titleInfoColumnList = excludeFromList(fullInfoColumnsList, ["subsection", ...settings.hiddenPprColumns.createPlan]);
  const workAndTimeColumnList = excludeFromList(fullWorkAndTimeColumnsList, settings.hiddenPprColumns.createPlan);
  const mounthList = excludeFromList(fullMounthsList, settings.hiddenPprColumns.createPlan);
  const editableList = settings.editablePprColumns.createPlan;

  const rows = data.map((rowData: IRowData, index: number, data: IRowData[]) => {
    const sectionVSpan = 1, subsectionVSpan = 1, sectionIsShow = true, subsectionIsShow = true;
    // const { sectionVSpan, subsectionVSpan, sectionIsShow, subsectionIsShow } = verticalSpanCells(rowData, index, data);
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
    <div className="app">
      <TableStyled>
        <Title workAndTimeColumnsList={workAndTimeColumnList} infoColumnsList={titleInfoColumnList} mounthList={mounthList} />
        <tbody>{rows}</tbody>
      </TableStyled>
      <button onClick={()=>addNewRow()}>Добавить строчечку</button>
    </div>
  );
}
