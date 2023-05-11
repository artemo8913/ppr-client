import css from "./Top.module.scss";
import { SidebarSwitcher } from "widgets/SidebarSwitcher";
import { createClassName } from "shared/lib/createClassName";

interface TopProps {
  additionalClassName?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

function Top({ additionalClassName, isSidebarOpen, toggleSidebar }: TopProps) {
  return (
    <header className={createClassName(css.Top, {}, [additionalClassName])}>
      <SidebarSwitcher isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h1>Цифровая дистанция электроснабжения. ППР</h1>
    </header>
  );
}

export { Top };
