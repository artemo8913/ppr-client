"use client";
import { FC, useState } from "react";
import Input from "antd/es/input";
import Form from "antd/es/form";
import FormItem from "antd/es/form/FormItem";
import Button from "antd/es/button";
import DatePicker from "antd/es/date-picker";
import { Dayjs } from "dayjs";

import { createPprTable } from "@/2entities/ppr";

interface ICreatePprFormProps {
  onFinish?: () => void;
}

type TNewPprForm = { name: string; year: Dayjs };

export const CreatePprForm: FC<ICreatePprFormProps> = ({ onFinish }) => {
  const [form] = Form.useForm<TNewPprForm>();

  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: TNewPprForm) => {
    setIsLoading(true);
    await createPprTable(values.name, values.year.year());
    form.resetFields();
    setIsLoading(false);
    onFinish && onFinish();
  };

  return (
    <Form
      form={form}
      name="create_ppr"
      onFinish={handleFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      disabled={isLoading}
    >
      <FormItem<TNewPprForm>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Введите наименование!" }]}
      >
        <Input />
      </FormItem>
      <FormItem<TNewPprForm>
        label="Год"
        name="year"
        rules={[{ type: "object", required: true, message: "Выберите год!" }]}
      >
        <DatePicker picker="year" />
      </FormItem>
      <FormItem wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Добавить
        </Button>
      </FormItem>
    </Form>
  );
};
