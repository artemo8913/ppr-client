import { ReactElement } from "react";
import Button from "antd/es/button";
import { InputNumberProps, Space } from "antd";
import TypedInputNumber from "antd/es/input-number";
import { CloseCircleOutlined } from "@ant-design/icons";
import Select from "antd/es/select";

import { OptionType } from "@/1shared/lib/form/TOptionType";

interface ISelectTransferParamsProps<T> {
  value: number;
  options: (OptionType<T> & { planWork: number })[];
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
        optionRender={(option) => (
          <Space>
            {option.data.label}({option.data.planWork})
          </Space>
        )}
        onChange={(fieldTo) => handleChange(fieldTo, value)}
      />
      {Boolean(handleDeleteTransfer) && (
        <Button icon={<CloseCircleOutlined />} onClick={() => handleDeleteTransfer && handleDeleteTransfer()} />
      )}
    </div>
  );
};
