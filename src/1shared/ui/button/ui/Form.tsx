import { ComponentProps, FC, ReactNode } from "react";
import { Submit } from "./Submit";

interface IPprTableUpdateFormProps extends ComponentProps<typeof Submit> {
  action: () => Promise<void>;
  children?: ReactNode;
}

export const Form: FC<IPprTableUpdateFormProps> = async ({ action, children, ...otherProps }) => {
  return (
    <form className="inline" action={action}>
      <Submit {...otherProps}>{children}</Submit>
    </form>
  );
};
