import css from "./LanguageSwitcher.module.scss";
import { createClassName } from "shared/lib/createClassName";
import { LocalesEnum } from "shared/config/i18n/i18n";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  additionalClassName?: string;
}

export function LanguageSwitcher({ additionalClassName }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const toggleLanguage = () => {
    i18n.changeLanguage(currentLanguage === LocalesEnum.RU ? LocalesEnum.EN : LocalesEnum.RU);
  };
  return (
    <button onClick={toggleLanguage} className={createClassName(css.LanguageSwitcher, {}, [additionalClassName])}>
      {t("locale_short")}
    </button>
  );
}
