import css from "./Top.module.scss";
import { createClassName } from "shared/lib/createClassName";

interface TopProps {
  additionalClassName?: string;
}

function Top({ additionalClassName }: TopProps) {
  return (
    <header className={createClassName(css.Top, {}, [additionalClassName])}>
      <h1>Цифровая дистанция электроснабжения. ППР</h1>
    </header>
  );
}

export { Top };
