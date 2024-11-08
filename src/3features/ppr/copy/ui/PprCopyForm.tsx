"use client";
import { FC } from "react";
import Form from "antd/es/form";
import FormItem from "antd/es/form/FormItem";
import Input from "antd/es/input/Input";
import { DatePicker } from "antd";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox/Checkbox";
import { Dayjs } from "dayjs";

type TCopyPprForm = {
  name: string;
  year: Dayjs;
  isCopyPlanValues?: boolean;
  isCopyFactValues?: boolean;
};

interface IPprCopyFormProps {
  pprId: number;
  onFinish?: () => void;
}

export const PprCopyForm: FC<IPprCopyFormProps> = ({ pprId, onFinish }) => {
  const [form] = Form.useForm<TCopyPprForm>();

  const handleFinish = async (values: TCopyPprForm) => {
    console.log(values);
    // await createPprTable(values.name, values.year.year());
    form.resetFields();

    if (onFinish) {
      onFinish();
    }
  };

  return (
    <Form
      form={form}
      name="copy_ppr"
      onFinish={handleFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <FormItem<TCopyPprForm>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Введите наименование" }]}
      >
        <Input />
      </FormItem>
      <FormItem<TCopyPprForm>
        label="Год"
        name="year"
        rules={[{ type: "object", required: true, message: "Выберите год" }]}
      >
        <DatePicker picker="year" />
      </FormItem>
      <FormItem<TCopyPprForm>
        label="Копировать запланированный объем работ"
        name="isCopyPlanValues"
        valuePropName="checked"
      >
        <Checkbox />
      </FormItem>
      <FormItem<TCopyPprForm>
        label="Копировать выполненный объем работ"
        name="isCopyFactValues"
        valuePropName="checked"
      >
        <Checkbox />
      </FormItem>
      <FormItem<TCopyPprForm> wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Копировать
        </Button>
      </FormItem>
    </Form>
  );
};
