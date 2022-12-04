import Title from "./Components/Title";
import Row from "./Components/Row";
import styled from "styled-components";
import { RootState } from "./Redux/store";
import { useSelector } from "react-redux";
import { IRow, IRowData } from "./Interface";

const TableStyled = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 10px;
`;

export default function App() {
  const data = useSelector((state: RootState) => state.ppr.value);
  const rows = data.map((rowData: IRowData, index: number, data: IRowData[]) => {
    let sectionSpan = 1;
    let subsectionSpan = 1;
    let sectionIsShow = true;
    let subsectionIsShow = true;
    if (index != data.length - 1) {
      for (let j = index + 1; j < data.length && rowData.section === data[j].section; j++) sectionSpan++;
      for (let j = index + 1; j < data.length && rowData.subsection === data[j].subsection && rowData.section === data[j].section; j++) subsectionSpan++;
    }
    if (index != 0) {
      const prevSection = data[index - 1].section;
      const prevSubsection = data[index - 1].subsection;
      if (rowData.section === prevSection) sectionIsShow = false;
      if (rowData.subsection === prevSubsection && rowData.section === prevSection) subsectionIsShow = false;
    }
    return <Row
      {...rowData}
      sectionIsShow={sectionIsShow}
      subsectionIsShow={subsectionIsShow}
      sectionSpan={sectionSpan}
      subsectionSpan={subsectionSpan}
    />
  });
  return (
    <div className='app'>
      <h1>Hello World!</h1>
      <TableStyled>
        <Title />
        <tbody>
          {rows}
        </tbody>
      </TableStyled>
    </div>
  );
}