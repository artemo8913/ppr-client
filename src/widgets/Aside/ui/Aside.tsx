import css from "./Aside.module.scss";
import { createClassName } from "shared/lib/createClassName";

interface AsideProps {
  additionalClassName?: string;
  isOpen: boolean;
  children?: JSX.Element | JSX.Element[];
}

interface AsideSwitcherProps {
  additionalClassName?: string;
  isOpen: boolean;
  toggle: () => void;
}

function AsideSwitcher({ isOpen, toggle, additionalClassName }: AsideSwitcherProps) {
  return <button onClick={toggle}>Перелючить aside</button>;
}

function Aside({ additionalClassName, isOpen, children }: AsideProps) {
  return <div className={createClassName(css.Aside, { [css.open]: isOpen }, [additionalClassName])}>{children}</div>;
}
export { Aside, AsideSwitcher };
