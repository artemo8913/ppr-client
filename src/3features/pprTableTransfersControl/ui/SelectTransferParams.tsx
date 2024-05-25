import Input from "antd/es/input";
import Select, { DefaultOptionType } from "antd/es/select";
import { ChangeEvent, FC, ReactElement } from "react";

export type TOption<T> = { value: keyof T } & DefaultOptionType;

interface ISelectTransferParamsProps<T> {
  value: number;
  options: TOption<T>[];
  fieldTo: keyof T;
  handleChange: (fieldTo: keyof T, value: number) => void;
}

export const SelectTransferParams: <T>(props: ISelectTransferParamsProps<T>) => ReactElement = ({
  value,
  options,
  fieldTo,
  handleChange,
}) => {
  return (
    <div>
      <Input
        value={value}
        type="number"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newValue = Number(e.target.value);
          handleChange(fieldTo, newValue);
        }}
      />
      <Select value={fieldTo} options={options} onChange={(fieldTo) => handleChange(fieldTo, value)} />
    </div>
  );
};
