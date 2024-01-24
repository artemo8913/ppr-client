import Cell from "@/2entities/PprTable/ui/Cell";
import Row from "@/2entities/PprTable/ui/Row";
import data from "@/2entities/PprTable/mock/rowData";
import settings, {
  fullInfoColumnsList,
  fullMonthsList,
  fullWorkAndTimeColumnsList,
} from "@/2entities/PprTable/model/pprSettings";

function excludeFromList(fullList: Array<string>, excludedList: Array<string> = []) {
  return fullList.filter((el) => excludedList.indexOf(el) === -1);
}

export default function Home() {
  const hiddenColumnsList = [...settings.hiddenPprColumns["none"]];
  const editableList = [...settings.editablePprColumns["none"]];
  const infoColumnList = excludeFromList(fullInfoColumnsList, hiddenColumnsList);
  const titleInfoColumnList = excludeFromList(fullInfoColumnsList, ["subsection_first", ...hiddenColumnsList]);
  const workAndTimeColumnList = excludeFromList(fullWorkAndTimeColumnsList, hiddenColumnsList);
  const monthList = excludeFromList(fullMonthsList, hiddenColumnsList);
  return (
    <main>
      <div className="bg-slate-600">
        Главная страница
        <table>
          <tbody>
            {data.map((rowData) => (
              <Row
                key={rowData.id}
                data={rowData}
                editableColumnsList={editableList}
                infoColumnsList={infoColumnList}
                monthList={monthList}
                workAndTimeColumnsList={workAndTimeColumnList}
                sectionVSpan={1}
                subsectionVSpan={1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
