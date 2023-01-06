import { Fragment } from "react";
import styled from "styled-components";
import { IMounthData, IRow, IRowData } from "../../Interface";
import Cell from "./Cell";
import settings from "../../settings";

const StyledRow = styled.tr`
  &:hover {
    box-shadow: inset 0px 0px 10px #00ff1e;
  }
`;
const colSett = settings.pprColumnSettings;

export default function Row(props: IRow) {
  const { workAndTimeColumnsList, infoColumnsList, mounthList, data, sectionVSpan = 1, subsectionVSpan = 1 } = props;
  const { rowId } = data;

  const columnsInformationData = infoColumnsList.map((column) => {
    //@ts-ignore
    if (typeof data[column] === "string" || typeof data[column] === "number") {
      let vSpan = 1;
      let vText = colSett[column].vText ? colSett[column].vText : false;
      if (column === "section") {
        vSpan = sectionVSpan;
      } else if (column === "subsection") {
        vSpan = subsectionVSpan;
      }

      return (
        <Cell rowId={rowId} type={column} vText={vText} key={column} rowSpan={vSpan}>
          {/*@ts-ignore*/}
          {data[column]}
        </Cell>
      );
    }
  });
  const planData = mounthList.map((timePeriod) => {
    const workDataEl = workAndTimeColumnsList.map((column) => {
      let vText = colSett[column].vText ? colSett[column].vText : false;
      return (
        <Fragment key={`${column + timePeriod}`}>
          <Cell vText={vText} rowId={rowId} type={`${column + timePeriod}`}>
            {/*@ts-ignore*/}
            {data[column][timePeriod]}
          </Cell>
        </Fragment>
      );
    });
    return <Fragment key={timePeriod}>{workDataEl}</Fragment>;
  });

  return (
    <StyledRow>
      {columnsInformationData}
      {planData}
    </StyledRow>
  );
}