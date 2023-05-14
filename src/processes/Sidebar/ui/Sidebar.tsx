import css from "./Sidebar.module.scss";

import { pagesPaths } from "pages";

import { ThemeSwitcher } from "widgets/ThemeSwitcher";

import { AppLink } from "shared/ui/AppLink/AppLink";
import { createClassName } from "shared/lib/createClassName";
import HomeIcon from "shared/assets/icons/homeIcon.svg";
import ContactSupportIcon from "shared/assets/icons/contactSupport.svg";
import { LanguageSwitcher } from "widgets/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  additionalClassName?: string;
  isOpen: boolean;
}

function Sidebar({ additionalClassName, isOpen }: SidebarProps) {
  const { t } = useTranslation();
  return (
    <div data-testid="sidebar" className={createClassName(css.Sidebar, { [css.open]: isOpen }, [additionalClassName])}>
      <AppLink to={pagesPaths.main}>
        <HomeIcon className={css.icon} />
        <span className={css.text}>{t("main_page")}</span>
      </AppLink>
      <AppLink to={pagesPaths.about}>
        <ContactSupportIcon className={css.icon} />
        <span className={css.text}>{t("about_page")}</span>
      </AppLink>
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  );
}
export { Sidebar };
