import { ReactElement } from "react";
import Button from "antd/es/button";
import { InputNumberProps } from "antd";
import TypedInputNumber from "antd/es/input-number";
import { CloseCircleOutlined } from "@ant-design/icons";
import Select from "antd/es/select";

import { TOptionType } from "@/1shared/types/TOptionType";

interface ISelectTransferParamsProps<T> {
  value: number;
  options: TOptionType<T>[];
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
  const handleValueUpdate: InputNumberProps["onChange"] = (value) => {
    const newValue = Number(value);
    handleChange(fieldTo, newValue);
  };

  return (
    <div className="flex border">
      <TypedInputNumber className="w-full" value={value} onChange={handleValueUpdate} />
      <Select
        className="flex-1"
        value={fieldTo}
        options={options}
        onChange={(fieldTo) => handleChange(fieldTo, value)}
      />
      {Boolean(handleDeleteTransfer) && (
        <Button icon={<CloseCircleOutlined />} onClick={() => handleDeleteTransfer && handleDeleteTransfer()} />
      )}
    </div>
  );
};
