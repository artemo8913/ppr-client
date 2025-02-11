const charsCouplesRuEn = {
  "А": "A",
  "Б": "B",
  "В": "V",
  "Г": "G",
  "Д": "D",
  "Е": "E",
  "Ё": "YO",
  "Ж": "ZH",
  "З": "Z",
  "И": "I",
  "Й": "YO",
  "К": "K",
  "Л": "L",
  "М": "M",
  "Н": "N",
  "О": "O",
  "П": "P",
  "Р": "R",
  "С": "S",
  "Т": "T",
  "У": "U",
  "Ф": "F",
  "Х": "H",
  "Ц": "C",
  "Ч": "CH",
  "Ш": "SH",
  "Щ": "SH",
  "Ъ": "",
  "Ы": "UE",
  "Ь": "",
  "Э": "E",
  "Ю": "YOU",
  "Я": "YA",
};

export function transliterateRuToEn(string: string): string {
  return string
    .split("")
    .map((char) => {
      if (char in charsCouplesRuEn) {
        return charsCouplesRuEn[char as keyof typeof charsCouplesRuEn];
      }
      return char;
    })
    .join("");
}
