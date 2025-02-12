export function roundToFixed(number: string | number, fractionDigits = 4) {
  return Number(Number(number).toFixed(fractionDigits));
}
