import css from "./MainPage.module.scss";
import { createClassName } from "shared/lib/createClassName";
import { useTranslation } from "react-i18next";

interface MainPageProps {
  additionalClassName?: string;
}

export function MainPage({ additionalClassName }: MainPageProps) {
  const { t } = useTranslation();
  return <div className={createClassName(css.MainPage, {}, [additionalClassName])}>{t("hello")}</div>;
}
