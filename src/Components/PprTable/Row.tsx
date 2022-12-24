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
    const mounthsData = mounthsName.map(mounth => <>
        <Cell editable verticalText id={id} type={`planWork ${mounth}`}>{planWork[mounth]}</Cell>
        <Cell editable verticalText id={id} type={`planTime ${mounth}`}>{planTime[mounth]}</Cell>
        <Cell editable verticalText id={id} type={`factWork ${mounth}`}>{factWork[mounth]}</Cell>
        <Cell editable verticalText id={id} type={`factNormTime ${mounth}`}>{factNormTime[mounth]}</Cell>
        <Cell editable verticalText id={id} type={`factTime ${mounth}`}>{factTime[mounth]}</Cell>
    </>);

    return (
        <StyledRow>
            {sectionIsShow && <Cell id={id} type="section" rowSpan={sectionSpan} editable>{section}</Cell>}
            {subsectionIsShow && <Cell id={id} type="subsection" rowSpan={subsectionSpan} editable>{subsection}</Cell>}
            <Cell id={id} type="location">{location}</Cell>
            <Cell id={id} type="lineClass">{lineClass}</Cell>
            <Cell id={id} type="meter">{meter}</Cell>
            <Cell id={id} type="totalCount">{totalCount}</Cell>
            <Cell id={id} type="yearOfLaunch">{yearOfLaunch}</Cell>
            <Cell id={id} type="periodicityNormal">{periodicityNormal}</Cell>
            <Cell id={id} type="periodicityFact">{periodicityFact}</Cell>
            <Cell id={id} type="periodicityLast">{periodicityLast}</Cell>
            <Cell id={id} type="normOfTime">{normOfTime}</Cell>
            <Cell id={id} type="normOfTimeDocumentSource">{normOfTimeDocumentSource}</Cell>
            <Cell id={id} type="unity">{unity}</Cell>
            <Cell id={id} type="yearPlanWork">{yearPlanWork}</Cell>
            <Cell id={id} type="yearPlanTime">{yearPlanTime}</Cell>
            <Cell id={id} type="yearFactWork">{yearFactWork}</Cell>
            <Cell id={id} type="yearFactNormTime">{yearFactNormTime}</Cell>
            <Cell id={id} type="yearFactTime">{yearFactTime}</Cell>
            {mounthsData}
        </StyledRow>
    )
}