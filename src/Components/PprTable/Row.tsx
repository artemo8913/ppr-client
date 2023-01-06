import { Fragment } from "react";
import styled from "styled-components";
import { IMounthData, IRow, IRowData } from "../../Interface";
import Cell from "./Cell";

const StyledRow = styled.tr`
    &:hover{
        box-shadow: inset 0px 0px 10px #00ff1e;
    }
`;
export default function Row(props: IRow) {
    const {
        columnList,
        mounthList,
        data,
        sectionIsShow,
        subsectionIsShow,
        sectionVSpan,
        subsectionVSpan,
    } = props;
    const {rowId, planWork, planTime, factWork, factNormTime, factTime} = data;
    
    const columnsInformationData = columnList.map(column => {
        //@ts-ignore
        if(typeof data[column] === "string" || typeof data[column] === "number") {
        //@ts-ignore
        return <Cell rowId={rowId} type={column}>{data[column as keyof IRowData]}</Cell>
    }
});
    const yearPlanData = <Fragment>
        <Cell rowId={rowId} type="yearPlanWork" verticalText>{planWork['year']}</Cell>
            <Cell rowId={rowId} type="yearPlanTime" verticalText>{planTime['year']}</Cell>
            <Cell rowId={rowId} type="yearFactWork" verticalText>{factWork['year']}</Cell>
            <Cell rowId={rowId} type="yearFactNormTime" verticalText>{factNormTime['year']}</Cell>
            <Cell rowId={rowId} type="yearFactTime" verticalText>{factTime['year']}</Cell>
    </Fragment>;
    const mounthsPlanData = mounthList.map(mounth => <Fragment key={mounth}>
        <Cell editable verticalText rowId={rowId} textareaCols={10} type={`planWork ${mounth}`}>{planWork[mounth as keyof IMounthData]}</Cell>
        <Cell editable verticalText rowId={rowId} textareaCols={10} type={`planTime ${mounth}`}>{planTime[mounth as keyof IMounthData]}</Cell>
        <Cell editable verticalText rowId={rowId} textareaCols={10} type={`factWork ${mounth}`}>{factWork[mounth as keyof IMounthData]}</Cell>
        <Cell editable verticalText rowId={rowId} textareaCols={10} type={`factNormTime ${mounth}`}>{factNormTime[mounth as keyof IMounthData]}</Cell>
        <Cell editable verticalText rowId={rowId} textareaCols={10} type={`factTime ${mounth}`}>{factTime[mounth as keyof IMounthData]}</Cell>
    </Fragment>);

    return (
        <StyledRow>
            {/* {sectionIsShow && <Cell rowId={rowId} textareaRows={4} type="section" rowSpan={sectionVSpan} editable>{section}</Cell>}
            {subsectionIsShow && <Cell rowId={rowId} textareaRows={4} type="subsection" rowSpan={subsectionVSpan} editable>{subsection}</Cell>}
            <Cell rowId={rowId} type="location">{location}</Cell>
            <Cell rowId={rowId} type="lineClass" verticalText>{lineClass}</Cell>
            <Cell rowId={rowId} type="meter" verticalText>{meter}</Cell>
            <Cell rowId={rowId} type="totalCount" verticalText>{totalCount}</Cell>
            <Cell rowId={rowId} type="yearOfLaunch" verticalText>{yearOfLaunch}</Cell>
            <Cell rowId={rowId} type="periodicityNormal" verticalText>{periodicityNormal}</Cell>
            <Cell rowId={rowId} type="periodicityFact" verticalText>{periodicityFact}</Cell>
            <Cell rowId={rowId} type="periodicityLast" verticalText>{periodicityLast}</Cell>
            <Cell rowId={rowId} type="normOfTime" verticalText>{normOfTime}</Cell>
            <Cell rowId={rowId} type="normOfTimeDocumentSource">{normOfTimeDocumentSource}</Cell>
            <Cell rowId={rowId} type="unity" verticalText>{unity}</Cell> */}
            {columnsInformationData}
            {yearPlanData}
            {mounthsPlanData}
        </StyledRow>
    )
}