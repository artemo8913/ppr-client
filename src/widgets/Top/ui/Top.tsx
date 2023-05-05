import css from "./Top.module.scss";
import { createClassName } from "shared/lib/createClassName";

interface TopProps {
  additionalClassName?: string;
  children?: JSX.Element | JSX.Element[];
}

function Top({ additionalClassName, children }: TopProps) {
  return <header className={createClassName(css.Top, {}, [additionalClassName])}>{children}</header>;
}

export { Top };
