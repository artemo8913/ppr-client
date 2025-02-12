import { FC } from "react";
import Select, { DefaultOptionType } from "antd/es/select";

export type TTransferStrategyOption = "NULL" | "PERIOD";

interface ISelectTransferStrategyProps {
  handleChange: (value: TTransferStrategyOption) => void;
  defaultValue?: TTransferStrategyOption;
}

export const SelectTransferStrategy: FC<ISelectTransferStrategyProps> = ({ handleChange, defaultValue }) => {
  return (
    <Select<TTransferStrategyOption, { value: TTransferStrategyOption } & DefaultOptionType>
      defaultValue={defaultValue || "NULL"}
      options={[
        { value: "NULL", label: "не переносить" },
        { value: "PERIOD", label: "перенести на/с :" },
      ]}
      onChange={handleChange}
    />
  );
};
