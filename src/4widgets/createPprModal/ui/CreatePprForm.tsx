"use client";
import { FC } from "react";
import Input from "antd/es/input";
import Form from "antd/es/form";
import FormItem from "antd/es/form/FormItem";
import Button from "antd/es/button";
import { IPpr, addPprTable } from "@/2entities/ppr";
import { useSession } from "next-auth/react";
import { createNewPprInstance } from "../lib/createNewPprInstance";
import DatePicker, { DatePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";

interface ICreatePprFormProps {
  onFinish?: () => void;
}

type TNewPprForm = { name: string; year: Dayjs };

export const CreatePprForm: FC<ICreatePprFormProps> = ({ onFinish }) => {
  const [form] = Form.useForm<TNewPprForm>();
  const session = useSession();

  const handleFinish = async (values: TNewPprForm) => {
    if (!session.data?.user) {
      throw new Error("не авторизован");
    }
    await addPprTable(createNewPprInstance(session.data, { name: values.name, year: values.year.year() }));
    form.resetFields();
    onFinish && onFinish();
  };

  return (
    <Form
      form={form}
      name="create_ppr"
      onFinish={handleFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <FormItem<IPpr> label="Наименование" name="name" rules={[{ required: true, message: "Введите наименование!" }]}>
        <Input />
      </FormItem>
      <Form.Item<IPpr> label="Год" name="year" rules={[{ type: "object", required: true, message: "Выберите год!" }]}>
        <DatePicker picker="year" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};
