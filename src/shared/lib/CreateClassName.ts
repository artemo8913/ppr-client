type Mods = Record<string, boolean | string>;

function createClassName(primaryClassName: string, mods: Mods = {}, additional: Array<string> = []): string {
  return [
    primaryClassName,
    ...Object.entries(mods)
      .filter(([_, condition]) => Boolean(condition))
      .map(([mod, _]) => mod),
    ...additional.filter(Boolean),
  ]
    .join(" ")
    .trim();
}
export { createClassName };
