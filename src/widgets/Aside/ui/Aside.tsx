import css from "./Aside.module.scss";
import { createClassName } from "shared/lib/createClassName";

interface AsideProps {
  additionalClassName?: string;
}

export function Aside({ additionalClassName }: AsideProps) {
  return <div className={createClassName(css.Aside, {}, [additionalClassName])}>
    <div>1</div>
    <div>1</div>
    <div>1</div>
    <div>1</div>
    <div>1</div>
  </div>;
}
