import Input from "antd/es/input";
import Button from "antd/es/button";
import Select, { DefaultOptionType } from "antd/es/select";
import { ChangeEvent, ReactElement } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

export type TOption<T> = { value: T } & DefaultOptionType;

interface ISelectTransferParamsProps<T> {
  value: number;
  options: TOption<T>[];
  fieldTo: T;
  handleChange: (fieldTo: T, value: number) => void;
  handleAddTransfer?: () => void;
  handleDeleteTransfer?: (() => void) | null;
}

export const SelectTransferParams: <T>(props: ISelectTransferParamsProps<T>) => ReactElement = ({
  value,
  options,
  fieldTo,
  handleChange,
  handleDeleteTransfer,
}) => {
  return (
    <div className="flex border">
      <Input
        value={value}
        type="number"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newValue = Number(e.target.value);
          handleChange(fieldTo, newValue);
        }}
      />
      <Select value={fieldTo} options={options} onChange={(fieldTo) => handleChange(fieldTo, value)} />
      {Boolean(handleDeleteTransfer) && (
        <Button icon={<CloseCircleOutlined />} onClick={() => handleDeleteTransfer && handleDeleteTransfer()} />
      )}
    </div>
  );
};
