import { QuarterColors } from "../../../tailwind.config";

// TODO: мне не нравится, что к типам данная функция вообще не привязана (на входе используется просто строка)
export function setBgColor(type: string): QuarterColors | undefined {
  // 1 квартал
  if (type.startsWith("jan_plan") || type.startsWith("feb_plan") || type.startsWith("mar_plan")) {
    return QuarterColors.FIRST_QUARTER;
  } else if (type.startsWith("jan_fact") || type.startsWith("feb_fact") || type.startsWith("mar_fact")) {
    return QuarterColors.FIRST_QUARTER_TRANSPARENT;
  }
  // 2 квартал
  if (type.startsWith("apr_plan") || type.startsWith("may_plan") || type.startsWith("june_plan")) {
    return QuarterColors.SECOND_QARTER;
  } else if (type.startsWith("apr_fact") || type.startsWith("may_fact") || type.startsWith("june_fact")) {
    return QuarterColors.SECOND_QARTER_TRANSPARENT;
  }
  // 3 квартал
  if (type.startsWith("july_plan") || type.startsWith("aug_plan") || type.startsWith("sept_plan")) {
    return QuarterColors.THIRD_QARTER;
  } else if (type.startsWith("july_fact") || type.startsWith("aug_fact") || type.startsWith("sept_fact")) {
    return QuarterColors.THIRD_QARTER_TRANSPARENT;
  }
  // 4 квартал
  if (type.startsWith("oct_plan") || type.startsWith("nov_plan") || type.startsWith("dec_plan")) {
    return QuarterColors.FOURTH_QARTER;
  } else if (type.startsWith("oct_fact") || type.startsWith("nov_fact") || type.startsWith("dec_fact")) {
    return QuarterColors.FOURTH_QARTER_TRANSPARENT;
  }
}
