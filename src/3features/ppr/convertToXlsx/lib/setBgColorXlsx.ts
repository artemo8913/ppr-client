export function setBgColorXlsx(field: string): string | undefined {
  // 1 квартал
  if (field.startsWith("jan_plan") || field.startsWith("feb_plan") || field.startsWith("mar_plan")) {
    return "FF6977FF";
  } else if (field.startsWith("jan_fact") || field.startsWith("feb_fact") || field.startsWith("mar_fact")) {
    return "FF9BA5FF";
  }
  // 2 квартал
  if (field.startsWith("apr_plan") || field.startsWith("may_plan") || field.startsWith("june_plan")) {
    return "FF44FE5A";
  } else if (field.startsWith("apr_fact") || field.startsWith("may_fact") || field.startsWith("june_fact")) {
    return "FF98FEA4";
  }
  // 3 квартал
  if (field.startsWith("july_plan") || field.startsWith("aug_plan") || field.startsWith("sept_plan")) {
    return "FF08F6D4";
  } else if (field.startsWith("july_fact") || field.startsWith("aug_fact") || field.startsWith("sept_fact")) {
    return "FFA6FCF0";
  }
  // 4 квартал
  if (field.startsWith("oct_plan") || field.startsWith("nov_plan") || field.startsWith("dec_plan")) {
    return "FFFFA543";
  } else if (field.startsWith("oct_fact") || field.startsWith("nov_fact") || field.startsWith("dec_fact")) {
    return "FFFFCA8F";
  }
}
