import css from "./AppLink.module.scss";
import { createClassName } from "shared/lib/createClassName";
import { Link, LinkProps } from "react-router-dom";

interface AppLinkProps extends LinkProps {
  additionalClassName?: string;
}

export function AppLink({ additionalClassName, children, to }: AppLinkProps) {
  return (
    <Link to={to} className={createClassName(css.AppLink, {}, [additionalClassName])}>
      {children}
    </Link>
  );
}
