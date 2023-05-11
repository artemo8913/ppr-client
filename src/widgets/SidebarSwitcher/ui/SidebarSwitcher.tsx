import css from "./SidebarSwitcher.module.scss";
import { createClassName } from "shared/lib/createClassName";
import MenuIcon from "shared/assets/icons/menuIcon.svg";

interface SidebarSwitcherProps {
  additionalClassName?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function SidebarSwitcher({ isSidebarOpen, toggleSidebar, additionalClassName }: SidebarSwitcherProps) {
  return (
    <button
      className={createClassName(css.SidebarSwitcher, { [css.isOpen]: isSidebarOpen }, [additionalClassName])}
      onClick={toggleSidebar}
    >
      <MenuIcon />
    </button>
  );
}
