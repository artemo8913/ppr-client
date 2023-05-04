export enum pagesEnum {
  MAIN = "main",
  ABOUT = "about",
  NOT_FOUND = "not_found",
}
export const pagesPaths: Record<pagesEnum, string> = {
  [pagesEnum.MAIN]: "/",
  [pagesEnum.ABOUT]: "/about",
  [pagesEnum.NOT_FOUND]: "*",
};