import { months } from "@/1shared/types/date";
import { TAllMonthStatuses } from "@/2entities/pprTable";

export function isAllMonthsPprStatusesIsDone(monthsStatuses: TAllMonthStatuses) {
  let result = true;
  months.forEach((month) => {
    if (monthsStatuses[month] !== "done") {
      result = false;
    }
  });
  return result;
}
