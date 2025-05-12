import { FC } from "react";
import Select from "antd/es/select";

import { OptionType } from "@/1shared/lib/form/TOptionType";

export type TTransferStrategyOption = "NULL" | "PERIOD";

interface ISelectTransferStrategyProps {
  handleChange: (value: TTransferStrategyOption) => void;
  defaultValue?: TTransferStrategyOption;
}

export const SelectTransferStrategy: FC<ISelectTransferStrategyProps> = ({ handleChange, defaultValue }) => {
  return (
    <Select<TTransferStrategyOption, OptionType<TTransferStrategyOption>>
      defaultValue={defaultValue || "NULL"}
      options={[
        { value: "NULL", label: "не переносить" },
        { value: "PERIOD", label: "перенести на/с :" },
      ]}
      onChange={handleChange}
    />
  );
};
