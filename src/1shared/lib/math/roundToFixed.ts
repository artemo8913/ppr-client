// TODO: при неверном преобразовании получится NaN, что не есть хорошо. Возможно эта функция самая используемая
export function roundToFixed(number: string | number, fractionDigits = 4) {
  return Number(Number(number).toFixed(fractionDigits));
}
