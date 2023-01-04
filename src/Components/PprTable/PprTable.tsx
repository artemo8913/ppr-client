import styled from "styled-components";
import Title from "./Title";
import Row from "./Row";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import { IRowData } from "../../Interface";

const TableStyled = styled.table`
  table-layout: fixed;
  width: 200%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export default function PprTable() {
  const data = useSelector((state: RootState) => state.ppr.value);
  console.log(data);
  const rows = data.map((rowData: IRowData, index: number, data: IRowData[]) => {
    let sectionSpan = 1;
    let subsectionSpan = 1;
    let sectionIsShow = true;
    let subsectionIsShow = true;
    if (index !== data.length - 1) {
      for (let j = index + 1; j < data.length && rowData.section === data[j].section; j++) sectionSpan++;
      for (let j = index + 1; j < data.length && rowData.subsection === data[j].subsection && rowData.section === data[j].section; j++)
        subsectionSpan++;
    }
    if (index !== 0) {
      const prevSection = data[index - 1].section;
      const prevSubsection = data[index - 1].subsection;
      if (rowData.section === prevSection) sectionIsShow = false;
      if (rowData.subsection === prevSubsection && rowData.section === prevSection) subsectionIsShow = false;
    }
    return (
      <Row
        {...rowData}
        key={rowData.id}
        sectionIsShow={sectionIsShow}
        subsectionIsShow={subsectionIsShow}
        sectionSpan={sectionSpan}
        subsectionSpan={subsectionSpan}
      />
    );
  });
  return (
    <div className="app">
      <TableStyled>
        <Title />
        <tbody>{rows}</tbody>
      </TableStyled>
    </div>
  );
}
