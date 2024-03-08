export function excludeFromList(fullList: Array<string>, excludedList: Array<string> = []) {
  return fullList.filter((el) => excludedList.indexOf(el) === -1);
}
