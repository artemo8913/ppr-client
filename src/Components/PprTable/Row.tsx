import { Fragment } from "react";
import styled from "styled-components";
import { IRow } from "../../Interface";
import Cell from "./Cell";

const StyledRow = styled.tr`
    &:hover{
        box-shadow: inset 0px 0px 10px #00ff1e;
    }
`;

export default function Row(props: IRow) {
    const {
        id,
        index_number,
        type,
        section,
        subsection,
        location,
        lineClass,
        meter,
        totalCount,
        yearOfLaunch,
        periodicityNormal,
        periodicityFact,
        periodicityLast,
        normOfTime,
        normOfTimeDocumentSource,
        unity,
        yearPlanWork,
        yearPlanTime,
        yearFactWork,
        yearFactNormTime,
        yearFactTime,
        planWork,
        planTime,
        factWork,
        factNormTime,
        factTime,
        sectionIsShow,
        subsectionIsShow,
        sectionSpan,
        subsectionSpan,
    } = props;
    const mounthsName = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"] as const;
    const mounthsData = mounthsName.map(mounth => <Fragment key={mounth}>
        <Cell editable verticalText rowId={id} textareaCols={10} type={`planWork ${mounth}`}>{planWork[mounth]}</Cell>
        <Cell editable verticalText rowId={id} textareaCols={10} type={`planTime ${mounth}`}>{planTime[mounth]}</Cell>
        <Cell editable verticalText rowId={id} textareaCols={10} type={`factWork ${mounth}`}>{factWork[mounth]}</Cell>
        <Cell editable verticalText rowId={id} textareaCols={10} type={`factNormTime ${mounth}`}>{factNormTime[mounth]}</Cell>
        <Cell editable verticalText rowId={id} textareaCols={10} type={`factTime ${mounth}`}>{factTime[mounth]}</Cell>
    </Fragment>);

    return (
        <StyledRow>
            {sectionIsShow && <Cell rowId={id} textareaRows={4} type="section" rowSpan={sectionSpan} editable>{section}</Cell>}
            {subsectionIsShow && <Cell rowId={id} textareaRows={4} type="subsection" rowSpan={subsectionSpan} editable>{subsection}</Cell>}
            <Cell rowId={id} type="location">{location}</Cell>
            <Cell rowId={id} type="lineClass" verticalText>{lineClass}</Cell>
            <Cell rowId={id} type="meter" verticalText>{meter}</Cell>
            <Cell rowId={id} type="totalCount" verticalText>{totalCount}</Cell>
            <Cell rowId={id} type="yearOfLaunch" verticalText>{yearOfLaunch}</Cell>
            <Cell rowId={id} type="periodicityNormal" verticalText>{periodicityNormal}</Cell>
            <Cell rowId={id} type="periodicityFact" verticalText>{periodicityFact}</Cell>
            <Cell rowId={id} type="periodicityLast" verticalText>{periodicityLast}</Cell>
            <Cell rowId={id} type="normOfTime" verticalText>{normOfTime}</Cell>
            <Cell rowId={id} type="normOfTimeDocumentSource">{normOfTimeDocumentSource}</Cell>
            <Cell rowId={id} type="unity" verticalText>{unity}</Cell>
            <Cell rowId={id} type="yearPlanWork" verticalText>{yearPlanWork}</Cell>
            <Cell rowId={id} type="yearPlanTime" verticalText>{yearPlanTime}</Cell>
            <Cell rowId={id} type="yearFactWork" verticalText>{yearFactWork}</Cell>
            <Cell rowId={id} type="yearFactNormTime" verticalText>{yearFactNormTime}</Cell>
            <Cell rowId={id} type="yearFactTime" verticalText>{yearFactTime}</Cell>
            {mounthsData}
        </StyledRow>
    )
}