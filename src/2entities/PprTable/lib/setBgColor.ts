import { TMonths } from "@/1shared/types/date";
import { QuarterColors } from "../../../../tailwind.config";

export function setQuartaerBgColor(type: TMonths, isTransparent?: boolean): QuarterColors | undefined {
  if (type.endsWith("jan") || type.endsWith("feb") || type.endsWith("mar")) {
    return isTransparent ? QuarterColors.FIRST_QUARTER_TRANSPARENT : QuarterColors.FIRST_QUARTER;
  } else if (type.endsWith("apr") || type.endsWith("may") || type.endsWith("june")) {
    return isTransparent ? QuarterColors.SECOND_QARTER_TRANSPARENT : QuarterColors.SECOND_QARTER;
  } else if (type.endsWith("july") || type.endsWith("aug") || type.endsWith("sept")) {
    return isTransparent ? QuarterColors.THIRD_QARTER_TRANSPARENT : QuarterColors.THIRD_QARTER;
  } else if (type.endsWith("oct") || type.endsWith("nov") || type.endsWith("dec")) {
    return isTransparent ? QuarterColors.FOURTH_QARTER_TRANSPARENT : QuarterColors.FOURTH_QARTER;
  }
}
