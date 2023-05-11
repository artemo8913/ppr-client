import css from "./Sidebar.module.scss";
import { pagesPaths } from "pages";
import { AppLink } from "shared/ui/AppLink/AppLink";
import { createClassName } from "shared/lib/createClassName";
import HomeIcon from "shared/assets/icons/homeIcon.svg";
import ContactSupportIcon from "shared/assets/icons/contactSupport.svg";

interface SidebarProps {
  additionalClassName?: string;
  isOpen: boolean;
}

function Sidebar({ additionalClassName, isOpen }: SidebarProps) {
  return (
    <div className={createClassName(css.Sidebar, { [css.open]: isOpen }, [additionalClassName])}>
      <AppLink to={pagesPaths.main}>
        <HomeIcon className={css.icon} />
        <span className={css.text}>Главная страница</span>
      </AppLink>
      <AppLink to={pagesPaths.about}>
        <ContactSupportIcon className={css.icon} />
        <span className={css.text}>О сайте</span>
      </AppLink>
    </div>
  );
}
export { Sidebar };
