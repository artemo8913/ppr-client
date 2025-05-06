export const NUMBER_WITH_DOT_OR_COMMA_PATTERN = "^[0-9]+[.,]?[0-9]*$";

export const NUMBER_WITH_DOT_PATTERN = "^[0-9]+[.]?[0-9]*$";

export function isSimilarToNumber(string: string): boolean {
  return new RegExp(NUMBER_WITH_DOT_OR_COMMA_PATTERN).test(string);
}

export function convertCommaToDot(string: string): string {
  return string.replace(",", ".");
}
