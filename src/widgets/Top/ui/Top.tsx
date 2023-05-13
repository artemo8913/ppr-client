import css from "./Top.module.scss";
import { SidebarSwitcher } from "widgets/SidebarSwitcher";
import { createClassName } from "shared/lib/createClassName";
import { useTranslation } from "react-i18next";

interface TopProps {
  additionalClassName?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

function Top({ additionalClassName, isSidebarOpen, toggleSidebar }: TopProps) {
  const { t } = useTranslation();
  return (
    <header className={createClassName(css.Top, {}, [additionalClassName])}>
      <SidebarSwitcher isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h1>{t("main_title")}</h1>
    </header>
  );
}

export { Top };
