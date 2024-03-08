import { ServerSubmitButton } from "@/1shared/ui/button";
import { FC } from "react";

interface IPprTableUpdateFormProps {
  action: () => Promise<void>;
}

export const PprTableUpdateButton: FC<IPprTableUpdateFormProps> = async ({ action }) => {
  return (
    <ServerSubmitButton
      type="primary"
      action={async () => {
        "use server";
      }}
    >
      Сохранить
    </ServerSubmitButton>
  );
};
